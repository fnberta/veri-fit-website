import { DateTime } from 'luxon';
import { Entity, Snapshot } from './common';
import { TrainingType } from './training';

export enum SubscriptionType {
  SINGLE = 'SINGLE',
  LIMITED_10 = 'LIMITED_10',
  LIMITED_20 = 'LIMITED_20',
  UNLIMITED_10 = 'UNLIMITED_10',
  BLOCK = 'BLOCK',
}

export interface SubscriptionFields extends Entity {
  start: string; // YYYY-MM-DD
  paidAt?: string; // YYYY-MM-DD
}

export interface YogaLimitedSubscription extends SubscriptionFields {
  type: SubscriptionType.SINGLE | SubscriptionType.LIMITED_10 | SubscriptionType.LIMITED_20;
  trainingType: TrainingType.YOGA;
  end: string; // YYYY-MM-DD
  trainingsLeft: number;
}

export interface YogaUnlimitedSubscription extends SubscriptionFields {
  type: SubscriptionType.UNLIMITED_10;
  trainingType: TrainingType.YOGA;
  trainingsLeft: number;
}

export type YogaSubscription = YogaLimitedSubscription | YogaUnlimitedSubscription;

export interface HiitSubscription extends SubscriptionFields {
  type: SubscriptionType.BLOCK;
  trainingType: TrainingType.HIIT;
  end: string; // YYYY-MM-DD
}

export interface BoostSubscription extends SubscriptionFields {
  type: SubscriptionType.BLOCK;
  trainingType: TrainingType.BOOST;
  end: string; // YYYY-MM-DD
}

export interface PersonalSubscription extends SubscriptionFields {
  type: SubscriptionType.SINGLE | SubscriptionType.LIMITED_10;
  trainingType: TrainingType.PERSONAL;
  end: string; // YYYY-MM-DD
  trainingsLeft: number;
}

export type Subscription = YogaSubscription | HiitSubscription | BoostSubscription | PersonalSubscription;

export function parseSubscription(snap: Snapshot): Subscription {
  return {
    id: snap.id,
    ...snap.data(),
  } as Subscription;
}

export function isSubscriptionValid(subscription: Subscription): boolean {
  if (subscription.type === SubscriptionType.BLOCK) {
    const today = DateTime.local();
    return DateTime.fromISO(subscription.end) >= today;
  }

  return subscription.trainingsLeft > 0;
}
