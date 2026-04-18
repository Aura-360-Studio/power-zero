import { subscriptionRepository } from '../repositories/SubscriptionRepository';
import { userProfileRepository } from '../repositories/UserProfileRepository';
import { db } from '../db/AppDatabase';
import type { Subscription } from '../../core/domain/Subscription';
import type { UserProfile } from '../../core/domain/UserProfile';
import { defaultProfile } from '../../core/domain/UserProfile';

export interface BackupData {
  subscriptions: Subscription[];
  profile: UserProfile;
}

export class BackupService {
  /**
   * Packages all necessary database tables into a single JSON string.
   */
  async exportData(): Promise<string> {
    const subscriptions = await subscriptionRepository.getAll();
    const profile = await userProfileRepository.getProfile() || defaultProfile;

    const exportObject: BackupData = {
      subscriptions,
      profile
    };

    return JSON.stringify(exportObject, null, 2);
  }

  /**
   * Parses the JSON and ingests it into their respective tables.
   */
  async importData(json: string): Promise<void> {
    try {
      const data = JSON.parse(json);
      
      // Determine if it's the old format (just an array of subscriptions) or the new format
      if (Array.isArray(data)) {
        await subscriptionRepository.bulkImport(data as Subscription[]);
        // Profile remains untouched
      } else if (data.subscriptions && data.profile) {
        const backup = data as BackupData;
        
        await db.transaction('rw', db.subscriptions, db.userProfile, async () => {
          await db.subscriptions.bulkPut(backup.subscriptions);
          await db.userProfile.put(backup.profile);
        });
      } else {
        throw new Error("Invalid backup format");
      }
    } catch (e: any) {
      throw new Error(`Import failed: ${e.message}`);
    }
  }

  /**
   * Safely completely clears all user data (the "Kill Switch").
   */
  async wipeAllData(): Promise<void> {
    await db.transaction('rw', db.subscriptions, db.userProfile, async () => {
      await db.subscriptions.clear();
      await db.userProfile.clear();
      // Re-initialize default profile after wipe
      await db.userProfile.add(defaultProfile);
    });
  }
}

export const backupService = new BackupService();
