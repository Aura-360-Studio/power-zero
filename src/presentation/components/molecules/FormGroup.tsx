import React from 'react';

interface FormGroupProps {
  label: string;
  error?: string;
  children: React.ReactNode;
}

export const FormGroup: React.FC<FormGroupProps> = ({ label, error, children }) => {
  return (
    <div className="flex flex-col gap-1 w-full">
      <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
        {label}
      </label>
      
      {children}
      
      {error && <span className="text-xs text-red-500 mt-1">{error}</span>}
    </div>
  );
};
