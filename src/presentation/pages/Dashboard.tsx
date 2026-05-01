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

  const activeSubs = subscriptions.filter(sub => {
    const isActive = sub.status === 'ACTIVE';
    const matchesCategory = selectedCategory ? sub.category === selectedCategory : true;
    return isActive && matchesCategory;
  });

  const [expandedCategories, setExpandedCategories] = React.useState<Record<string, boolean>>({});

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  // Group by category
  const groupedSubs = activeSubs.reduce((acc, sub) => {
    if (!acc[sub.category]) acc[sub.category] = [];
    acc[sub.category].push(sub);
    return acc;
  }, {} as Record<string, typeof activeSubs>);

  const sortedCategories = Object.keys(groupedSubs).sort();

  return (
    <div className="flex flex-col h-full">
      <DashboardMetrics />
      
      <CategoryReports />
      
      <div className="flex-1 py-2">
        <h2 className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-6 px-2">
          {selectedCategory ? `Routine Check: ${selectedCategory}` : 'System Integrity Check'}
        </h2>

        {activeSubs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-zinc-500">
            <ShieldCheck size={48} strokeWidth={1} className="mb-4 text-accent" />
            <span className="text-xl font-mono font-bold text-zinc-100 tracking-tight">Zero Leaks Detected</span>
            <span className="text-sm font-semibold tracking-tight text-zinc-500 mt-2">Your system is clean.</span>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {sortedCategories.map(category => (
              <div key={category} className="flex flex-col">
                <button 
                  onClick={() => toggleCategory(category)}
                  className="flex items-center justify-between px-2 mb-3 group"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-1 h-3 rounded-full transition-all ${expandedCategories[category] !== false ? 'bg-accent h-4' : 'bg-zinc-800'}`} />
                    <span className={`text-[11px] font-black uppercase tracking-[0.2em] transition-colors ${expandedCategories[category] !== false ? 'text-zinc-100' : 'text-zinc-500 group-hover:text-zinc-300'}`}>
                      {category}
                    </span>
                    <span className="text-[9px] font-bold text-zinc-700 uppercase tracking-widest">
                      ({groupedSubs[category].length})
                    </span>
                  </div>
                  <div className={`w-1.5 h-1.5 rounded-full transition-all ${expandedCategories[category] !== false ? 'bg-accent shadow-[0_0_8px_rgba(204,255,0,0.6)]' : 'bg-transparent border border-zinc-700'}`} />
                </button>

                <div className={`flex flex-col gap-1 transition-all duration-300 overflow-hidden ${expandedCategories[category] !== false ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                  {groupedSubs[category].map(sub => (
                    <SubscriptionRow 
                      key={sub.id} 
                      subscription={sub} 
                      onKill={removeSubscription} 
                    />
                  ))}
                </div>
              </div>
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
