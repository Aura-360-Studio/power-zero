import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Archive, Trash2, ShieldAlert } from 'lucide-react';
import { useRouterStore } from '../store/useRouterStore';
import { useSubscriptionStore } from '../store/useSubscriptionStore';
import { DataPill } from '../components/atoms/DataPill';

export const SentinelDetails: React.FC = () => {
  const { selectedSubscriptionId, navigate } = useRouterStore();
  const { subscriptions, archivedSubscriptions, removeSubscription, archiveSubscription } = useSubscriptionStore();
  const [isAccordionOpen, setIsAccordionOpen] = useState(false);

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

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <button 
          onClick={() => navigate('dashboard')}
          className="p-2 -ml-2 text-zinc-500 hover:text-zinc-100 transition-colors"
        >
          &larr; Dashboard
        </button>
        <div className="flex gap-2">
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
        <div className="flex flex-col">
          <span className="text-zinc-500 text-sm font-bold uppercase tracking-widest mb-1">Monthly Impact</span>
          <div className="flex items-baseline gap-1">
            <span className="text-4xl font-bold text-accent">₹{subscription.amount.toFixed(2)}</span>
            <span className="text-zinc-500 font-medium">/ month</span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-8 mt-8 border-t border-white/5 pt-8">
          <div>
            <span className="block text-zinc-500 text-xs font-bold uppercase tracking-wider mb-1">Next Bill</span>
            <span className="text-zinc-100 font-mono">{new Date(subscription.nextBillingDate).toLocaleDateString()}</span>
          </div>
          <div>
            <span className="block text-zinc-500 text-xs font-bold uppercase tracking-wider mb-1">Frequency</span>
            <span className="text-zinc-100">{subscription.cycle}</span>
          </div>
        </div>
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
            <ul className="list-disc pl-5 space-y-2">
              <li>In-app settings under "Subscription" or "Account".</li>
              <li>The App Store / Play Store subscription management portal.</li>
              <li>Your bank's "Mandates" section if it's a direct debit.</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};
