import { Unsubscribe } from 'firebase';
import { UnionKeys, UnionPick } from '../utils/types';
import { getEndDate, getToday } from './dateTime';
import { DocumentSnapshot, Firestore } from './firebase';
import { Subscription, SubscriptionType, TrainingType, User } from '../../shared/interfaces';

export interface SubscriptionInput {
  type: SubscriptionType;
  category: TrainingType;
  start: string; // YYYY-MM-DD
  paid: boolean;
}

export type UserInput = Omit<User, 'id' | 'subscriptions'>;

export interface UserWithSubscriptionInput extends Omit<User, 'id' | 'subscriptions'> {
  subscription: SubscriptionInput;
}

type UserInputDoc = Omit<User, 'id'>;
type SubscriptionInputDoc = UnionPick<Subscription, Exclude<UnionKeys<Subscription>, 'id'>>;

const USER_COLLECTION = 'users';
const SUBSCRIPTION_COLLECTION = 'subscriptions';

function parseUser(snap: DocumentSnapshot): User {
  return {
    id: snap.id,
    ...snap.data(),
  } as User;
}

function parseSubscription(snap: DocumentSnapshot): Subscription {
  return {
    id: snap.id,
    ...snap.data(),
  } as Subscription;
}

function getSubscriptionInputDoc(input: SubscriptionInput): SubscriptionInputDoc {
  switch (input.type) {
    case SubscriptionType.SINGLE: {
      if (input.category === TrainingType.YOGA || input.category === TrainingType.PERSONAL) {
        return {
          type: input.type,
          category: input.category,
          start: input.start,
          end: input.start,
          trainingsLeft: 1,
          ...(input.paid && { paidAt: getToday() }),
        };
      }

      throw new Error('invalid combination of training and subscription');
    }
    case SubscriptionType.LIMITED_10: {
      if (input.category === TrainingType.YOGA || input.category === TrainingType.PERSONAL) {
        return {
          type: input.type,
          category: input.category,
          start: input.start,
          end: getEndDate(input.start, { months: 3 }),
          trainingsLeft: 10,
          ...(input.paid && { paidAt: getToday() }),
        };
      }

      throw new Error('invalid combination of training and subscription');
    }
    case SubscriptionType.LIMITED_20: {
      if (input.category === TrainingType.YOGA) {
        return {
          type: input.type,
          category: input.category,
          start: input.start,
          end: getEndDate(input.start, { months: 6 }),
          trainingsLeft: 20,
          ...(input.paid && { paidAt: getToday() }),
        };
      }

      throw new Error('invalid combination of training and subscription');
    }
    case SubscriptionType.UNLIMITED_10: {
      if (input.category === TrainingType.YOGA) {
        return {
          type: input.type,
          category: input.category,
          start: input.start,
          trainingsLeft: 10,
          ...(input.paid && { paidAt: getToday() }),
        };
      }

      throw new Error('invalid combination of training and subscription');
    }
    case SubscriptionType.BLOCK: {
      if (input.category === TrainingType.HIIT || input.category === TrainingType.BOOST) {
        return {
          type: input.type,
          category: input.category,
          start: input.start,
          end: getEndDate(input.start, { weeks: 6 }),
          ...(input.paid && { paidAt: getToday() }),
        };
      }

      throw new Error('invalid combination of training and subscription');
    }
  }
}

function getUserInputDoc(input: UserWithSubscriptionInput): UserInputDoc {
  return {
    name: input.name,
    email: input.email,
    birthday: input.birthday,
    address: input.address,
    phone: input.phone,
    subscriptions: {
      unpaid: !input.subscription.paid,
      expires: false,
      runsShort: false,
    },
  };
}

export default class UserRepository {
  constructor(private readonly db: Firestore) {}

  async create(input: UserWithSubscriptionInput): Promise<User> {
    const ref = await this.db.collection(USER_COLLECTION).add(getUserInputDoc(input));
    const snap = await ref.get();
    const user = parseUser(snap);

    await this.db
      .collection(USER_COLLECTION)
      .doc(user.id)
      .collection(SUBSCRIPTION_COLLECTION)
      .add(getSubscriptionInputDoc(input.subscription));

    return user;
  }

  observeAll(onChange: (users: User[]) => void): Unsubscribe {
    return this.db
      .collection(USER_COLLECTION)
      .orderBy('name', 'asc')
      .onSnapshot(querySnap => {
        const users = [] as User[];
        querySnap.forEach(snap => {
          users.push(parseUser(snap));
        });
        onChange(users);
      });
  }

  async update(userId: string, input: UserInput): Promise<User> {
    const ref = this.db.collection(USER_COLLECTION).doc(userId);
    await ref.update(input);
    const snap = await ref.get();
    return parseUser(snap);
  }

  async delete(userId: string): Promise<void> {
    // TODO: do in cloud function to delete subscription subcollection
    await this.db
      .collection(USER_COLLECTION)
      .doc(userId)
      .delete();
  }

  async createSubscription(userId: string, input: SubscriptionInput): Promise<Subscription> {
    const ref = await this.db
      .collection(USER_COLLECTION)
      .doc(userId)
      .collection(SUBSCRIPTION_COLLECTION)
      .add(getSubscriptionInputDoc(input));

    const snap = await ref.get();
    return parseSubscription(snap);
  }

  observeAllSubscriptions(userId: string, onChange: (subscriptions: Subscription[]) => void): Unsubscribe {
    return this.db
      .collection(USER_COLLECTION)
      .doc(userId)
      .collection(SUBSCRIPTION_COLLECTION)
      .onSnapshot(querySnap => {
        const subscriptions = [] as Subscription[];
        querySnap.forEach(snap => {
          subscriptions.push(parseSubscription(snap));
        });
        onChange(subscriptions);
      });
  }

  async updateSubscription(userId: string, subscriptionId: string, input: SubscriptionInput): Promise<Subscription> {
    const ref = this.db
      .collection(USER_COLLECTION)
      .doc(userId)
      .collection(SUBSCRIPTION_COLLECTION)
      .doc(subscriptionId);
    await ref.update(getSubscriptionInputDoc(input));

    const snap = await ref.get();
    return parseSubscription(snap);
  }

  async deleteSubscription(userId: string, subscriptionId: string): Promise<void> {
    await this.db
      .collection(USER_COLLECTION)
      .doc(userId)
      .collection(SUBSCRIPTION_COLLECTION)
      .doc(subscriptionId)
      .delete();
  }
}
