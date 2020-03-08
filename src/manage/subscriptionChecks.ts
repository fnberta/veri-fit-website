import { DateTime, Duration } from 'luxon';
import { Client, Session, Subscription, SubscriptionType, TrainingType } from '../../shared';
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

export function doesSubscriptionRunShort(subscription: Subscription): boolean {
  if (subscription.type === SubscriptionType.UNLIMITED_10 || subscription.type === SubscriptionType.BLOCK) {
    return false;
  }

  const { end, trainingsLeft } = subscription;
  const diff = DateTime.fromISO(end).diff(getStartOfToday());
  return trainingsLeft > diff.as('weeks');
}

export function isSubscriptionExpiring(subscription: Subscription): boolean {
  if (subscription.type === SubscriptionType.UNLIMITED_10) {
    return false;
  }

  const end = DateTime.fromISO(subscription.end);
  return end.diff(getStartOfToday()) <= Duration.fromObject({ weeks: 1 });
}

export function showSessionConfirm(clients: Client[], session: Session): boolean {
  return clients
    .filter(client => session.clientIds.includes(client.id))
    .every(client =>
      client.activeSubscriptions.some(activeSub => {
        if (activeSub.trainingType !== session.type) {
          return false;
        }

        if (activeSub.type === SubscriptionType.BLOCK) {
          return true;
        } else {
          return activeSub.trainingsLeft > 0;
        }
      }),
    );
}
