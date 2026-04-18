import { db } from '../db/AppDatabase';
import type { Subscription } from '../../core/domain/Subscription';
import { SubscriptionSchema } from '../../core/domain/SubscriptionSchema';

export class SubscriptionRepository {
  /**
   * Retrieves all subscriptions from the IndexedDB store.
   */
  async getAll(): Promise<Subscription[]> {
    return await db.subscriptions.toArray();
  }

  /**
   * Validates and saves a subscription.
   * If the subscription lacks an ID, a stable UUID v4 is generated.
   * Throws an error if validation fails (e.g., negative amount).
   */
  async save(sub: Omit<Subscription, 'id'> & { id?: string }): Promise<void> {
    const subscriptionToSave = {
      ...sub,
      id: sub.id || crypto.randomUUID()
    };

    // ISO-standard Integrity: Validate before touching the database
    const validated = SubscriptionSchema.parse(subscriptionToSave);

    await db.transaction('rw', db.subscriptions, async () => {
      // Push the strictly typed and validated object to IndexedDB
      await db.subscriptions.put(validated as Subscription);
    });
  }

  /**
   * Deletes a subscription by an exact ID.
   */
  async delete(id: string): Promise<void> {
    await db.subscriptions.delete(id);
  }

  /**
   * Updates just the status of a specific subscription.
   */
  async updateStatus(id: string, status: 'ACTIVE' | 'CANCELLED' | 'PAUSED'): Promise<void> {
    await db.transaction('rw', db.subscriptions, async () => {
      const sub = await db.subscriptions.get(id);
      if (!sub) {
        throw new Error(`Subscription with ID ${id} not found.`);
      }
      
      sub.status = status;
      await db.subscriptions.put(sub);
    });
  }
}

export const subscriptionRepository = new SubscriptionRepository();
