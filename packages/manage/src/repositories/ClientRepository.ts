import type { firestore, Unsubscribe } from 'firebase';
import { Client, Collection, DistributiveOmit, parseClient, parseSubscription, Subscription } from '@veri-fit/common';

export type ClientInput = Omit<Client, 'id'>;
export type SubscriptionInput = DistributiveOmit<Subscription, 'id'>;

export default class ClientRepository {
  constructor(private readonly db: firestore.Firestore) {}

  async create(clientInput: ClientInput, subscriptionInput: SubscriptionInput): Promise<Client> {
    const ref = await this.db.collection(Collection.CLIENTS).add(clientInput);
    const snap = await ref.get();
    const client = parseClient(snap);
    await this.createSubscription(client.id, subscriptionInput);
    return client;
  }

  observeAll(onChange: (clients: Client[]) => void): Unsubscribe {
    return this.db
      .collection(Collection.CLIENTS)
      .orderBy('name', 'asc')
      .onSnapshot((querySnap) => {
        const clients = querySnap.docs.map(parseClient);
        onChange(clients);
      });
  }

  async update(clientId: string, input: ClientInput): Promise<Client> {
    const ref = this.db.collection(Collection.CLIENTS).doc(clientId);
    await ref.set(input);
    const snap = await ref.get();
    return parseClient(snap);
  }

  async delete(clientId: string): Promise<void> {
    // TODO: do in cloud function to delete subscription sub-collection
    await this.db.collection(Collection.CLIENTS).doc(clientId).delete();
  }

  async createSubscription(clientId: string, input: SubscriptionInput): Promise<Subscription> {
    const ref = await this.db
      .collection(Collection.CLIENTS)
      .doc(clientId)
      .collection(Collection.SUBSCRIPTIONS)
      .add(input);
    const snap = await ref.get();
    return parseSubscription(snap);
  }

  observeAllSubscriptions(clientId: string, onChange: (subscriptions: Subscription[]) => void): Unsubscribe {
    return this.db
      .collection(Collection.CLIENTS)
      .doc(clientId)
      .collection(Collection.SUBSCRIPTIONS)
      .orderBy('trainingType')
      .orderBy('start', 'desc')
      .onSnapshot((querySnap) => {
        const subscriptions = querySnap.docs.map(parseSubscription);
        onChange(subscriptions);
      });
  }

  async updateSubscription(clientId: string, subscriptionId: string, input: SubscriptionInput): Promise<Subscription> {
    const ref = this.db
      .collection(Collection.CLIENTS)
      .doc(clientId)
      .collection(Collection.SUBSCRIPTIONS)
      .doc(subscriptionId);
    await ref.set(input);

    const snap = await ref.get();
    return parseSubscription(snap);
  }

  async deleteSubscription(clientId: string, subscriptionId: string): Promise<void> {
    await this.db
      .collection(Collection.CLIENTS)
      .doc(clientId)
      .collection(Collection.SUBSCRIPTIONS)
      .doc(subscriptionId)
      .delete();
  }
}
