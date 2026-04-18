import React from 'react';

interface StatDisplayProps {
  label: string;
  value: string | number;
  currency?: string;
  isPrimary?: boolean;
}

export const StatDisplay: React.FC<StatDisplayProps> = ({ label, value, currency = '', isPrimary = false }) => {
  return (
    <div className="flex flex-col">
      <span className="text-xs text-zinc-500 uppercase tracking-tighter">{label}</span>
      <span className={`text-4xl font-mono font-bold tracking-tight ${isPrimary ? 'text-accent' : 'text-zinc-100'}`}>
        {currency}{value}
      </span>
    </div>
  );
};
