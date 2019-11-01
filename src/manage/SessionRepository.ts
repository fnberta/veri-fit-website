import { Unsubscribe } from 'firebase';
import { DateTime } from 'luxon';
import { DocumentSnapshot, Firestore, Functions, HttpsCallable } from './firebase';
import { MiniUser, Session, User } from '../../shared/interfaces';

const SESSIONS_COLLECTION = 'sessions';

function parseSession(snap: DocumentSnapshot): Session {
  return {
    id: snap.id,
    ...snap.data(),
  } as Session;
}

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
      .collection(SESSIONS_COLLECTION)
      .doc(id)
      .update(rest);
    return session;
  }

  observeAllForUser(user: User, onChange: (sessions: Session[]) => void): Unsubscribe {
    const miniUser: MiniUser = { id: user.id, name: user.name };
    return this.db
      .collection(SESSIONS_COLLECTION)
      .where('participants', 'array-contains', miniUser)
      .where('confirmed', '==', true)
      .orderBy('date', 'desc')
      .onSnapshot(querySnap => {
        const sessions = [] as Session[];
        querySnap.forEach(snap => {
          sessions.push(parseSession(snap));
        });
        onChange(sessions);
      });
  }

  observeAllForWeek(year: number, weekNumber: number, onChange: (sessions: Session[]) => void): Unsubscribe {
    const startDate = DateTime.fromObject({ weekYear: year, weekNumber });
    const endDate = startDate.plus({ weeks: 1 });
    return this.db
      .collection(SESSIONS_COLLECTION)
      .where('date', '>=', startDate.toISODate())
      .where('date', '<', endDate.toISODate())
      .onSnapshot(querySnap => {
        const sessions = [] as Session[];
        querySnap.forEach(snap => {
          sessions.push(parseSession(snap));
        });
        onChange(sessions);
      });
  }
}
