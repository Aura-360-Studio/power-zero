import { AppShell } from './presentation/components/AppShell';
import { Dashboard } from './presentation/pages/Dashboard';
import { Archives } from './presentation/pages/Archives';
import { Settings } from './presentation/pages/Settings';
import { SentinelDetails } from './presentation/pages/SentinelDetails';
import { Profile } from './presentation/pages/Profile';
import { Pulse } from './presentation/pages/Pulse';
import { SplashScreen } from './presentation/components/organisms/SplashScreen';
import { useRouterStore } from './presentation/store/useRouterStore';
import { useEffect } from 'react';
import { useSubscriptionStore } from './presentation/store/useSubscriptionStore';
import { useProfileStore } from './presentation/store/useProfileStore';
import { BillingCalculator } from './core/utils/BillingCalculator';

function App() {
  const { currentView } = useRouterStore();
  const { subscriptions, updateSubscription } = useSubscriptionStore();
  const { profile } = useProfileStore();

  // Register Service Worker
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(err => console.error('SW registration failed:', err));
    }
  }, []);

  // Sentinel Alert Engine
  useEffect(() => {
    if (!profile.notificationsEnabled || Notification.permission !== 'granted') return;

    const checkNotifications = async () => {
      for (const sub of subscriptions) {
        const pending = BillingCalculator.getPendingNotification(sub);
        
        if (pending) {
          const title = '⚠️ SENTINEL ALERT';
          const body = `${sub.name} is about to renew. Neutralize now to save ₹${pending.amount.toFixed(2)}?`;
          
          const registration = await navigator.serviceWorker.ready;
          registration.showNotification(title, {
            body,
            icon: '/pwa-icon.svg',
            badge: '/favicon.svg',
            tag: `renew-${sub.id}-${pending.type}` // Prevent duplicate show
          });

          // Store the notification timestamp to prevent spam
          if (sub.id) {
            await updateSubscription(sub.id, { lastNotifiedAt: new Date().toISOString() });
          }
        }
      }
    };

    checkNotifications();
    // Re-check every hour while app is open
    const interval = setInterval(checkNotifications, 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, [profile.notificationsEnabled, subscriptions, updateSubscription]);

  return (
    <>
      <SplashScreen />
      <AppShell>
        <div key={currentView} className="animate-page-in">
          {currentView === 'dashboard' && <Dashboard />}
          {currentView === 'archive' && <Archives />}
          {currentView === 'settings' && <Settings />}
          {currentView === 'details' && <SentinelDetails />}
          {currentView === 'profile' && <Profile />}
          {currentView === 'pulse' && <Pulse />}
        </div>
      </AppShell>
    </>
  );
}

export default App;
