'use client';

import React from 'react';
import { Search, X, Filter, ArrowUpDown, Star, Sparkles, Clock, Layers } from 'lucide-react';
import { CardFilterState, FilterStatus, SortOrder } from '@/types/filter';
import { CardStats } from '@/types/card';

interface FilterBarProps {
  filters: CardFilterState;
  onChange: (updated: Partial<CardFilterState>) => void;
  stats: CardStats;
  videos: string[];
}

export function FilterBar({ filters, onChange, stats, videos }: FilterBarProps) {
  const tabs: Array<{ id: FilterStatus; label: string; count: number; icon?: React.ElementType }> = [
    { id: 'all', label: 'Tất cả', count: stats.total, icon: Layers },
    { id: 'favorites', label: 'Yêu thích', count: stats.favorites, icon: Star },
    { id: 'translated', label: 'Đã dịch AI', count: stats.translated, icon: Sparkles },
    { id: 'pending', label: 'Chưa dịch', count: stats.pending, icon: Clock },
  ];

  return (
    <div className="space-y-3.5 mb-6">
      {/* Search Bar + Controls */}
      <div className="flex flex-col sm:flex-row gap-2.5">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={filters.searchQuery}
            onChange={(e) => onChange({ searchQuery: e.target.value })}
            placeholder="Tìm kiếm từ tiếng Anh, tiếng Việt, cụm từ, hoặc tên video..."
            className="w-full pl-10 pr-9 py-2.5 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400/30 transition-all shadow-2xs"
          />
          {filters.searchQuery && (
            <button
              type="button"
              onClick={() => onChange({ searchQuery: '' })}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5 rounded transition-colors"
              title="Xóa tìm kiếm"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Video selector and sort controls */}
        <div className="flex items-center gap-2">
          {videos.length > 0 && (
            <div className="relative flex-1 sm:w-56">
              <select
                value={filters.selectedVideo}
                onChange={(e) => onChange({ selectedVideo: e.target.value })}
                className="w-full appearance-none pl-3 pr-8 py-2.5 text-xs sm:text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-400/30 shadow-2xs cursor-pointer truncate"
              >
                <option value="all">Tất cả video ({videos.length})</option>
                {videos.map((vid) => (
                  <option key={vid} value={vid}>
                    {vid}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400">
                <Filter className="w-3.5 h-3.5" />
              </div>
            </div>
          )}

          <div className="relative w-36 sm:w-44">
            <select
              value={filters.sortBy}
              onChange={(e) => onChange({ sortBy: e.target.value as SortOrder })}
              className="w-full appearance-none pl-3 pr-8 py-2.5 text-xs sm:text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-400/30 shadow-2xs cursor-pointer"
            >
              <option value="newest">Mới nhất trước</option>
              <option value="oldest">Cũ nhất trước</option>
              <option value="alphabetical">A → Z</option>
            </select>
            <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400">
              <ArrowUpDown className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {tabs.map((tab) => {
          const isActive = filters.status === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => onChange({ status: tab.id })}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all shrink-0 cursor-pointer ${
                isActive
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950 shadow-xs'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800'
              }`}
            >
              {Icon && <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-current' : 'text-slate-400'}`} />}
              <span>{tab.label}</span>
              <span
                className={`text-[11px] px-1.5 py-0.2 rounded-full ${
                  isActive
                    ? 'bg-white/20 text-white dark:bg-slate-900/20 dark:text-slate-900'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
