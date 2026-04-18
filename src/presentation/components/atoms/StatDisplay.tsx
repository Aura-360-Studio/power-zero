import React from 'react';

interface StatDisplayProps {
  label: string;
  value: string | number;
  currency?: string;
}

export const StatDisplay: React.FC<StatDisplayProps> = ({ label, value, currency = '' }) => {
  return (
    <div className="flex flex-col">
      <span className="text-xs text-gray-400 uppercase tracking-tighter">{label}</span>
      <span className="text-4xl font-mono font-bold tracking-tight text-gray-900">
        {currency}{value}
      </span>
    </div>
  );
};
