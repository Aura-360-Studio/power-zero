import { create } from 'zustand';

type View = 'dashboard' | 'archive' | 'settings' | 'details' | 'profile' | 'pulse';

interface RouterState {
  currentView: View;
  selectedSubscriptionId: string | null;
  selectedCategory: string | null;
  navigate: (view: View, params?: { id?: string }) => void;
  setSelectedCategory: (category: string | null) => void;
}

export const useRouterStore = create<RouterState>((set) => ({
  currentView: 'dashboard',
  selectedSubscriptionId: null,
  selectedCategory: null,
  navigate: (view, params) => set({ 
    currentView: view, 
    selectedSubscriptionId: params?.id || null,
    selectedCategory: null // Reset category filter on navigation
  }),
  setSelectedCategory: (category) => set({ selectedCategory: category }),
}));
