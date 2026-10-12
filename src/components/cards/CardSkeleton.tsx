import React from 'react';

export function CardSkeleton() {
  return (
    <div className="phoenix-card p-5 flex flex-col justify-between space-y-4 animate-pulse">
      <div className="flex items-center justify-between pb-3 border-b border-[#e3e6ed] dark:border-[#272f3d]">
        <div className="h-4 bg-[#eff2f6] dark:bg-[#1f232e] rounded w-1/3" />
        <div className="h-4 bg-[#eff2f6] dark:bg-[#1f232e] rounded w-14" />
      </div>

      <div className="space-y-2 py-1">
        <div className="h-5 bg-[#eff2f6] dark:bg-[#1f232e] rounded w-5/6" />
        <div className="h-5 bg-[#eff2f6] dark:bg-[#1f232e] rounded w-2/3" />
      </div>

      <div className="h-10 bg-[#f5f7fa] dark:bg-[#10131d] rounded-lg border border-[#e3e6ed] dark:border-[#272f3d]" />

      <div className="p-3 rounded-lg bg-[#f5f7fa] dark:bg-[#10131d] border-l-3 border-[#cbd0dd] dark:border-[#272f3d]">
        <div className="h-3 bg-[#eff2f6] dark:bg-[#1f232e] rounded w-1/4 mb-1.5" />
        <div className="h-4 bg-[#eff2f6] dark:bg-[#1f232e] rounded w-4/5" />
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-[#e3e6ed] dark:border-[#272f3d]">
        <div className="h-3 bg-[#eff2f6] dark:bg-[#1f232e] rounded w-16" />
        <div className="h-4 bg-[#eff2f6] dark:bg-[#1f232e] rounded w-20" />
      </div>
    </div>
  );
}

export function CardGridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
      {Array.from({ length: 6 }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}
