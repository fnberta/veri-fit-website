import { DateTime, Duration } from 'luxon';
import { Client, isSubscriptionValid, Session, Subscription, SubscriptionType, TrainingType } from '@veri-fit/common';
import { getStartOfToday } from './dateTime';

export const validSubscriptionTypes: Record<TrainingType, SubscriptionType[]> = {
  [TrainingType.YOGA]: [
    SubscriptionType.LIMITED_10,
    SubscriptionType.LIMITED_20,
    SubscriptionType.UNLIMITED_10,
    SubscriptionType.SINGLE,
  ],
  [TrainingType.PERSONAL]: [SubscriptionType.LIMITED_10, SubscriptionType.SINGLE],
  [TrainingType.BOOST]: [SubscriptionType.BLOCK],
  [TrainingType.HIIT]: [SubscriptionType.BLOCK],
};

export const trainingTypes = Object.keys(validSubscriptionTypes) as TrainingType[];

export function getValidTrainingTypes(subscriptions: Subscription[]): TrainingType[] {
  const validSubscriptionTrainingTypes = subscriptions
    .filter(isSubscriptionValid)
    .map((subscription) => subscription.trainingType);
  return trainingTypes.filter((trainingType) => !validSubscriptionTrainingTypes.includes(trainingType));
}

export type ActiveSubscriptionTag = 'runsShort' | 'expiring' | 'expired' | 'unpaid';

export type ActiveSubscriptionTags = Record<ActiveSubscriptionTag, boolean>;

export function getActiveSubscriptionTags(subscription: Subscription): ActiveSubscriptionTags {
  const unpaid = subscription.paidAt == null;
  if (subscription.type === SubscriptionType.UNLIMITED_10) {
    return {
      unpaid,
      expired: false,
      expiring: false,
      runsShort: false,
    };
  }

  const end = DateTime.fromISO(subscription.end);
  const startOfToday = getStartOfToday();
  const diff = end.diff(startOfToday);
  const expired = end < startOfToday;
  return {
    unpaid,
    expired,
    expiring: !expired && diff <= Duration.fromObject({ weeks: 1 }),
    // TODO: with getStartOfToday, Math.round should not be needed
    runsShort:
      expired || subscription.type === SubscriptionType.BLOCK
        ? false
        : subscription.trainingsLeft > Math.round(diff.as('weeks')),
  };
}

export function getClientsWithIssues(clients: Client[], session: Session): Client[] {
  if (session.confirmed) {
    return [];
  }

  return clients.filter((client) => {
    if (!session.clientIds.includes(client.id)) {
      return false;
    }

    const hasMatchingValidSubscription = client.activeSubscriptions.some((activeSub) => {
      if (activeSub.trainingType !== session.type) {
        return false;
      }

      if (activeSub.type === SubscriptionType.BLOCK) {
        // TODO: this should check end date
        return true;
      } else {
        return activeSub.trainingsLeft > 0;
      }
    });
    return !hasMatchingValidSubscription;
  });
}
