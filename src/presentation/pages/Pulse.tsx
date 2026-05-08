import React from 'react';
import { useSubscriptionStore } from '../store/useSubscriptionStore';
import { useProfileStore } from '../store/useProfileStore';
import { formatCurrency } from '../../core/utils/Currency';
import { BellRing, Calendar, ShieldCheck, ChevronRight } from 'lucide-react';
import { useRouterStore } from '../store/useRouterStore';

export const Pulse: React.FC = () => {
  const { subscriptions } = useSubscriptionStore();
  const { profile } = useProfileStore();
  const { navigate } = useRouterStore();

  const now = new Date();
  const sevenDaysFromNow = new Date();
  sevenDaysFromNow.setDate(now.getDate() + 7);
  
  const thirtyDaysFromNow = new Date();
  thirtyDaysFromNow.setDate(now.getDate() + 30);

  // Filter alerts: nextBillingDate within 7 days and status is ACTIVE
  const alerts = subscriptions.filter(sub => {
    if (sub.status !== 'ACTIVE') return false;
    const nextDate = new Date(sub.nextBillingDate);
    return nextDate >= now && nextDate <= sevenDaysFromNow;
  });

  // Filter planner: all upcoming in 30 days, sorted chronologically, and status is ACTIVE
  const planner = subscriptions
    .filter(sub => {
      if (sub.status !== 'ACTIVE') return false;
      const nextDate = new Date(sub.nextBillingDate);
      return nextDate >= now && nextDate <= thirtyDaysFromNow;
    })
    .sort((a, b) => new Date(a.nextBillingDate).getTime() - new Date(b.nextBillingDate).getTime());

  return (
    <div className="animate-page-in">
      <header className="mb-10">
        <h2 className="text-3xl font-bold tracking-tighter text-zinc-100 mb-2">The Pulse</h2>
        <p className="text-zinc-500 font-medium">Predictive Monitoring & Alerts.</p>
      </header>

      <div className="space-y-10">
        
        {/* Section 1: Sentinel Alerts */}
        <section>
          <div className="flex items-center gap-2 mb-4 px-2">
            <BellRing size={16} className={alerts.length > 0 ? "text-red-400" : "text-zinc-500"} />
            <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Sentinel Alerts</span>
          </div>
          
          {alerts.length === 0 ? (
            <div className="bg-surface shadow-[var(--card-shadow)] border border-border rounded-3xl p-8 flex flex-col items-center justify-center text-center">
              <ShieldCheck size={32} className="text-accent/40 mb-3" />
              <h3 className="text-zinc-100 font-bold mb-1">Protocol Stable</h3>
              <p className="text-zinc-500 text-sm max-w-[200px]">No critical leaks detected for the next 7 days.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {alerts.map(sub => (
                <div 
                  key={sub.id} 
                  onClick={() => navigate('details', { id: sub.id })}
                  className="bg-red-500/5 border border-red-500/20 rounded-3xl p-5 flex items-center justify-between group active:scale-[0.98] transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-red-500/10 rounded-2xl flex items-center justify-center text-red-400">
                      <BellRing size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-zinc-100">{sub.name}</h4>
                      <p className="text-xs text-red-400 font-bold uppercase tracking-tighter">Renewing Soon</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-black text-zinc-100">{formatCurrency(sub.amount, profile.currency)}</div>
                    <div className="text-[10px] text-zinc-500 font-mono">{new Date(sub.nextBillingDate).toLocaleDateString()}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Section 2: The Planner */}
        <section>
          <div className="flex items-center gap-2 mb-4 px-2">
            <Calendar size={16} className="text-zinc-500" />
            <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">30-Day Forecast</span>
          </div>

          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-[23px] top-4 bottom-4 w-px bg-surface shadow-[var(--card-shadow)] border border-border" />

            <div className="space-y-6">
              {planner.length === 0 ? (
                <p className="text-zinc-500 text-sm text-center py-10">No upcoming subscriptions in the next 30 days.</p>
              ) : (
                planner.map(sub => (
                  <div 
                    key={sub.id} 
                    onClick={() => navigate('details', { id: sub.id })}
                    className="relative flex items-center gap-6 group cursor-pointer"
                  >
                    {/* Timeline Node */}
                    <div className="relative z-10 w-12 h-12 bg-zinc-900 border border-border rounded-2xl flex flex-col items-center justify-center group-hover:border-accent/50 transition-colors">
                      <span className="text-[10px] font-black text-zinc-500 uppercase leading-none mb-0.5">{new Date(sub.nextBillingDate).toLocaleString('default', { month: 'short' })}</span>
                      <span className="text-sm font-black text-zinc-100 leading-none">{new Date(sub.nextBillingDate).getDate()}</span>
                    </div>

                    {/* Card */}
                    <div className="flex-1 bg-surface shadow-[var(--card-shadow)] border border-border rounded-2xl p-4 flex items-center justify-between group-hover:bg-white/[0.08] transition-all">
                      <div>
                        <h5 className="font-bold text-zinc-100 text-sm">{sub.name}</h5>
                        <p className="text-[10px] text-zinc-500 uppercase font-black tracking-widest">{sub.category}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-bold text-zinc-100">{formatCurrency(sub.amount, profile.currency)}</span>
                        <ChevronRight size={14} className="text-zinc-700 group-hover:text-accent transition-colors" />
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};
