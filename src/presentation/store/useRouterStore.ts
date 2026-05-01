import { create } from 'zustand';

type View = 'dashboard' | 'archive' | 'settings' | 'details' | 'profile' | 'pulse';

interface HistoryItem {
  view: View;
  id?: string | null;
}

interface RouterState {
  currentView: View;
  selectedSubscriptionId: string | null;
  selectedCategory: string | null;
  history: HistoryItem[];
  navigate: (view: View, params?: { id?: string }, isBack?: boolean) => void;
  goBack: () => void;
  setSelectedCategory: (category: string | null) => void;
}

export const useRouterStore = create<RouterState>((set, get) => ({
  currentView: 'dashboard',
  selectedSubscriptionId: null,
  selectedCategory: null,
  history: [{ view: 'dashboard' }],
  navigate: (view, params, isBack = false) => {
    const { history, currentView, selectedSubscriptionId } = get();
    
    // Don't push if it's the exact same view and ID
    if (view === currentView && params?.id === selectedSubscriptionId) return;

    let newHistory = [...history];
    if (!isBack) {
      newHistory.push({ view, id: params?.id });
    }

    set({ 
      currentView: view, 
      selectedSubscriptionId: params?.id || null,
      selectedCategory: null,
      history: newHistory
    });
  },
  goBack: () => {
    const { history } = get();
    if (history.length > 1) {
      const newHistory = [...history];
      newHistory.pop(); // Remove current
      const previous = newHistory[newHistory.length - 1];
      
      set({
        currentView: previous.view,
        selectedSubscriptionId: previous.id || null,
        history: newHistory,
        selectedCategory: null
      });
    }
  },
  setSelectedCategory: (category) => set({ selectedCategory: category }),
}));
