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
  SessionInput,
  SubscriptionType,
  TrainingInput,
  UpdateSessionPayload,
} from './shared';

type QuerySnapshot = admin.firestore.QuerySnapshot;

admin.initializeApp();
const db = admin.firestore();

export const createSessions = functions.https.onCall(async data => {
  const { year, weekNumber } = data as CreateSessionsPayload;
  const date = DateTime.fromObject({ weekYear: year, weekNumber });
  const querySnap = await db.collection(Collection.TRAININGS).get();
  querySnap.docs.map(parseTraining).forEach(training => {
    const input: SessionInput = {
      trainingId: training.id,
      clientIds: training.clientIds,
      type: training.type,
      weekday: training.weekday,
      time: training.time,
      date: date.set({ weekday: training.weekday }).toISODate(),
      confirmed: false,
    };
    try {
      db.collection(Collection.SESSIONS)
        .doc(`${training.id}-${data.year}-${data.weekNumber}`)
        .create(input);
    } catch (e) {
      // already exists, no-op
    }
  });
});

function getSessionsSnapForTraining(trainingId: string, startingFrom?: string): Promise<QuerySnapshot> {
  let query = db
    .collection(Collection.SESSIONS)
    .where('trainingId', '==', trainingId)
    .where('confirmed', '==', false);
  if (startingFrom != null) {
    query = query.where('date', '>=', startingFrom);
  }

  return query.get();
}

async function updateTrainingAndSessions(sessionInput: SessionInput, includePast: boolean) {
  const batch = db.batch();

  const trainingInput: TrainingInput = {
    type: sessionInput.type,
    weekday: sessionInput.weekday,
    time: sessionInput.time,
    clientIds: sessionInput.clientIds,
  };
  const trainingSnap = await db
    .collection(Collection.TRAININGS)
    .doc(sessionInput.trainingId)
    .get();
  batch.update(trainingSnap.ref, trainingInput);

  const sessionsSnap = await getSessionsSnapForTraining(
    sessionInput.trainingId,
    includePast ? undefined : sessionInput.date,
  );
  sessionsSnap.forEach(snap => {
    const session = parseSession(snap);
    const date = DateTime.fromISO(session.date);
    batch.update(snap.ref, {
      ...trainingInput,
      date: date.set({ weekday: trainingInput.weekday }).toISODate(),
    });
  });

  return batch.commit();
}

export const updateSession = functions.https.onCall(async data => {
  const { type, sessionId, sessionInput } = data as UpdateSessionPayload;
  switch (type) {
    case ChangeType.SINGLE: {
      await db
        .collection(Collection.SESSIONS)
        .doc(sessionId)
        .update(sessionInput);
      break;
    }
    case ChangeType.ALL_FOLLOWING: {
      // TODO: ensure all sessions up to this date are created
      await updateTrainingAndSessions(sessionInput, false);
      break;
    }
    case ChangeType.ALL_NON_CONFIRMED: {
      await updateTrainingAndSessions(sessionInput, true);
      break;
    }
  }
});

export const deleteSessionsOnTrainingDeleted = functions.firestore
  .document('trainings/{trainingId}')
  .onDelete(async (snap, context) => {
    const sessionsSnap = await getSessionsSnapForTraining(context.params.trainingId, DateTime.local().toISODate());
    const batch = db.batch();
    sessionsSnap.forEach(snap => {
      batch.delete(snap.ref);
    });
    await batch.commit();
  });

export const setActiveSubscriptions = functions.firestore
  .document('clients/{clientId}/subscriptions/{subscriptionId}')
  .onWrite(async (change, context) => {
    const clientRef = db.collection(Collection.CLIENTS).doc(context.params.clientId);
    const subscriptionSnap = await clientRef.collection(Collection.SUBSCRIPTIONS).get();
    const activeSubscriptions = subscriptionSnap.docs.map(parseSubscription).filter(subscription => {
      if (subscription.paidAt == null) {
        return true;
      }

      if (subscription.type === SubscriptionType.BLOCK) {
        const today = DateTime.local();
        return today >= DateTime.fromISO(subscription.end);
      }

      return subscription.trainingsLeft > 0;
    });
    return clientRef.update({ activeSubscriptions });
  });

export const updateTrainingsLeft = functions.firestore.document('sessions/{sessionId}').onUpdate(async change => {
  const before = parseSession(change.before);
  const after = parseSession(change.after);
  if (after.confirmed !== before.confirmed) {
    const clientSubscriptions = await Promise.all(
      after.clientIds.map(async clientId => {
        const query = await db
          .collection(Collection.CLIENTS)
          .doc(clientId)
          .collection(Collection.SUBSCRIPTIONS)
          .where('trainingType', '==', after.type)
          .where('type', 'in', [
            SubscriptionType.SINGLE,
            SubscriptionType.LIMITED_10,
            SubscriptionType.LIMITED_20,
            SubscriptionType.UNLIMITED_10,
          ])
          .get();
        return {
          clientId,
          subscriptionIds: query.docs.map(snap => snap.id),
        };
      }),
    );

    const batch = db.batch();
    clientSubscriptions.forEach(({ clientId, subscriptionIds }) => {
      subscriptionIds.forEach(subscriptionId => {
        const ref = db
          .collection(Collection.CLIENTS)
          .doc(clientId)
          .collection(Collection.SUBSCRIPTIONS)
          .doc(subscriptionId);
        batch.update(ref, { trainingsLeft: admin.firestore.FieldValue.increment(after.confirmed ? -1 : 1) });
      });
    });
    await batch.commit();
  }
});
