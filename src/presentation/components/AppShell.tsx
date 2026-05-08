import React, { useState } from 'react';
import { LayoutGrid, History, Plus, Settings, Activity } from 'lucide-react';
import { AddSubscriptionDrawer } from './organisms/AddSubscriptionDrawer';
import { useRouterStore } from '../store/useRouterStore';
import { useProfileStore } from '../store/useProfileStore';
import { getInitials } from '../../core/utils/Identity';

interface AppShellProps {
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [showExitToast, setShowExitToast] = useState(false);
  const [lastBackPress, setLastBackPress] = useState(0);
  const { currentView, history, navigate, goBack } = useRouterStore();
  const { profile, fetchProfile } = useProfileStore();
  const mainRef = React.useRef<HTMLElement>(null);

  const handleLogoClick = () => {
    if (currentView === 'dashboard') {
      mainRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      navigate('dashboard');
    }
  };

  React.useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  // Handle Android/Browser Back Button
  React.useEffect(() => {
    const handlePopState = (e: PopStateEvent) => {
      e.preventDefault();
      
      if (history.length > 1) {
        goBack();
        // Stay in the app by pushing state back
        window.history.pushState(null, '', window.location.pathname);
      } else {
        const now = Date.now();
        if (now - lastBackPress < 2000) {
          // Allow exit - we don't push state back, so the next popstate will exit
          window.history.back();
        } else {
          setLastBackPress(now);
          setShowExitToast(true);
          setTimeout(() => setShowExitToast(false), 2000);
          // Stay in the app
          window.history.pushState(null, '', window.location.pathname);
        }
      }
    };

    // Initial state to catch the first back button
    window.history.pushState(null, '', window.location.pathname);
    window.addEventListener('popstate', handlePopState);
    
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [history, lastBackPress, goBack]);

  const initials = getInitials(profile?.name || 'User Sentinel');

  const NavButton = ({ view, icon: Icon }: { view: any, icon: any }) => (
    <button 
      onClick={() => navigate(view)}
      className={`relative p-3 rounded-full transition-all duration-500 group ${currentView === view ? 'text-accent' : 'text-zinc-500 hover:text-zinc-300'}`}
    >
      <Icon size={22} strokeWidth={currentView === view ? 2.5 : 2} />
      {currentView === view && (
        <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-accent rounded-full shadow-[0_0_8px_rgba(204,255,0,0.8)] animate-pulse" />
      )}
    </button>
  );

  return (
    <div className="min-h-screen bg-background flex justify-center overflow-hidden text-zinc-100 selection:bg-accent selection:text-background">
      {/* Mobile-first centered bounds */}
      <div className="w-full max-w-md bg-background flex flex-col h-screen overflow-hidden border-x border border-border relative">
        
        {/* Main Content Area */}
        <main 
          ref={mainRef}
          className="flex-1 overflow-y-auto pb-32 relative custom-scrollbar"
        >
          
          <header className="sticky top-0 z-20 bg-background/80 backdrop-blur-xl px-6 py-6 flex justify-between items-center">
            <button onClick={handleLogoClick} className="flex items-center gap-3 hover:opacity-80 active:scale-95 transition-all">
              <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center">
                <img src="/favicon.svg" alt="Logo" className="w-6 h-6" />
              </div>
              <h1 className="text-xl font-black tracking-tighter text-zinc-100 uppercase italic">Zhero</h1>
            </button>
            <div className="flex">
              <button onClick={() => navigate('profile')} className="w-10 h-10 rounded-full border-2 border-background bg-zinc-800 flex items-center justify-center text-xs font-black text-accent tracking-tighter hover:scale-105 transition-transform shadow-[0_0_20px_rgba(204,255,0,0.1)]">
                {initials}
              </button>
            </div>
          </header>

          <div className="px-6 pt-2">
            {children}
          </div>
        </main>

        {/* Minimalist Floating Glass Dock */}
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-full max-w-[320px] z-40 px-4">
          <nav className="bg-zinc-900/80 backdrop-blur-2xl border border-border rounded-full p-2 flex justify-between items-center shadow-[0_25px_50px_-12px_rgba(0,0,0,0.7)]">
            
            <NavButton view="dashboard" icon={LayoutGrid} />
            <NavButton view="archive" icon={History} />
            
            {/* Action FAB */}
            <button 
              onClick={() => setIsDrawerOpen(true)}
              className="p-4 bg-accent text-background rounded-full shadow-[0_0_30px_rgba(204,255,0,0.3)] hover:scale-105 active:scale-95 transition-all ring-4 ring-background"
            >
              <Plus size={24} strokeWidth={3} />
            </button>

            <NavButton view="settings" icon={Settings} />
            <NavButton view="pulse" icon={Activity} />
          </nav>
        </div>
        {/* Safe Structural Modals */}
        <AddSubscriptionDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />

        {/* Transient Exit Toast */}
        {showExitToast && (
          <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="bg-zinc-800 text-zinc-100 px-6 py-3 rounded-2xl border border-border shadow-2xl flex items-center gap-3">
              <div className="w-2 h-2 bg-accent rounded-full animate-pulse" />
              <span className="text-sm font-bold tracking-tight">Press back again to exit</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
