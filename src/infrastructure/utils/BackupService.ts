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
   * Parses the JSON, migrates any legacy structures, validates against schema, and ingests it.
   */
  async importData(json: string): Promise<void> {
    try {
      const data = JSON.parse(json);
      
      let importedSubs: any[] = [];
      let importedProfile: UserProfile | null = null;

      // Determine if it's the old format (just an array of subscriptions) or the new format
      if (Array.isArray(data)) {
        importedSubs = data;
      } else if (data.subscriptions && data.profile) {
        const backup = data as BackupData;
        importedSubs = backup.subscriptions;
        importedProfile = backup.profile;
      } else {
        throw new Error("Invalid backup format: The file does not contain recognized Zhero data.");
      }

      // Run migration and strict Zod validation on every subscription before touching DB
      const validatedSubs: Subscription[] = [];
      const { BillingCalculator } = await import('../../core/utils/BillingCalculator');
      const { SubscriptionSchema } = await import('../../core/domain/SubscriptionSchema');

      for (const sub of importedSubs) {
        const migrated = BillingCalculator.migrateLegacySubscription(sub);
        
        // This will throw a ZodError if fundamentally invalid (e.g. missing required fields other than category)
        const validated = SubscriptionSchema.parse(migrated);
        validatedSubs.push(validated as Subscription);
      }

      // Safe to insert into the database
      if (importedProfile) {
        await db.transaction('rw', db.subscriptions, db.userProfile, async () => {
          await db.subscriptions.bulkPut(validatedSubs);
          await db.userProfile.put(importedProfile!);
        });
      } else {
        await subscriptionRepository.bulkImport(validatedSubs);
      }
      
    } catch (e: any) {
      if (e.name === 'ZodError') {
        const issues = e.errors.map((err: any) => `${err.path.join('.')}: ${err.message}`).join(' | ');
        throw new Error(`Data validation failed: ${issues}`);
      }
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
