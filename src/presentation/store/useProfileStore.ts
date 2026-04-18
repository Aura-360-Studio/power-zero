import { create } from 'zustand';
import { userProfileRepository } from '../../infrastructure/repositories/UserProfileRepository';
import type { UserProfile } from '../../core/domain/UserProfile';
import { defaultProfile } from '../../core/domain/UserProfile';

interface ProfileState {
  profile: UserProfile;
  isLoading: boolean;
  error: string | null;

  fetchProfile: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  addNeutralizedAmount: (amount: number) => Promise<void>;
}

export const useProfileStore = create<ProfileState>((set, get) => ({
  profile: defaultProfile,
  isLoading: false,
  error: null,

  fetchProfile: async () => {
    set({ isLoading: true, error: null });
    try {
      const profile = await userProfileRepository.getProfile() || defaultProfile;
      set({ profile, isLoading: false });
    } catch (err: any) {
      set({ error: err.message || "Failed to fetch profile", isLoading: false });
    }
  },

  updateProfile: async (updates) => {
    set({ isLoading: true, error: null });
    try {
      const current = get().profile;
      const newProfile = { ...current, ...updates };
      await userProfileRepository.saveProfile(newProfile);
      set({ profile: newProfile, isLoading: false });
    } catch (err: any) {
      set({ error: err.message || "Failed to update profile", isLoading: false });
    }
  },

  addNeutralizedAmount: async (amount) => {
    try {
      const current = get().profile;
      const newAmount = current.totalNeutralized + amount;
      await userProfileRepository.updateTotalNeutralized(newAmount);
      set({ profile: { ...current, totalNeutralized: newAmount } });
    } catch (err: any) {
      console.error("Failed to add neutralized amount", err);
    }
  }
}));
