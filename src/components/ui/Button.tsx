import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'icon' | 'lime';
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
    'inline-flex items-center justify-center font-sans font-semibold rounded-lg transition-colors duration-150 cursor-pointer select-none disabled:opacity-40 disabled:pointer-events-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[#f97316]/40';

  const variantStyles = {
    primary:
      'bg-[#f97316] hover:bg-[#ea580c] text-white shadow-xs border border-[#f97316]',
    lime:
      'bg-[#10b981] hover:bg-[#059669] text-white shadow-xs border border-[#10b981]',
    secondary:
      'bg-[#f1f3f7] hover:bg-[#e5e7ee] text-[#3a4052] dark:bg-[#22242c] dark:hover:bg-[#2b2d37] dark:text-[#f4f5f8] border border-[#e5e7ee] dark:border-[#2f313c]',
    outline:
      'bg-transparent hover:bg-[#f1f3f7] text-[#3a4052] dark:hover:bg-[#22242c] dark:text-[#d3d7e2] border border-[#e2e5ec] dark:border-[#2f313c]',
    ghost:
      'bg-transparent hover:bg-[#f1f3f7] text-[#4b5266] hover:text-[#1b1e28] dark:hover:bg-[#22242c] dark:text-[#9da3b4] dark:hover:text-[#f4f5f8]',
    danger:
      'bg-rose-500/10 hover:bg-rose-500/15 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-900/40',
    icon:
      'p-1.5 rounded-md text-[#4b5266] dark:text-[#9da3b4] hover:text-[#1b1e28] dark:hover:text-[#f4f5f8] hover:bg-[#f1f3f7] dark:hover:bg-[#22242c]',
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
