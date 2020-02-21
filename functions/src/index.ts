import firestore from '@google-cloud/firestore';
import admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { DateTime } from 'luxon';
import {
  ChangeType,
  Collection,
  CreateSessionsPayload,
  parseSession,
  parseSubscription,
  parseTraining,
  PersonalSubscription,
  SessionInput,
  TrainingInput,
  TrainingType,
  UpdateSessionPayload,
  YogaSubscription,
} from './shared';
import { isSubscriptionActive, pickSubscriptionId } from './subscriptions';

type Query = admin.firestore.Query;
type Transaction = admin.firestore.Transaction;
type UpdateFunction<T> = (transaction: Transaction) => Promise<T>;

const BACKUP_BUCKET = 'gs://veri-fit-db-backup';

admin.initializeApp();
const db = admin.firestore();
const client = new firestore.v1.FirestoreAdminClient();

/**
 * Copies a backup of all collections in the database to a Google Storage bucket every 24 hours.
 */
export const backupDatabase = functions.pubsub
  .schedule('every 24 hours')
  .timeZone('Europe/Zurich')
  .onRun(async () => {
    const projectId = process.env.GCP_PROJECT || process.env.GCLOUD_PROJECT;
    const databaseName = client.databasePath(projectId, '(default)');
    try {
      const res = await client.exportDocuments({
        name: databaseName,
        outputUriPrefix: BACKUP_BUCKET,
        collectionIds: [], // means all collections
      });
      console.info(`operation: ${res[0]['name']} to backup db started`);
    } catch (e) {
      console.error('failed to backup db with', e);
    }
  });

// TODO: should run in a transaction, but no proper way to only create a session if it doesn't exists yet without crashing the transaction
export const createSessions = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('failed-precondition', 'The function must be called while authenticated.');
  }

  const { year } = data as CreateSessionsPayload;
  const date = DateTime.fromObject({ weekYear: year });

  const querySnap = await db.collection(Collection.TRAININGS).get();
  for (const snap of querySnap.docs) {
    const training = parseTraining(snap);
    const runsFrom = DateTime.fromISO(training.runsFrom);

    if (runsFrom.weekYear <= date.weekYear) {
      const sameYear = runsFrom.weekYear === date.weekYear;
      for (let i = 1; i <= date.weeksInWeekYear; i++) {
        if (!sameYear || i >= runsFrom.weekNumber) {
          const thisWeek = runsFrom.set({ weekYear: date.weekYear, weekNumber: i });
          const input: SessionInput = {
            trainingId: training.id,
            clientIds: training.clientIds,
            type: training.type,
            runsFrom: training.runsFrom,
            time: training.time,
            date: thisWeek.toISODate(),
            confirmed: false,
          };

          try {
            await db
              .collection(Collection.SESSIONS)
              .doc(`${training.id}-${thisWeek.weekYear}-${thisWeek.weekNumber}`)
              .create(input);
          } catch (e) {
            // no-op, session already exists
          }
        }
      }
    }
  }
});

export const createSessionsOnTrainingCreated = functions.firestore
  .document('trainings/{trainingId}')
  .onCreate(async snap => {
    const training = parseTraining(snap);
    const runsFrom = DateTime.fromISO(training.runsFrom);

    const batch = db.batch();
    for (let i = 1; i <= runsFrom.weeksInWeekYear; i++) {
      if (i >= runsFrom.weekNumber) {
        const thisWeek = runsFrom.set({ weekNumber: i });
        const input: SessionInput = {
          trainingId: training.id,
          type: training.type,
          runsFrom: training.runsFrom,
          time: training.time,
          clientIds: training.clientIds,
          date: thisWeek.toISODate(),
          confirmed: false,
        };

        const ref = db
          .collection(Collection.SESSIONS)
          .doc(`${training.id}-${thisWeek.weekYear}-${thisWeek.weekNumber}`);
        batch.set(ref, input);
      }
    }

    await batch.commit();
  });

function getSessionsForTrainingQuery(trainingId: string, startingFrom?: string): Query {
  let query = db
    .collection(Collection.SESSIONS)
    .where('trainingId', '==', trainingId)
    .where('confirmed', '==', false);
  if (startingFrom != null) {
    query = query.where('date', '>=', startingFrom);
  }

  return query;
}

