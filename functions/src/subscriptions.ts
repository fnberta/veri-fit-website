import { DateTime } from 'luxon';
import { PersonalSubscription, Subscription, SubscriptionType, YogaSubscription } from './shared';

export function isSubscriptionActive(subscription: Subscription): boolean {
  if (subscription.paidAt == null) {
    return true;
  }

  if (subscription.type === SubscriptionType.BLOCK) {
    const today = DateTime.local();
    return today <= DateTime.fromISO(subscription.end);
  }

  return subscription.trainingsLeft > 0;
}

export function pickSubscriptionId(
  sessionConfirmed: boolean,
  subscriptions: Array<YogaSubscription | PersonalSubscription>,
): string {
  if (subscriptions.length <= 0) {
    throw new Error('session was opened but no subscription is available for type');
  }

  if (sessionConfirmed) {
    const nonEmptySubscriptions = subscriptions.filter((subscription) => subscription.trainingsLeft > 0);
    if (nonEmptySubscriptions.length === 1) {
      return nonEmptySubscriptions[0].id;
    }

    throw new Error('session was confirmed but no or multiple subscription(s) with trainingsLeft is available');
  } else {
    if (subscriptions.length === 1) {
      return subscriptions[0].id;
    }

    const today = DateTime.local();
    const [first] = subscriptions.slice().sort((a, b) => {
      // the one with the newer end date should come first
      if (a.type !== SubscriptionType.UNLIMITED_10 && b.type !== SubscriptionType.UNLIMITED_10) {
        return DateTime.fromISO(b.end).toMillis() - DateTime.fromISO(a.end).toMillis();
      }

      // unlimited comes first if limited one is expired
      if (a.type === SubscriptionType.UNLIMITED_10 && b.type !== SubscriptionType.UNLIMITED_10) {
        const dateB = DateTime.fromISO(b.end);
        return dateB >= today ? 1 : -1;
      }

      // unlimited comes first if limited one is expired
      if (b.type === SubscriptionType.UNLIMITED_10 && a.type !== SubscriptionType.UNLIMITED_10) {
        const dateA = DateTime.fromISO(a.end);
        return dateA >= today ? -1 : 1;
      }

      // both unlimited, the newer one comes first
      return DateTime.fromISO(b.start).toMillis() - DateTime.fromISO(a.start).toMillis();
    });
    return first.id;
  }
}
