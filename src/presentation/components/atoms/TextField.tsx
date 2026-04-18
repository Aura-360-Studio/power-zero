import React from 'react';

export const TextField = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className = '', ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={`appearance-none bg-transparent rounded-none border-b py-2 text-zinc-100 placeholder:text-zinc-500 font-mono focus:outline-none transition-colors border-white/20 focus:border-accent disabled:opacity-50 w-full ${className}`}
        {...props}
      />
    );
  }
);

TextField.displayName = 'TextField';
