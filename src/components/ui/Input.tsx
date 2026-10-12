import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div className="w-full font-sans">
        {label && (
          <label className="block text-xs font-semibold text-[#4b5266] dark:text-[#9da3b4] mb-1.5">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`w-full px-3 py-2 text-sm bg-white dark:bg-[#1c1d23] border rounded-lg text-[#1b1e28] dark:text-[#f4f5f8] placeholder-[#9da3b4] focus:outline-none transition-colors ${
            error
              ? 'border-rose-500 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20'
              : 'border-[#e2e5ec] dark:border-[#2f313c] focus:border-[#f97316] focus:ring-2 focus:ring-[#f97316]/20'
          } ${className}`}
          {...props}
        />
        {error && <p className="mt-1 text-xs text-rose-500">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
