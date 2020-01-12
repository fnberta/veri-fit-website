import { Unsubscribe } from 'firebase';
import { DateTime } from 'luxon';
import { Collection, Session, parseSession } from '../../../shared';
import { Firestore, Functions, HttpsCallable } from '../firebase';

export default class SessionRepository {
  private readonly createSessions: HttpsCallable;

  constructor(private readonly db: Firestore, functions: Functions) {
    this.createSessions = functions.httpsCallable('createSessions');
  }

  async createForWeek(year: number, weekNumber: number): Promise<void> {
    await this.createSessions({
      year,
      weekNumber,
    });
  }

  async update(session: Session): Promise<Session> {
    const { id, ...rest } = session;
    await this.db
      .collection(Collection.SESSIONS)
      .doc(id)
      .update(rest);
    return session;
  }

  observeAllForClients(clientId: string, onChange: (sessions: Session[]) => void): Unsubscribe {
    return this.db
      .collection(Collection.SESSIONS)
      .where('clientIds', 'array-contains', clientId)
      .where('confirmed', '==', true)
      .orderBy('date', 'desc')
      .onSnapshot(querySnap => {
        const sessions = querySnap.docs.map(parseSession);
        onChange(sessions);
      });
  }

  observeAllForWeek(year: number, weekNumber: number, onChange: (sessions: Session[]) => void): Unsubscribe {
    const startDate = DateTime.fromObject({ weekYear: year, weekNumber });
    const endDate = startDate.plus({ weeks: 1 });
    return this.db
      .collection(Collection.SESSIONS)
      .where('date', '>=', startDate.toISODate())
      .where('date', '<', endDate.toISODate())
      .onSnapshot(querySnap => {
        const sessions = querySnap.docs.map(parseSession);
        onChange(sessions);
      });
  }
}
