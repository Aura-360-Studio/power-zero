import React, { useEffect } from 'react';
import { useSubscriptionStore } from '../store/useSubscriptionStore';
import { DashboardMetrics } from '../components/organisms/DashboardMetrics';
import { CategoryReports } from '../components/organisms/CategoryReports';
import { SubscriptionRow } from '../components/molecules/SubscriptionRow';
import { useRouterStore } from '../store/useRouterStore';
import { ShieldCheck } from 'lucide-react';
import { PWAInstallCard } from '../components/atoms/PWAInstallCard';

export const Dashboard: React.FC = () => {
  const { subscriptions, fetchSubscriptions, removeSubscription } = useSubscriptionStore();
  const { selectedCategory } = useRouterStore();

  useEffect(() => {
    fetchSubscriptions();
  }, [fetchSubscriptions]);

  // Keep UX focused on ACTIVE leaks only
  const activeSubs = subscriptions.filter(sub => {
    const isActive = sub.status === 'ACTIVE';
    const matchesCategory = selectedCategory ? sub.category === selectedCategory : true;
    return isActive && matchesCategory;
  });

  return (
    <div className="flex flex-col h-full">
      <DashboardMetrics />
      
      <CategoryReports />
      
      <div className="flex-1 py-2">
        <h2 className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-4 px-2">
          {selectedCategory ? `Routine Check: ${selectedCategory}` : 'Routine Check'}
        </h2>

        {activeSubs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-zinc-500">
            <ShieldCheck size={48} strokeWidth={1} className="mb-4 text-accent" />
            <span className="text-xl font-mono font-bold text-zinc-100 tracking-tight">Zero Leaks Detected</span>
            <span className="text-sm font-semibold tracking-tight text-zinc-500 mt-2">Your system is clean.</span>
          </div>
        ) : (
          <div className="flex flex-col gap-1">
            {activeSubs.map(sub => (
              <SubscriptionRow 
                key={sub.id} 
                subscription={sub} 
                onKill={removeSubscription} 
              />
            ))}
          </div>
        )}
      </div>

      <div className="px-2 pb-10">
        <PWAInstallCard />
      </div>
    </div>
  );
};
