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
          <label className="block text-xs font-semibold text-[#525b75] dark:text-[#9fa6bc] mb-1.5">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`w-full px-3 py-2 text-sm bg-white dark:bg-[#141824] border rounded-lg text-[#141824] dark:text-[#eff2f6] placeholder-[#9fa6bc] focus:outline-none transition-colors ${
            error
              ? 'border-rose-500 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20'
              : 'border-[#cbd0dd] dark:border-[#373e53] focus:border-[#ea580c] focus:ring-2 focus:ring-[#ea580c]/20'
          } ${className}`}
          {...props}
        />
        {error && <p className="mt-1 text-xs text-rose-500">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
