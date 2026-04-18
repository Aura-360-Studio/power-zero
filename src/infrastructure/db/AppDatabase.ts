import Dexie, { type Table } from 'dexie';
import type { Subscription } from '../../core/domain/Subscription';
import { type UserProfile, defaultProfile } from '../../core/domain/UserProfile';

export class AppDatabase extends Dexie {
  subscriptions!: Table<Subscription>;
  userProfile!: Table<UserProfile>;

  constructor() {
    super('PowerZeroDB');
    
    // Schema definition
    this.version(3).stores({
      subscriptions: 'id, name, category, nextBillingDate, isArchived',
      userProfile: '++id, name, currency, totalNeutralized'
    });

    // Populate default profile on database creation
    this.on('populate', async () => {
      await this.userProfile.add(defaultProfile);
    });
  }
}

export const db = new AppDatabase();
