import admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { DateTime } from 'luxon';
import { Collection, parseSession, parseSubscription, parseTraining, Session, SubscriptionType } from './shared';

type SessionInput = Omit<Session, 'id'>;
type QuerySnapshot = admin.firestore.QuerySnapshot;

admin.initializeApp();
const db = admin.firestore();

export const createSessions = functions.https.onCall(async data => {
  const date = DateTime.fromObject({ weekYear: data.year, weekNumber: data.weekNumber });
  const querySnap = await db.collection(Collection.TRAININGS).get();
  querySnap.docs.map(parseTraining).forEach(training => {
    const input: SessionInput = {
      trainingId: training.id,
      clientIds: training.clientIds,
      category: training.type,
      time: training.time,
      date: date.set({ weekday: training.weekday }).toISODate(),
      confirmed: false,
    };
    try {
      admin
        .firestore()
        .collection(Collection.SESSIONS)
        .doc(`${training.id}-${data.year}-${data.weekNumber}`)
        .create(input);
    } catch (e) {
      // already exists, no-op
    }
  });
});

function getSessionsSnapForTraining(trainingId: string): Promise<QuerySnapshot> {
  return db
    .collection(Collection.SESSIONS)
    .where('trainingId', '==', trainingId)
    .where('confirmed', '==', false)
    .get();
}

export const updateSessionsOnTrainingUpdated = functions.firestore
  .document('trainings/{trainingId}')
  .onUpdate(async (snap, context) => {
    const { trainingId } = context.params;
    const trainingSnap = await db
      .collection(Collection.TRAININGS)
      .doc(trainingId)
      .get();
    const training = parseTraining(trainingSnap);

    const now = DateTime.local();
    const sessionsSnap = await getSessionsSnapForTraining(trainingId);
    const batch = db.batch();
    sessionsSnap.forEach(snap => {
      const session = parseSession(snap);
      const date = DateTime.fromISO(session.date);
      if (date >= now) {
        const input: SessionInput = {
          trainingId: training.id,
          clientIds: training.clientIds,
          category: training.type,
          time: training.time,
          date: date.set({ weekday: training.weekday }).toISODate(),
          confirmed: false,
        };
        batch.update(snap.ref, input);
      }
    });
    await batch.commit();
  });

export const deleteSessionsOnTrainingDeleted = functions.firestore
  .document('trainings/{trainingId}')
  .onDelete(async (snap, context) => {
    const now = DateTime.local();
    const sessionsSnap = await getSessionsSnapForTraining(context.params.trainingId);
    const batch = db.batch();
    sessionsSnap.forEach(snap => {
      const session = parseSession(snap);
      if (DateTime.fromISO(session.date) >= now) {
        batch.delete(snap.ref);
      }
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
          .where('category', '==', after.category)
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
