import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: LucideIcon;
  variant?: 'neutral' | 'danger' | 'success';
}

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ icon: Icon, variant = 'neutral', className = '', ...props }, ref) => {
    const variants = {
      neutral: 'text-gray-900 hover:bg-gray-100 border-transparent',
      danger: 'text-red-600 hover:bg-red-50 border-transparent',
      success: 'text-emerald-600 hover:bg-emerald-50 border-transparent'
    };

    return (
      <button
        ref={ref}
        className={`inline-flex items-center justify-center p-2 rounded transition-colors ${variants[variant]} ${className}`}
        {...props}
      >
        <Icon size={20} strokeWidth={1.5} />
      </button>
    );
  }
);

IconButton.displayName = 'IconButton';
