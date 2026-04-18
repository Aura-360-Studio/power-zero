import { create } from 'zustand';
import { subscriptionRepository } from '../../infrastructure/repositories/SubscriptionRepository';
import { useProfileStore } from './useProfileStore';
import { backupService } from '../../infrastructure/utils/BackupService';
import { CalculateBurnRate, type BurnRateMetrics } from '../../core/use-cases/CalculateBurnRate';
import type { Subscription } from '../../core/domain/Subscription';

interface SubscriptionState {
  subscriptions: Subscription[];
  archivedSubscriptions: Subscription[];
  burnRate: BurnRateMetrics;
  isLoading: boolean;
  error: string | null;

  // Store actions defining the Global workflow
  fetchSubscriptions: () => Promise<void>;
  addSubscription: (sub: Omit<Subscription, 'id'> & { id?: string }) => Promise<void>;
  removeSubscription: (id: string) => Promise<void>;
  archiveSubscription: (id: string, isArchived: boolean) => Promise<void>;
  wipeData: () => Promise<void>;
  importData: (json: string) => Promise<void>;
}

const defaultBurnRate: BurnRateMetrics = { daily: 0, monthly: 0, yearly: 0 };

export const useSubscriptionStore = create<SubscriptionState>((set, get) => ({
  subscriptions: [],
  archivedSubscriptions: [],
  burnRate: defaultBurnRate,
  isLoading: false,
  error: null,

  fetchSubscriptions: async () => {
    set({ isLoading: true, error: null });
    try {
      const allSubs = await subscriptionRepository.getAll();
      
      const activeSubs = allSubs.filter(s => !s.isArchived);
      const archivedSubs = allSubs.filter(s => s.isArchived);
      
      // Decoupled Business Core Logic call
      const burnRate = CalculateBurnRate(activeSubs);
      
      set({ 
        subscriptions: activeSubs, 
        archivedSubscriptions: archivedSubs, 
        burnRate, 
        isLoading: false 
      });
    } catch (err: any) {
      set({ error: err.message || "Failed to fetch subscriptions", isLoading: false });
    }
  },

  addSubscription: async (sub) => {
    set({ isLoading: true, error: null });
    try {
      await subscriptionRepository.save(sub);
      
      // Update global context implicitly updating the burn rate numbers globally
      await get().fetchSubscriptions();
    } catch (err: any) {
      set({ error: err.message || "Failed to save subscription", isLoading: false });
    }
  },

  removeSubscription: async (id) => {
    set({ isLoading: true, error: null });
    try {
      // Logic requirement: Implement soft delete instead of hard wipe natively.
      await subscriptionRepository.updateStatus(id, 'CANCELLED');
      
      // Triggers CalculateBurnRate avoiding state redundancy issues 
      await get().fetchSubscriptions();
    } catch (err: any) {
      set({ error: err.message || "Failed to kill subscription", isLoading: false });
    }
  },

  archiveSubscription: async (id, isArchived) => {
    set({ isLoading: true, error: null });
    try {
      if (isArchived) {
        const sub = get().subscriptions.find(s => s.id === id);
        if (sub) {
          // Calculate monthly weight to add to lifetime neutralized
          const burn = CalculateBurnRate([sub]);
          await useProfileStore.getState().addNeutralizedAmount(burn.monthly);
        }
      }
      await subscriptionRepository.updateArchiveStatus(id, isArchived);
      await get().fetchSubscriptions();
    } catch (err: any) {
      set({ error: err.message || "Failed to archive subscription", isLoading: false });
    }
  },

  wipeData: async () => {
    set({ isLoading: true, error: null });
    try {
      await backupService.wipeAllData();
      await get().fetchSubscriptions();
    } catch (err: any) {
      set({ error: err.message || "Failed to wipe data", isLoading: false });
    }
  },

  importData: async (json) => {
    set({ isLoading: true, error: null });
    try {
      await backupService.importData(json);
      await get().fetchSubscriptions();
    } catch (err: any) {
      set({ error: err.message || "Failed to import data", isLoading: false });
    }
  }
}));
