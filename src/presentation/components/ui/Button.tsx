import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'icon' | 'accent';
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
    'inline-flex items-center justify-center font-sans font-medium rounded-lg transition-colors duration-150 cursor-pointer select-none disabled:opacity-40 disabled:pointer-events-none focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400/40';

  const variantStyles = {
    primary:
      'bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-100 dark:hover:bg-white dark:text-zinc-900 shadow-2xs border border-transparent',
    accent:
      'bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white shadow-2xs border border-transparent',
    secondary:
      'bg-[var(--bg-muted)] hover:bg-[var(--border-default)] text-[var(--text-main)] border border-[var(--border-default)]',
    outline:
      'bg-transparent hover:bg-[var(--bg-muted)] text-[var(--text-body)] hover:text-[var(--text-main)] border border-[var(--border-default)]',
    ghost:
      'bg-transparent hover:bg-[var(--bg-muted)] text-[var(--text-muted)] hover:text-[var(--text-main)]',
    danger:
      'bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/40',
    icon:
      'p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-muted)]',
  };

  const sizeStyles = {
    sm: 'text-xs px-2.5 py-1.5 gap-1.5',
    md: 'text-xs sm:text-sm px-3.5 py-2 gap-2',
    lg: 'text-sm sm:text-base px-4.5 py-2.5 gap-2.5',
  };

  const finalSize = variant === 'icon' ? '' : sizeStyles[size];

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${finalSize} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="inline-block animate-spin w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full mr-1.5" />
      ) : null}
      {children}
    </button>
  );
}
