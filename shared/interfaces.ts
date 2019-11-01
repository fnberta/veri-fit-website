export enum TrainingType {
  YOGA = 'YOGA',
  BOOST = 'BOOST',
  HIIT = 'HIIT',
  PERSONAL = 'PERSONAL',
}

export enum SubscriptionType {
  SINGLE = 'SINGLE',
  LIMITED_10 = 'LIMITED_10',
  LIMITED_20 = 'LIMITED_20',
  UNLIMITED_10 = 'UNLIMITED_10',
  BLOCK = 'BLOCK',
}

export interface SubscriptionFields {
  id: string;
  start: string; // YYYY-MM-DD
  paidAt?: string; // YYYY-MM-DD
}

export interface YogaLimitedSubscription extends SubscriptionFields {
  type: SubscriptionType.SINGLE | SubscriptionType.LIMITED_10 | SubscriptionType.LIMITED_20;
  category: TrainingType.YOGA;
  end: string; // YYYY-MM-DD
  trainingsLeft: number;
}

export interface YogaUnlimitedSubscription extends SubscriptionFields {
  type: SubscriptionType.UNLIMITED_10;
  category: TrainingType.YOGA;
  trainingsLeft: number;
}

export type YogaSubscription = YogaLimitedSubscription | YogaUnlimitedSubscription;

export interface HiitSubscription extends SubscriptionFields {
  type: SubscriptionType.BLOCK;
  category: TrainingType.HIIT;
  end: string; // YYYY-MM-DD
}

export interface BoostSubscription extends SubscriptionFields {
  type: SubscriptionType.BLOCK;
  category: TrainingType.BOOST;
  end: string; // YYYY-MM-DD
}

export interface PersonalSubscription extends SubscriptionFields {
  type: SubscriptionType.SINGLE | SubscriptionType.LIMITED_10;
  category: TrainingType.PERSONAL;
  end: string; // YYYY-MM-DD
  trainingsLeft: number;
}

export type Subscription = YogaSubscription | HiitSubscription | BoostSubscription | PersonalSubscription;

export interface MiniUser {
  id: string;
  name: string;
}

export interface User extends MiniUser {
  email: string;
  birthday: string; // YYYY-MM-DD
  address: {
    street: string;
    number: string;
    zip: string;
    city: string;
  };
  phone: string;
  subscriptions: {
    unpaid: boolean;
    expires: boolean;
    runsShort: boolean;
  };
}

export interface Time {
  start: string; // hh:mm
  end: string; // hh:mm
}

export interface ParticipantsMap {
  [userId: string]: string;
}

export interface Training {
  id: string;
  type: TrainingType;
  weekday: 1 | 2 | 3 | 4 | 5 | 6 | 7;
  time: Time;
  participants: MiniUser[];
}

export interface Session {
  id: string;
  category: TrainingType;
  time: Time;
  date: string; // YYYY-MM-DD
  participants: MiniUser[];
  confirmed: boolean;
}
