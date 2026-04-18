import { create } from 'zustand';
import { subscriptionRepository } from '../../infrastructure/repositories/SubscriptionRepository';
import { CalculateBurnRate, type BurnRateMetrics } from '../../core/use-cases/CalculateBurnRate';
import type { Subscription } from '../../core/domain/Subscription';

interface SubscriptionState {
  subscriptions: Subscription[];
  burnRate: BurnRateMetrics;
  isLoading: boolean;
  error: string | null;

  // Store actions defining the Global workflow
  fetchSubscriptions: () => Promise<void>;
  addSubscription: (sub: Omit<Subscription, 'id'> & { id?: string }) => Promise<void>;
  removeSubscription: (id: string) => Promise<void>;
}

const defaultBurnRate: BurnRateMetrics = { daily: 0, monthly: 0, yearly: 0 };

export const useSubscriptionStore = create<SubscriptionState>((set, get) => ({
  subscriptions: [],
  burnRate: defaultBurnRate,
  isLoading: false,
  error: null,

  fetchSubscriptions: async () => {
    set({ isLoading: true, error: null });
    try {
      const subs = await subscriptionRepository.getAll();
      
      // Decoupled Business Core Logic call
      const burnRate = CalculateBurnRate(subs);
      
      set({ subscriptions: subs, burnRate, isLoading: false });
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
  }
}));
