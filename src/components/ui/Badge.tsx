import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'info' | 'purple' | 'neutral' | 'danger';
  className?: string;
  size?: 'sm' | 'md';
}

export function Badge({
  children,
  variant = 'default',
  size = 'sm',
  className = '',
}: BadgeProps) {
  const variantStyles = {
    default:
      'bg-[#fff1eb] text-[#9a3412] border-[#fed7aa] dark:bg-[#2b170e] dark:text-[#fb923c] dark:border-[#6c3216]',
    success:
      'bg-[#d9fbd0] text-[#1c6c09] border-[#90d67f] dark:bg-[#1d2527] dark:text-[#90d67f] dark:border-[#354739]',
    warning:
      'bg-[#ffefca] text-[#bc3803] border-[#ffcc85] dark:bg-[#262527] dark:text-[#ffcc85] dark:border-[#51453a]',
    danger:
      'bg-[#ffe0db] text-[#b81800] border-[#f48270] dark:bg-[#241f25] dark:text-[#f48270] dark:border-[#4c3233]',
    info:
      'bg-[#c7ebff] text-[#005585] border-[#60c6ff] dark:bg-[#1a2431] dark:text-[#60c6ff] dark:border-[#29435a]',
    purple:
      'bg-[#f2e7fe] text-[#581c87] border-[#d8b4fe] dark:bg-[#271d3b] dark:text-[#c084fc] dark:border-[#4c1d95]',
    neutral:
      'bg-[#eff2f6] text-[#525b75] border-[#cbd0dd] dark:bg-[#222834] dark:text-[#cbd0dd] dark:border-[#3d414c]',
  };

  const sizeStyles = {
    sm: 'text-[11px] px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
  };

  return (
    <span
      className={`inline-flex items-center gap-1 font-semibold uppercase tracking-wider border rounded-md transition-colors ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {children}
    </span>
  );
}
