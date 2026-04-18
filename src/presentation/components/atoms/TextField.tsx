import React from 'react';

export const TextField = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className = '', ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={`appearance-none bg-transparent rounded-none border-b py-2 text-gray-900 font-mono focus:outline-none transition-colors border-gray-300 focus:border-gray-900 disabled:opacity-50 w-full ${className}`}
        {...props}
      />
    );
  }
);

TextField.displayName = 'TextField';
