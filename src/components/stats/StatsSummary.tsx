import React from 'react';
import { CardStats } from '@/types/card';
import { BookOpen, CheckCircle, Star, Video } from 'lucide-react';

interface StatsSummaryProps {
  stats: CardStats;
  isLoading?: boolean;
}

export function StatsSummary({ stats, isLoading = false }: StatsSummaryProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 animate-pulse">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="phoenix-card p-4 sm:p-5 flex flex-col justify-between h-24"
          >
            <div className="h-4 bg-[#f1f3f7] dark:bg-[#252730] w-1/2 rounded" />
            <div className="h-7 bg-[#f1f3f7] dark:bg-[#252730] w-1/3 rounded mt-2" />
          </div>
        ))}
      </div>
    );
  }

  const syncRate =
    stats.total > 0 ? Math.round((stats.translated / stats.total) * 100) : 0;

  const items = [
    {
      title: 'Tổng số câu',
      value: stats.total,
      badge: 'Bộ nhớ từ',
      badgeClass: 'badge-phoenix-primary',
      icon: BookOpen,
      iconColor: 'text-[#f97316]',
    },
    {
      title: 'Đã dịch nghĩa',
      value: stats.translated,
      badge: `${syncRate}% hoàn thành`,
      badgeClass: 'badge-phoenix-success',
      icon: CheckCircle,
      iconColor: 'text-emerald-500',
    },
    {
      title: 'Đã đánh dấu sao',
      value: stats.favorites,
      badge: 'Yêu thích',
      badgeClass: 'badge-phoenix-warning',
      icon: Star,
      iconColor: 'text-amber-500',
    },
    {
      title: 'Video YouTube',
      value: stats.totalVideos,
      badge: 'Nguồn học',
      badgeClass: 'badge-phoenix-secondary',
      icon: Video,
      iconColor: 'text-[#4b5266] dark:text-[#9da3b4]',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
      {items.map((item, idx) => {
        const Icon = item.icon;
        return (
          <div
            key={idx}
            className="phoenix-card p-4 sm:p-5 flex flex-col justify-between"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-semibold text-[#6b7285] dark:text-[#7d8498] truncate">
                {item.title}
              </span>
              <Icon className={`w-4 h-4 ${item.iconColor} shrink-0`} />
            </div>

            <div className="mt-3 flex items-baseline justify-between gap-2">
              <span className="text-2xl sm:text-3xl font-extrabold text-[#1b1e28] dark:text-[#f4f5f8] tabular-nums tracking-tight">
                {item.value}
              </span>
              <span className={`badge-phoenix ${item.badgeClass} text-[10px]`}>
                {item.badge}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
