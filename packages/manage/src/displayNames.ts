import { SubscriptionType, TrainingType } from '@veri-fit/common';

export function getTrainingName(type: TrainingType): string {
  switch (type) {
    case TrainingType.BOOST:
      return 'Boost';
    case TrainingType.HIIT:
      return 'HIIT';
    case TrainingType.PERSONAL:
      return 'Personal';
    case TrainingType.YOGA:
      return 'Yoga';
  }
}

export function getSubscriptionName(type: SubscriptionType): string {
  switch (type) {
    case SubscriptionType.UNLIMITED_10:
      return '10er unlimitiert';
    case SubscriptionType.SINGLE:
      return 'Einzeleintritt';
    case SubscriptionType.LIMITED_10:
      return '10er limitiert';
    case SubscriptionType.LIMITED_20:
      return '20er limitiert';
    case SubscriptionType.BLOCK:
      return 'Block';
  }
}
