import React from 'react';

export function CardSkeleton() {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-5 space-y-4 shadow-2xs animate-pulse">
      {/* Header skeleton */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/3" />
        <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-12" />
      </div>

      {/* Text skeleton */}
      <div className="space-y-2">
        <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded w-3/4" />
        <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded w-1/2" />
      </div>

      {/* Pill */}
      <div className="h-7 bg-slate-200 dark:bg-slate-800 rounded w-2/5" />

      {/* Translation */}
      <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-5/6" />

      {/* Footer */}
      <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between">
        <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-16" />
        <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-12" />
      </div>
    </div>
  );
}

export function CardGridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}
