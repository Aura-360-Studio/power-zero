import { db } from '../db/AppDatabase';
import type { UserProfile } from '../../core/domain/UserProfile';

export class UserProfileRepository {
  /**
   * Retrieves the first profile from the DB (since there is only one user profile)
   */
  async getProfile(): Promise<UserProfile | undefined> {
    return await db.userProfile.toCollection().first();
  }

  /**
   * Updates the profile, adding it if it doesn't exist
   */
  async saveProfile(profile: UserProfile): Promise<void> {
    await db.userProfile.put(profile);
  }

  /**
   * Specifically update the total neutralized amount
   */
  async updateTotalNeutralized(amount: number): Promise<void> {
    const profile = await this.getProfile();
    if (profile) {
      profile.totalNeutralized = amount;
      await db.userProfile.put(profile);
    }
  }
}

export const userProfileRepository = new UserProfileRepository();
