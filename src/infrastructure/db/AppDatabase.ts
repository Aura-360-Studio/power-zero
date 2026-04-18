import Dexie, { type Table } from 'dexie';
import type { Subscription } from '../../core/domain/Subscription';

export class AppDatabase extends Dexie {
  subscriptions!: Table<Subscription>;

  constructor() {
    super('PowerZeroDB');
    this.version(1).stores({
      subscriptions: 'id, name, category, nextBillingDate'
    });
  }
}

export const db = new AppDatabase();
