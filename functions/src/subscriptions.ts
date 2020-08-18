import { DateTime } from 'luxon';
import { isSubscriptionValid, PersonalSubscription, Subscription, SubscriptionType, YogaSubscription } from './shared';

export function isSubscriptionActive(subscription: Subscription): boolean {
  return subscription.paidAt == null ? true : isSubscriptionValid(subscription);
}

export function pickSubscriptionId(
  action: 'confirmed' | 'opened',
  subscriptions: Array<YogaSubscription | PersonalSubscription>, // YogaSubscription[] | PersonalSubscription[] would be more accurate but not easily possible with current TS
): string | undefined {
  if (subscriptions.length <= 0) {
    return undefined;
  }

  switch (action) {
    case 'confirmed': {
      const nonEmptySubscriptions = subscriptions.filter((subscription) => subscription.trainingsLeft > 0);
      return nonEmptySubscriptions.length === 1 ? nonEmptySubscriptions[0].id : undefined;
    }
    case 'opened': {
      if (subscriptions.length === 1) {
        return subscriptions[0].id;
      }

      const nonEmptySubscriptions = subscriptions.filter((subscription) => subscription.trainingsLeft > 0);
      if (nonEmptySubscriptions.length === 1) {
        return nonEmptySubscriptions[0].id;
      } else if (nonEmptySubscriptions.length > 1) {
        return undefined;
      }

      const today = DateTime.local();
      const [first] = subscriptions.slice().sort((a, b) => {
        // the one with the newer end date should come first if both are limited
        if (a.type !== SubscriptionType.UNLIMITED_10 && b.type !== SubscriptionType.UNLIMITED_10) {
          return DateTime.fromISO(b.end).toMillis() - DateTime.fromISO(a.end).toMillis();
        }

        // unlimited comes first if limited one is expired
        if (a.type === SubscriptionType.UNLIMITED_10 && b.type !== SubscriptionType.UNLIMITED_10) {
          const dateB = DateTime.fromISO(b.end);
          return dateB >= today ? 1 : -1;
        }
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
}
