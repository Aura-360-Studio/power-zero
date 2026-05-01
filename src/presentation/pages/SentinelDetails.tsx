import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Archive, Trash2, ShieldAlert, Edit2, ArrowLeft } from 'lucide-react';
import { useRouterStore } from '../store/useRouterStore';
import { useSubscriptionStore } from '../store/useSubscriptionStore';
import { DataPill } from '../components/atoms/DataPill';
import { EditSubscriptionDrawer } from '../components/organisms/EditSubscriptionDrawer';
import { BillingCalculator } from '../../core/utils/BillingCalculator';
import { formatCurrency } from '../../core/utils/Currency';
import { useProfileStore } from '../store/useProfileStore';

export const SentinelDetails: React.FC = () => {
  const { selectedSubscriptionId, navigate, goBack } = useRouterStore();
  const { subscriptions, archivedSubscriptions, removeSubscription, archiveSubscription } = useSubscriptionStore();
  const [isAccordionOpen, setIsAccordionOpen] = useState(false);
  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);

  const subscription = subscriptions.find(s => s.id === selectedSubscriptionId) || 
                       archivedSubscriptions.find(s => s.id === selectedSubscriptionId);

  if (!subscription) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-zinc-500">
        <ShieldAlert size={48} className="mb-4 opacity-20" />
        <p>Sentinel could not locate this record.</p>
        <button 
          onClick={() => navigate('dashboard')}
          className="mt-4 text-accent hover:underline"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  const handleKill = async () => {
    if (confirm("Are you sure you want to kill this subscription? It will be marked as CANCELLED.")) {
      await removeSubscription(subscription.id!);
      navigate('dashboard');
    }
  };

  const handleArchive = async () => {
    await archiveSubscription(subscription.id!, !subscription.isArchived);
    navigate('dashboard');
  };

  const { profile } = useProfileStore();
  const normalized = BillingCalculator.migrateLegacySubscription(subscription);
  const dailyLeak = BillingCalculator.getDailyLeak(normalized.amount, normalized.cycleType, normalized.cycleValue);
  const yearlySpend = BillingCalculator.getYearlySpend(normalized.amount, normalized.cycleType, normalized.cycleValue);
  const lifetimeTotal = BillingCalculator.calculateLifetimeTotal(normalized.amount, normalized.startDate, normalized.cycleType, normalized.cycleValue);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <button 
          onClick={() => goBack()}
          className="p-2 -ml-2 text-accent hover:opacity-70 transition-all flex items-center gap-2"
        >
          <ArrowLeft size={20} strokeWidth={3} />
          <span className="text-xs font-black uppercase tracking-widest">Back</span>
        </button>
        <div className="flex gap-2">
          <button 
            onClick={() => setIsEditDrawerOpen(true)}
            className="p-2 text-zinc-500 hover:text-accent transition-colors"
            title="Edit"
          >
            <Edit2 size={20} />
          </button>
          <button 
            onClick={handleArchive}
            className={`p-2 transition-colors ${subscription.isArchived ? 'text-accent' : 'text-zinc-500 hover:text-accent'}`}
            title={subscription.isArchived ? "Unarchive" : "Archive"}
          >
            <Archive size={20} />
          </button>
          <button 
            onClick={handleKill}
            className="p-2 text-zinc-500 hover:text-red-400 transition-colors"
            title="Kill"
          >
            <Trash2 size={20} />
          </button>
        </div>
      </div>

      {/* Main Info */}
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-2">
          <h2 className="text-4xl font-bold tracking-tighter text-zinc-100">{subscription.name}</h2>
          <DataPill label={subscription.status} />
        </div>
        <p className="text-zinc-500 font-medium">{subscription.category}</p>
      </div>

      {/* Metrics Card */}
      <div className="bg-white/5 border border-white/10 rounded-3xl p-8 mb-8">
        <div className="flex flex-col mb-8">
          <span className="text-zinc-500 text-sm font-bold uppercase tracking-widest mb-1">Lifetime Impact</span>
          <div className="flex items-baseline gap-1">
            <span className="text-4xl font-bold text-accent">{formatCurrency(lifetimeTotal, profile.currency)}</span>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-8 border-t border-white/5 pt-8 mb-8">
          <div>
            <span className="block text-zinc-500 text-xs font-bold uppercase tracking-wider mb-1">Daily Leak</span>
            <span className="text-zinc-100 font-mono text-xl">{formatCurrency(dailyLeak, profile.currency)}</span>
          </div>
          <div>
            <span className="block text-zinc-500 text-xs font-bold uppercase tracking-wider mb-1">Yearly Spend</span>
            <span className="text-zinc-100 font-mono text-xl">{formatCurrency(yearlySpend, profile.currency)}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 border-t border-white/5 pt-8">
          <div>
            <span className="block text-zinc-500 text-xs font-bold uppercase tracking-wider mb-1">Next Bill</span>
            <span className="text-zinc-100 font-mono">{new Date(subscription.nextBillingDate).toLocaleDateString()}</span>
          </div>
          <div>
            <span className="block text-zinc-500 text-xs font-bold uppercase tracking-wider mb-1">Cycle</span>
            <span className="text-zinc-100 uppercase text-xs font-black tracking-widest">
              {normalized.cycleValue} {normalized.cycleType.replace('CALENDAR_', '')}
            </span>
          </div>
        </div>
      </div>

      {/* Budget Contribution */}
      <div className="bg-white/5 border border-white/10 rounded-3xl p-8 mb-8">
        <div className="flex justify-between items-end mb-4">
          <span className="text-[10px] font-black uppercase tracking-[0.1em] text-zinc-500">Budget Used</span>
          <span className="text-accent text-xs font-bold">
            {profile.monthlyBudget > 0 
              ? `${((normalized.amount / normalized.cycleValue) / profile.monthlyBudget * 100).toFixed(1)}%` 
              : 'N/A'}
          </span>
        </div>
        
        {profile.monthlyBudget > 0 ? (
          <>
            <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden mb-2">
              <div 
                className="h-full bg-accent transition-all duration-1000 ease-out" 
                style={{ width: `${Math.min(((normalized.amount / normalized.cycleValue) / profile.monthlyBudget * 100), 100)}%` }}
              />
            </div>
            <p className="text-[10px] text-zinc-500 font-medium">
              Consumes {formatCurrency(normalized.amount / normalized.cycleValue, profile.currency)} of your {formatCurrency(profile.monthlyBudget, profile.currency)} monthly budget.
            </p>
          </>
        ) : (
          <button 
            onClick={() => navigate('settings')}
            className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest leading-relaxed text-left hover:text-accent transition-colors"
          >
            To view this sentinel's <span className="text-accent underline">Budget Weight</span>, please configure your monthly limit in Settings.
          </button>
        )}
      </div>

      {/* Cancel Accordion */}
      <div className="border border-white/10 rounded-2xl overflow-hidden">
        <button 
          onClick={() => setIsAccordionOpen(!isAccordionOpen)}
          className="w-full flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 transition-colors"
        >
          <span className="font-bold text-sm text-zinc-100">Sentinel Intelligence: How to Cancel</span>
          {isAccordionOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>
        {isAccordionOpen && (
          <div className="p-4 text-sm text-zinc-400 leading-relaxed border-t border-white/10">
            <p className="mb-4">
              Our intelligence suggests this is a <strong>{subscription.category}</strong> subscription. 
              Usually, these can be managed through:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-xs">
              <li>In-app settings under "Subscription" or "Account" management.</li>
              <li>The App Store / Play Store subscription portals.</li>
              <li><strong>UPI Mandates:</strong> Open your payment app (GPay, PhonePe, Paytm) and navigate to <span className="text-accent">Settings &gt; Autopay</span> or <span className="text-accent">UPI Mandates</span> to revoke.</li>
              <li>Your bank's official app under "Mandates" or "E-Mandate" section.</li>
            </ul>
          </div>
        )}
      </div>

      {/* Edit Drawer */}
      <EditSubscriptionDrawer 
        isOpen={isEditDrawerOpen} 
        onClose={() => setIsEditDrawerOpen(false)} 
        subscription={subscription}
      />
    </div>
  );
};
