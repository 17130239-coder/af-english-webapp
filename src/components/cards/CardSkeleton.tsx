import React from 'react';

export function CardSkeleton() {
  return (
    <div className="notebook-card p-5 space-y-3 animate-pulse">
      <div className="flex items-center justify-between pb-2 border-b border-[var(--border-subtle)]">
        <div className="h-3 bg-[var(--border-default)] rounded w-1/3" />
        <div className="h-3 bg-[var(--border-default)] rounded w-8" />
      </div>

      <div className="space-y-1.5 pt-1">
        <div className="h-4 bg-[var(--border-default)] rounded w-4/5" />
        <div className="h-4 bg-[var(--border-default)] rounded w-3/5" />
      </div>

      <div className="h-3 bg-[var(--border-default)] rounded w-1/2 pt-1" />

      <div className="pt-2 border-t border-[var(--border-subtle)] flex items-center justify-between">
        <div className="h-6 bg-[var(--border-default)] rounded-md w-16" />
        <div className="h-4 bg-[var(--border-default)] rounded w-4" />
      </div>
    </div>
  );
}

export function CardGridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}
