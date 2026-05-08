import React from 'react';
import { Archive, ShieldCheck, TrendingDown } from 'lucide-react';
import { useSubscriptionStore } from '../store/useSubscriptionStore';
import { SubscriptionRow } from '../components/molecules/SubscriptionRow';
import { useProfileStore } from '../store/useProfileStore';
import { formatCurrency } from '../../core/utils/Currency';

export const Archives: React.FC = () => {
  const { archivedSubscriptions, removeSubscription } = useSubscriptionStore();
  const { profile } = useProfileStore();

  const totalMonthlySavings = archivedSubscriptions.reduce((acc, sub) => {
    if (sub.cycle === 'DAILY') return acc + (sub.amount * 30.41);
    if (sub.cycle === 'WEEKLY') return acc + (sub.amount * 4.33);
    if (sub.cycle === 'YEARLY') return acc + (sub.amount / 12);
    return acc + sub.amount;
  }, 0);

  return (
    <div className="animate-in fade-in duration-500">
      <header className="mb-10">
        <h2 className="text-3xl font-bold tracking-tighter text-zinc-100 mb-2">Archives</h2>
        <p className="text-zinc-500 font-medium">Historical record of neutralized leaks.</p>
      </header>

      {/* Savings Metric */}
      <div className="bg-accent/10 border border-accent/20 rounded-3xl p-6 mb-10 flex items-center gap-4">
        <div className="p-3 bg-accent text-background rounded-2xl">
          <TrendingDown size={24} />
        </div>
        <div>
          <span className="block text-accent text-xs font-bold uppercase tracking-wider">Total Neutralized</span>
          <span className="text-2xl font-bold text-accent">{formatCurrency(totalMonthlySavings, profile.currency)} / month</span>
        </div>
      </div>

      {/* Archived List */}
      <div className="space-y-1">
        <div className="flex items-center gap-2 mb-4 px-2">
          <ShieldCheck size={16} className="text-zinc-500" />
          <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Neutralized Targets</span>
        </div>

        {archivedSubscriptions.length === 0 ? (
          <div className="py-20 text-center border-2 border-dashed border border-border rounded-3xl">
            <Archive size={40} className="mx-auto mb-4 opacity-10" />
            <p className="text-zinc-500">No archived subscriptions found.</p>
          </div>
        ) : (
          archivedSubscriptions.map(sub => (
            <SubscriptionRow 
              key={sub.id} 
              subscription={sub} 
              onKill={removeSubscription} 
            />
          ))
        )}
      </div>
    </div>
  );
};
