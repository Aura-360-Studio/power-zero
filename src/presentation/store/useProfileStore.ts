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
  applyTheme: () => void;
  addNeutralizedAmount: (amount: number) => Promise<void>;
}

export const useProfileStore = create<ProfileState>((set, get) => ({
  profile: defaultProfile,
  isLoading: false,
  error: null,

  fetchProfile: async () => {
    try {
      const profile = await userProfileRepository.getProfile();
      set({ profile: { ...defaultProfile, ...profile } });
      get().applyTheme();
    } catch (err: any) {
      console.error("Profile fetch error:", err);
    }
  },

  updateProfile: async (updates) => {
    try {
      const current = get().profile;
      const newProfile = { ...current, ...updates };
      await userProfileRepository.saveProfile(newProfile);
      set({ profile: newProfile });
      get().applyTheme();
    } catch (err: any) {
      console.error("Profile update error:", err);
    }
  },

  applyTheme: () => {
    const { theme } = get().profile;
    const root = window.document.documentElement;
    
    // Cleanup existing listeners if any
    if ((window as any).themeQuery) {
      (window as any).themeQuery.removeEventListener('change', get().applyTheme);
    }

    const setMode = (mode: 'dark' | 'light') => {
      root.classList.remove('dark', 'light');
      root.classList.add(mode);
      root.style.colorScheme = mode;
    };

    if (theme === 'system') {
      const query = window.matchMedia('(prefers-color-scheme: light)');
      setMode(query.matches ? 'light' : 'dark');
      
      // Real-time listener for system changes
      query.addEventListener('change', get().applyTheme);
      (window as any).themeQuery = query;
    } else {
      setMode(theme);
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
