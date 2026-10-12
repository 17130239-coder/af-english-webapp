import React from 'react';
import { CardStats } from '@/types/card';
import { BookOpen, Sparkles, Star, Clock, Video } from 'lucide-react';

interface StatsSummaryProps {
  stats: CardStats;
  isLoading?: boolean;
}

export function StatsSummary({ stats, isLoading = false }: StatsSummaryProps) {
  const items = [
    {
      label: 'Tổng số câu',
      value: stats.total,
      icon: BookOpen,
      color: 'text-slate-700 dark:text-slate-200',
      bgColor: 'bg-slate-100 dark:bg-slate-800',
    },
    {
      label: 'Đã dịch AI',
      value: stats.translated,
      icon: Sparkles,
      color: 'text-emerald-700 dark:text-emerald-300',
      bgColor: 'bg-emerald-50 dark:bg-emerald-950/40',
    },
    {
      label: 'Chưa dịch',
      value: stats.pending,
      icon: Clock,
      color: 'text-amber-700 dark:text-amber-300',
      bgColor: 'bg-amber-50 dark:bg-amber-950/40',
    },
    {
      label: 'Yêu thích',
      value: stats.favorites,
      icon: Star,
      color: 'text-yellow-600 dark:text-yellow-400',
      bgColor: 'bg-yellow-50 dark:bg-yellow-950/40',
    },
    {
      label: 'Video nguồn',
      value: stats.totalVideos,
      icon: Video,
      color: 'text-red-600 dark:text-red-400',
      bgColor: 'bg-red-50 dark:bg-red-950/40',
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 sm:gap-3.5 mb-6">
      {items.map((item, idx) => {
        const Icon = item.icon;
        return (
          <div
            key={idx}
            className="flex items-center gap-3 p-3 sm:p-3.5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl transition-all hover:border-slate-300 dark:hover:border-slate-700 shadow-2xs"
          >
            <div className={`p-2 rounded-lg shrink-0 ${item.bgColor}`}>
              <Icon className={`w-4 h-4 ${item.color}`} />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 truncate">
                {item.label}
              </p>
              {isLoading ? (
                <div className="h-5 w-10 bg-slate-200 dark:bg-slate-800 rounded animate-pulse mt-0.5" />
              ) : (
                <p className="text-base font-semibold text-slate-900 dark:text-slate-100 tracking-tight">
                  {item.value}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
