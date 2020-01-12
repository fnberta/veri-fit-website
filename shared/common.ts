export interface Entity {
  id: string;
}

export interface Snapshot {
  id: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data(): any;
}

export interface Time {
  start: string; // hh:mm
  end: string; // hh:mm
}

export const Collection = {
  CLIENTS: 'clients',
  SUBSCRIPTIONS: 'subscriptions',
  TRAININGS: 'trainings',
  SESSIONS: 'sessions',
};
