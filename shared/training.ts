import { Entity, Snapshot, Time } from './common';

export enum TrainingType {
  YOGA = 'YOGA',
  BOOST = 'BOOST',
  HIIT = 'HIIT',
  PERSONAL = 'PERSONAL',
}

export interface Training extends Entity {
  type: TrainingType;
  weekday: 1 | 2 | 3 | 4 | 5 | 6 | 7;
  time: Time;
  clientIds: string[];
}

export function parseTraining(snap: Snapshot): Training {
  return {
    id: snap.id,
    ...snap.data(),
  } as Training;
}
