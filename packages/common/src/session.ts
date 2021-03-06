import { Snapshot } from './common';
import { Training } from './training';

export interface Session extends Training {
  trainingId?: string;
  date: string; // YYYY-MM-DD
  confirmed: boolean;
  notes?: string;
}

export type SessionInput = Omit<Session, 'id'>;

export interface CreateSessionsPayload {
  year: number;
}

export enum ChangeType {
  SINGLE = 'SINGLE',
  ALL_FOLLOWING = 'ALL_FOLLOWING',
  ALL_NON_CONFIRMED = 'ALL_NON_CONFIRMED',
}

export interface UpdateSessionPayload {
  type: ChangeType;
  sessionId: string;
  sessionInput: SessionInput;
}

export interface ToggleSessionPayload {
  sessionId: string;
}

export interface ToggleSessionResponse {
  session: Session;
}

export function parseSession(snap: Snapshot): Session {
  return {
    id: snap.id,
    ...snap.data(),
  } as Session;
}