// TODO: should create new sessions if runsFrom changes to an earlier week
function makeTrainingAndSessionsUpdater(sessionInput: SessionInput, includePast: boolean): UpdateFunction<void> {
  const trainingsRef = db.collection(Collection.TRAININGS).doc(sessionInput.trainingId);
  const sessionsQuery = getSessionsForTrainingQuery(
    sessionInput.trainingId,
    includePast ? undefined : sessionInput.date,
  );
  const trainingInput: TrainingInput = {
    type: sessionInput.type,
    runsFrom: sessionInput.runsFrom,
    time: sessionInput.time,
    clientIds: sessionInput.clientIds,
  };

  return async t => {
    const sessionsSnap = await t.get(sessionsQuery);
    t.set(trainingsRef, trainingInput);
    sessionsSnap.forEach(snap => {
      const session = parseSession(snap);
      const date = DateTime.fromISO(session.date);
      const { weekday } = DateTime.fromISO(sessionInput.runsFrom);
      t.set(snap.ref, {
        ...sessionInput,
        date: date.set({ weekday }).toISODate(),
      });
    });
  };
}

export const updateSession = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('failed-precondition', 'The function must be called while authenticated.');
  }

  const { type, sessionId, sessionInput } = data as UpdateSessionPayload;
  switch (type) {
    case ChangeType.SINGLE: {
      await db
        .collection(Collection.SESSIONS)
        .doc(sessionId)
        .set(sessionInput);
      break;
    }
    case ChangeType.ALL_FOLLOWING: {
      // TODO: ensure all sessions up to this date are created
      await db.runTransaction(makeTrainingAndSessionsUpdater(sessionInput, false));
      break;
    }
    case ChangeType.ALL_NON_CONFIRMED: {
      await db.runTransaction(makeTrainingAndSessionsUpdater(sessionInput, true));
      break;
    }
  }
});

/**
 * Deletes all non-confirmed sessions of a training when it's deleted.
 */
export const deleteSessionsOnTrainingDeleted = functions.firestore
  .document('trainings/{trainingId}')
  .onDelete(async (snap, context) => {
    const training = parseTraining(snap);
    const sessionsQuery = getSessionsForTrainingQuery(context.params.trainingId, training.runsFrom);
    const sessionsSnap = await sessionsQuery.get();
    const batch = db.batch();
    sessionsSnap.forEach(snap => {
      batch.delete(snap.ref);
    });
    await batch.commit();
  });

/**
 * The activeSubscriptions field of a user is a duplication of all currently active subscriptions stored in the
 * subscriptions sub-collection. This function updates this copy whenever a write (create/update/delete) happens to a
 * subscription.
 */
export const setActiveSubscriptions = functions.firestore
  .document('clients/{clientId}/subscriptions/{subscriptionId}')
  .onWrite(async (change, context) => {
    const clientRef = db.collection(Collection.CLIENTS).doc(context.params.clientId);
    const subscriptionSnap = await clientRef.collection(Collection.SUBSCRIPTIONS).get();
    const activeSubscriptions = subscriptionSnap.docs.map(parseSubscription).filter(isSubscriptionActive);
    return clientRef.update({ activeSubscriptions });
  });

/**
 * Updates the trainingsLeft field of a user's subscription when the confirmed status of a session is updated.
 */
export const updateTrainingsLeft = functions.firestore.document('sessions/{sessionId}').onUpdate(async change => {
  const before = parseSession(change.before);
  const after = parseSession(change.after);
  if (after.confirmed !== before.confirmed && [TrainingType.YOGA, TrainingType.PERSONAL].includes(after.type)) {
    const clientSubscriptions = await Promise.all(
      after.clientIds.map(async clientId => {
        const query = await db
          .collection(Collection.CLIENTS)
          .doc(clientId)
          .collection(Collection.SUBSCRIPTIONS)
          .where('trainingType', '==', after.type)
          .get();
        const subscriptions = query.docs.map(parseSubscription) as Array<YogaSubscription | PersonalSubscription>;
        return {
          clientId,
          subscriptionId: pickSubscriptionId(after.confirmed, subscriptions),
        };
      }),
    );

    if (clientSubscriptions.length > 0) {
      const batch = db.batch();
      clientSubscriptions.forEach(({ clientId, subscriptionId }) => {
        const ref = db
          .collection(Collection.CLIENTS)
          .doc(clientId)
          .collection(Collection.SUBSCRIPTIONS)
          .doc(subscriptionId);
        batch.update(ref, { trainingsLeft: admin.firestore.FieldValue.increment(after.confirmed ? -1 : 1) });
      });
      await batch.commit();
    }
  }
});
