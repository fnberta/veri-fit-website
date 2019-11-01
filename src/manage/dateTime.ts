import { DateTime, DurationObject } from 'luxon';

export function getToday() {
  return DateTime.local().toISODate();
}

export function getEndDate(start: string, duration: DurationObject): string {
  return DateTime.fromISO(start)
    .plus(duration)
    .toISODate();
}

export function formatLocale(isoDate: string): string {
  return DateTime.fromISO(isoDate).toLocaleString();
}
