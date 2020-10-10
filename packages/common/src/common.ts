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

export function getTimeForId({ start, end }: Time): string {
  return `${start.replace(':', '')}-${end.replace(':', '')}`;
}

export const Collection = {
  CLIENTS: 'clients',
  SUBSCRIPTIONS: 'subscriptions',
  TRAININGS: 'trainings',
  SESSIONS: 'sessions',
  HANDLED_SESSION_UPDATES: 'handledSessionUpdates',
};
