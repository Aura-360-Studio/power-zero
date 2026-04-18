import React from 'react';

interface DataPillProps {
  label: string;
  className?: string;
}

export const DataPill: React.FC<DataPillProps> = ({ label, className = '' }) => {
  return (
    <span className={`px-2 py-1 text-[10px] font-bold uppercase tracking-widest border border-gray-200 text-gray-500 rounded ${className}`}>
      {label}
    </span>
  );
};
