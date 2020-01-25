import { Entity, Snapshot } from './common';
import { Subscription } from './subscription';

export interface Client extends Entity {
  name: string;
  email?: string;
  birthday?: string; // YYYY-MM-DD
  address?: {
    street: string;
    number: string;
    zip: string;
    city: string;
  };
  phone?: string;
  activeSubscriptions: Subscription[];
}

export function parseClient(snap: Snapshot): Client {
  return {
    id: snap.id,
    ...snap.data(),
  } as Client;
}
