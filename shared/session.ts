import { Snapshot, Time } from './common';
import { TrainingType } from './training';

export interface Session {
  id: string;
  trainingId: string;
  clientIds: string[];
  category: TrainingType;
  time: Time;
  date: string; // YYYY-MM-DD
  confirmed: boolean;
}

export function parseSession(snap: Snapshot): Session {
  return {
    id: snap.id,
    ...snap.data(),
  } as Session;
}
