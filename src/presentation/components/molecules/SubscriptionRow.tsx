import React from 'react';
import { Trash2 } from 'lucide-react';
import type { Subscription } from '../../../core/domain/Subscription';
import { DataPill } from '../atoms/DataPill';
import { IconButton } from '../atoms/IconButton';
import { useRouterStore } from '../../store/useRouterStore';

interface SubscriptionRowProps {
  subscription: Subscription;
  onKill: (id: string) => void;
}

export const SubscriptionRow: React.FC<SubscriptionRowProps> = ({ subscription, onKill }) => {
  const { navigate } = useRouterStore();

  return (
    <div 
      onClick={() => subscription.id && navigate('details', { id: subscription.id })}
      className="flex flex-row items-center justify-between py-4 border-b border border-border last:border-0 hover:bg-surface shadow-[var(--card-shadow)] border border-border px-2 rounded-xl transition-all cursor-pointer group"
    >
      
      {/* Left Column: Context */}
      <div className="flex flex-col items-start gap-1">
        <span className="font-bold text-zinc-100 tracking-tight">{subscription.name}</span>
        <DataPill label={subscription.category} />
      </div>

      {/* Center Column: Alert Timing */}
      <div className="text-sm font-mono text-zinc-500 hidden sm:block tracking-tight">
        {new Date(subscription.nextBillingDate).toLocaleDateString()}
      </div>

      {/* Right Column: Values & Actions */}
      <div className="flex flex-row items-center gap-4">
        <span className="font-mono font-bold text-zinc-100 tracking-tight">
          ₹{subscription.amount.toFixed(2)}
        </span>
        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
          <IconButton 
            icon={Trash2} 
            variant="danger" 
            onClick={(e) => {
              e.stopPropagation();
              subscription.id ? onKill(subscription.id) : null;
            }} 
            title="Kill Subscription"
          />
        </div>
      </div>
      
    </div>
  );
};
