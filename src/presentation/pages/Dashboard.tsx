import React, { useEffect } from 'react';
import { useSubscriptionStore } from '../store/useSubscriptionStore';
import { DashboardMetrics } from '../components/organisms/DashboardMetrics';
import { SubscriptionRow } from '../components/molecules/SubscriptionRow';
import { ShieldCheck } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { subscriptions, fetchSubscriptions, removeSubscription } = useSubscriptionStore();

  useEffect(() => {
    fetchSubscriptions();
  }, [fetchSubscriptions]);

  // Keep UX focused on ACTIVE leaks only
  const activeSubs = subscriptions.filter(sub => sub.status === 'ACTIVE');

  return (
    <div className="flex flex-col h-full">
      <h1 className="text-2xl font-bold tracking-tighter text-gray-900 mb-2">Power Zero</h1>
      
      <DashboardMetrics />
      
      <div className="flex-1 py-8">
        <h2 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-4">
          Routine Check
        </h2>

        {activeSubs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <ShieldCheck size={48} strokeWidth={1} className="mb-4 text-emerald-500" />
            <span className="text-xl font-mono font-bold text-gray-900 tracking-tight">Zero Leaks Detected</span>
            <span className="text-sm font-semibold tracking-tight text-gray-400 mt-2">Your system is clean.</span>
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
    </div>
  );
};
