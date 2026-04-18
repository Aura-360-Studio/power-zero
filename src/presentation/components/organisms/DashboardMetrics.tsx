import React from 'react';
import { useSubscriptionStore } from '../../store/useSubscriptionStore';
import { StatDisplay } from '../atoms/StatDisplay';

export const DashboardMetrics: React.FC = () => {
  const { burnRate } = useSubscriptionStore();

  return (
    <div className="grid grid-cols-1 gap-6 py-6 border-b border-gray-100">
      <StatDisplay label="Daily Leak" value={burnRate.daily.toFixed(2)} currency="₹" />
      <StatDisplay label="Monthly Leak" value={burnRate.monthly.toFixed(2)} currency="₹" />
      <StatDisplay label="Annual Leak" value={burnRate.yearly.toFixed(2)} currency="₹" />
    </div>
  );
};
