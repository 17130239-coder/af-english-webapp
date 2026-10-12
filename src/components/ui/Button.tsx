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
    'inline-flex items-center justify-center font-sans font-semibold rounded-lg transition-colors duration-150 cursor-pointer select-none disabled:opacity-40 disabled:pointer-events-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ea580c]/40';

  const variantStyles = {
    primary:
      'bg-[#ea580c] hover:bg-[#c2410c] text-white shadow-xs border border-[#ea580c]',
    lime:
      'bg-[#25b003] hover:bg-[#1fa002] text-white shadow-xs border border-[#25b003]',
    secondary:
      'bg-[#eff2f6] hover:bg-[#e3e6ed] text-[#31374a] dark:bg-[#1f232e] dark:hover:bg-[#272f3d] dark:text-[#eff2f6] border border-[#e3e6ed] dark:border-[#31374a]',
    outline:
      'bg-transparent hover:bg-[#eff2f6] text-[#31374a] dark:hover:bg-[#1f232e] dark:text-[#cbd0dd] border border-[#cbd0dd] dark:border-[#31374a]',
    ghost:
      'bg-transparent hover:bg-[#eff2f6] text-[#525b75] hover:text-[#141824] dark:hover:bg-[#1f232e] dark:text-[#9fa6bc] dark:hover:text-[#eff2f6]',
    danger:
      'bg-rose-500/10 hover:bg-rose-500/15 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-900/40',
    icon:
      'p-1.5 rounded-md text-[#525b75] dark:text-[#9fa6bc] hover:text-[#141824] dark:hover:text-[#eff2f6] hover:bg-[#eff2f6] dark:hover:bg-[#1f232e]',
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
