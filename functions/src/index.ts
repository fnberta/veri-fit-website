import admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import { DateTime } from 'luxon';
import { MiniUser, Session, Training } from '../../shared/interfaces';

type SessionInput = Omit<Session, 'id'>;

admin.initializeApp();
const db = admin.firestore();

export const createSessions = functions.https.onCall(async data => {
  const date = DateTime.fromObject({ weekYear: data.year, weekNumber: data.weekNumber });

  const querySnapshot = await db.collection('trainings').get();
  const trainings = [] as Training[];
  querySnapshot.forEach(snap => {
    trainings.push({
      id: snap.id,
      ...snap.data(),
    } as Training);
  });

  try {
    await Promise.all(
      trainings.map(training => {
        const input: SessionInput = {
          category: training.type,
          time: training.time,
          date: date.set({ weekday: training.weekday }).toISODate(),
          participants: training.participants,
          confirmed: false,
        };
        return admin
          .firestore()
          .collection('sessions')
          .doc(`${training.id}-${data.year}-${data.weekNumber}`)
          .create(input);
      }),
    );
  } catch {
    // already exists, no-op
  }
});

export const updateUsersOnConfirmed = functions.firestore
  .document('sessions/${sessionId}')
  .onUpdate((change, context) => {
    const before = change.before.data()!;
    const after = change.after.data()!;
    if (after.confirmed === true && !before.confirmed) {
      after.participants.forEach((participant: MiniUser) => {
        db.collection('users')
          .doc(participant.id)
          .update();
      });
    }
  });
