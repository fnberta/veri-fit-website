import firestore from '@google-cloud/firestore';
import admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { DateTime } from 'luxon';
import {
  ChangeType,
  Collection,
  CreateSessionsPayload,
  parseHandledSessionUpdate,
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
      console.info(`operation: ${res[0].name} to backup db started`);
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
  .onCreate((snap) => {
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

    return batch.commit();
  });

function getSessionsForTrainingQuery(trainingId: string, startingFrom?: string): Query {
  let query = db.collection(Collection.SESSIONS).where('trainingId', '==', trainingId).where('confirmed', '==', false);
  if (startingFrom != null) {
    query = query.where('date', '>=', startingFrom);
  }

  return query;
}

// TODO: should create new sessions if runsFrom changes to an earlier week
function makeTrainingAndSessionsUpdater(
  sessionInput: SessionInput,
  trainingId: string,
  includePast: boolean,
): UpdateFunction<void> {
  const trainingsRef = db.collection(Collection.TRAININGS).doc(trainingId);
  const sessionsQuery = getSessionsForTrainingQuery(trainingId, includePast ? undefined : sessionInput.date);
  const trainingInput: TrainingInput = {
    type: sessionInput.type,
    runsFrom: sessionInput.runsFrom,
    time: sessionInput.time,
    clientIds: sessionInput.clientIds,
  };

  return async (t) => {
    const sessionsSnap = await t.get(sessionsQuery);
    t.set(trainingsRef, trainingInput);
    sessionsSnap.forEach((snap) => {
      const session = parseSession(snap);
      const date = DateTime.fromISO(session.date);
      const { weekday } = DateTime.fromISO(sessionInput.runsFrom);
      t.set(snap.ref, {
        ...sessionInput,
        trainingId,
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
  if (type === ChangeType.SINGLE) {
    return db.collection(Collection.SESSIONS).doc(sessionId).set(sessionInput);
  } else {
    const { trainingId } = sessionInput;
    if (trainingId == null) {
      throw new functions.https.HttpsError(
        'invalid-argument',
        'The function must be called with a session that is associated with a training.',
      );
    }

    switch (type) {
      case ChangeType.ALL_FOLLOWING: {
        // TODO: ensure all sessions up to this date are created
        return db.runTransaction(makeTrainingAndSessionsUpdater(sessionInput, trainingId, false));
      }
      case ChangeType.ALL_NON_CONFIRMED: {
        return db.runTransaction(makeTrainingAndSessionsUpdater(sessionInput, trainingId, true));
      }
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
    sessionsSnap.forEach((snap) => {
      batch.delete(snap.ref);
    });
    return batch.commit();
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
export const updateTrainingsLeft = functions.firestore
  .document('sessions/{sessionId}')
  .onUpdate(async (change, context) => {
    const after = parseSession(change.after);
    if (after.statusReverted === true) {
      // session's confirmed status was reverted because updating of trainingsLeft failed, abort early
      return Promise.resolve();
    }
    if (after.type !== TrainingType.YOGA && after.type !== TrainingType.PERSONAL) {
      // session does not belong to a training type where trainingsLeft needs to be updated, abort early
      return Promise.resolve();
    }
    if (after.clientIds.length === 0) {
      // no clients attached to this session, abort early
      return Promise.resolve();
    }

    const before = parseSession(change.before);
    if (after.confirmed === before.confirmed) {
      // confirmed status did not change, abort early
      return Promise.resolve();
    }

    const handledUpdateRef = db.collection(Collection.HANDLED_SESSION_UPDATES).doc(context.eventId);
    const handledUpdateSnap = await handledUpdateRef.get();
    if (handledUpdateSnap.exists && parseHandledSessionUpdate(handledUpdateSnap).trainingsLeftUpdated) {
      // session update was already handled, abort early
      return Promise.resolve();
    }

    const batch = db.batch();
    for (const clientId of after.clientIds) {
      const query = await db
        .collection(Collection.CLIENTS)
        .doc(clientId)
        .collection(Collection.SUBSCRIPTIONS)
        .where('trainingType', '==', after.type)
        .get();
      const subscriptions = query.docs.map(
        (snap) => parseSubscription(snap) as YogaSubscription | PersonalSubscription,
      );
      const subscriptionId = pickSubscriptionId(after.confirmed ? 'confirmed' : 'opened', subscriptions);
      if (subscriptionId) {
        const ref = db
          .collection(Collection.CLIENTS)
          .doc(clientId)
          .collection(Collection.SUBSCRIPTIONS)
          .doc(subscriptionId);
        batch.update(ref, { trainingsLeft: admin.firestore.FieldValue.increment(after.confirmed ? -1 : 1) });
      } else {
        console.error(
          new Error(
            `No valid subscription id found for client ${clientId} when updating trainingsLeft for session ${
              after.id
            }. Aborting and reverting confirmed status back to ${!after.confirmed}.`,
          ),
        );
        return change.after.ref.update({ confirmed: !after.confirmed, statusReverted: true });
      }
    }
    batch.set(handledUpdateRef, { trainingsLeftUpdated: true });
    return batch.commit();
  });
