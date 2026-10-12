import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'icon';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export function Button({
  children,
  variant = 'secondary',
  size = 'md',
  isLoading = false,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles =
    'inline-flex items-center justify-center font-medium rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-slate-400/40 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer';

  const variantStyles = {
    primary:
      'bg-slate-900 text-white hover:bg-slate-800 active:bg-slate-950 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 shadow-xs',
    secondary:
      'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200 active:bg-slate-100 dark:bg-slate-900 dark:text-slate-200 dark:border-slate-800 dark:hover:bg-slate-800/60 shadow-xs',
    outline:
      'bg-transparent text-slate-700 hover:bg-slate-100 border border-slate-300 dark:text-slate-300 dark:border-slate-700 dark:hover:bg-slate-800',
    ghost:
      'bg-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-100 dark:hover:bg-slate-800',
    danger:
      'bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 dark:bg-red-950/30 dark:text-red-400 dark:border-red-900',
    icon:
      'p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-800 rounded-md',
  };

  const sizeStyles = {
    sm: 'text-xs px-2.5 py-1.5 gap-1.5',
    md: 'text-sm px-3.5 py-2 gap-2',
    lg: 'text-base px-4 py-2.5 gap-2.5',
  };

  const finalSize = variant === 'icon' ? '' : sizeStyles[size];

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${finalSize} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="inline-block animate-spin w-4 h-4 border-2 border-current border-t-transparent rounded-full" />
      ) : null}
      {children}
    </button>
  );
}
