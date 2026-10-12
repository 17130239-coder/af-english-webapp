import React from 'react';
import { CardStats } from '@/types/card';
import { BookMarked, Check, Star, Film } from 'lucide-react';

interface StatsSummaryProps {
  stats: CardStats;
  isLoading?: boolean;
}

export function StatsSummary({ stats, isLoading = false }: StatsSummaryProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 mb-6 animate-pulse">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="p-3 sm:p-3.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)] h-16"
          />
        ))}
      </div>
    );
  }

  const items = [
    {
      label: 'Tổng số câu',
      value: stats.total,
      icon: BookMarked,
    },
    {
      label: 'Đã dịch nghĩa',
      value: stats.translated,
      icon: Check,
    },
    {
      label: 'Yêu thích',
      value: stats.favorites,
      icon: Star,
    },
    {
      label: 'Video nguồn',
      value: stats.totalVideos,
      icon: Film,
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 mb-5">
      {items.map((item, idx) => {
        const Icon = item.icon;
        return (
          <div
            key={idx}
            className="p-3 sm:p-3.5 rounded-xl border border-[var(--border-default)] bg-[var(--bg-card)] flex items-center justify-between transition-colors hover:border-[var(--border-hover)]"
          >
            <div>
              <p className="text-xs text-[var(--text-muted)] font-medium">
                {item.label}
              </p>
              <p className="text-lg sm:text-xl font-bold text-[var(--text-main)] tabular-nums mt-0.5 tracking-tight">
                {item.value}
              </p>
            </div>
            <Icon className="w-4 h-4 text-[var(--text-faint)] shrink-0" />
          </div>
        );
      })}
    </div>
  );
}
