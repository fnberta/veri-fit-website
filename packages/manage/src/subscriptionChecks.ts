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

export function doesSubscriptionRunShort(subscription: Subscription): boolean {
  if (subscription.type === SubscriptionType.UNLIMITED_10 || subscription.type === SubscriptionType.BLOCK) {
    return false;
  }

  const { end, trainingsLeft } = subscription;
  const diff = DateTime.fromISO(end).diff(getStartOfToday());
  // TODO: with getStartOfToday, Math.round should not be needed
  return trainingsLeft > Math.round(diff.as('weeks'));
}

export function isSubscriptionExpiring(subscription: Subscription): boolean {
  if (subscription.type === SubscriptionType.UNLIMITED_10) {
    return false;
  }

  const end = DateTime.fromISO(subscription.end);
  return end.diff(getStartOfToday()) <= Duration.fromObject({ weeks: 1 });
}

export function getClientsWithIssues(clients: Client[], session: Session): Client[] {
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