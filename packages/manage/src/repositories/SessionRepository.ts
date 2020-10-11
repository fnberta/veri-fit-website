import type { firestore, functions, Unsubscribe } from 'firebase';
import { DateTime } from 'luxon';
import {
  ChangeType,
  Collection,
  CreateSessionsPayload,
  getTimeForId,
  parseSession,
  Session,
  SessionInput,
  ToggleSessionPayload,
  ToggleSessionResponse,
  UpdateSessionPayload,
} from '@veri-fit/common';

export default class SessionRepository {
  private readonly createSessions: functions.HttpsCallable;
  private readonly updateSession: functions.HttpsCallable;
  private readonly toggleSessionConfirmed: functions.HttpsCallable;

  constructor(private readonly db: firestore.Firestore, functions: functions.Functions) {
    this.createSessions = functions.httpsCallable('createSessions');
    this.updateSession = functions.httpsCallable('updateSession');
    this.toggleSessionConfirmed = functions.httpsCallable('toggleSessionConfirmed');
  }

  async createForYear(year: number): Promise<void> {
    const payload: CreateSessionsPayload = { year };
    await this.createSessions(payload);
  }

  async createSingle(input: SessionInput): Promise<Session> {
    const ref = this.db.collection(Collection.SESSIONS).doc(`${input.type}-${input.date}-${getTimeForId(input.time)}`);
    await ref.set(input);
    const snap = await ref.get();
    return parseSession(snap);
  }

  async update(type: ChangeType, sessionId: string, input: SessionInput): Promise<Session> {
    const payload: UpdateSessionPayload = {
      type,
      sessionId,
      sessionInput: input,
    };
    await this.updateSession(payload);
    return {
      id: sessionId,
      ...input,
    };
  }

  async toggleConfirmed(sessionId: string): Promise<Session> {
    const payload: ToggleSessionPayload = { sessionId };
    const res = await this.toggleSessionConfirmed(payload);
    const { session } = res.data as ToggleSessionResponse;
    return session;
  }

  observeAllForClients(clientId: string, onChange: (sessions: Session[]) => void): Unsubscribe {
    return this.db
      .collection(Collection.SESSIONS)
      .where('clientIds', 'array-contains', clientId)
      .where('confirmed', '==', true)
      .orderBy('date', 'desc')
      .onSnapshot((querySnap) => {
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
      .onSnapshot((querySnap) => {
        const sessions = querySnap.docs.map(parseSession);
        onChange(sessions);
      });
  }
}
