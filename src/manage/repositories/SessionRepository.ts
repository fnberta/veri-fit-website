import { Unsubscribe } from 'firebase';
import { DateTime } from 'luxon';
import {
  Collection,
  Session,
  parseSession,
  CreateSessionsPayload,
  ChangeType,
  UpdateSessionPayload,
  SessionInput,
} from '../../../shared';
import { Firestore, Functions, HttpsCallable } from '../firebase';

export default class SessionRepository {
  private readonly createSessions: HttpsCallable;
  private readonly updateSession: HttpsCallable;

  constructor(private readonly db: Firestore, functions: Functions) {
    this.createSessions = functions.httpsCallable('createSessions');
    this.updateSession = functions.httpsCallable('updateSession');
  }

  async createForYear(year: number): Promise<void> {
    const payload: CreateSessionsPayload = { year };
    await this.createSessions(payload);
  }

  async update(type: ChangeType, sessionId: string, sessionInput: SessionInput): Promise<Session> {
    const payload: UpdateSessionPayload = {
      type,
      sessionId,
      sessionInput,
    };
    await this.updateSession(payload);
    return {
      id: sessionId,
      ...sessionInput,
    };
  }

  async toggleConfirmed(session: Session): Promise<Session> {
    await this.db
      .collection(Collection.SESSIONS)
      .doc(session.id)
      .update({ confirmed: !session.confirmed });
    return {
      ...session,
      confirmed: !session.confirmed,
    };
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
