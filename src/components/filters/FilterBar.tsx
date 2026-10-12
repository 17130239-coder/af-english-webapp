'use client';

import React from 'react';
import { Search, X, LayoutGrid, List, AlignJustify, ChevronDown, Film, ArrowUpDown } from 'lucide-react';
import { CardFilterState, FilterStatus, SortOrder, LayoutMode } from '@/types/filter';
import { CardStats } from '@/types/card';

interface FilterBarProps {
  filters: CardFilterState;
  onChange: (updated: Partial<CardFilterState>) => void;
  stats: CardStats;
  videos: string[];
}

export function FilterBar({ filters, onChange, stats, videos }: FilterBarProps) {
  const tabs: Array<{ id: FilterStatus; label: string; count: number }> = [
    { id: 'all', label: 'Tất cả', count: stats.total },
    { id: 'favorites', label: 'Yêu thích', count: stats.favorites },
    { id: 'translated', label: 'Đã dịch', count: stats.translated },
    { id: 'pending', label: 'Chờ dịch', count: stats.pending },
  ];

  const layoutOptions: Array<{ id: LayoutMode; label: string; icon: typeof LayoutGrid }> = [
    { id: 'grid', label: 'Lưới', icon: LayoutGrid },
    { id: 'tape', label: 'Danh sách', icon: List },
    { id: 'compact', label: 'Bảng gọn', icon: AlignJustify },
  ];

  return (
    <div className="space-y-3 mb-5 font-sans select-none">
      {/* Search Bar + Controls */}
      <div className="flex flex-col sm:flex-row gap-2.5">
        {/* Search Input */}
        <div className="relative flex-1">
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--text-faint)]">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={filters.searchQuery}
            onChange={(e) => onChange({ searchQuery: e.target.value })}
            placeholder="Tìm theo từ tiếng Anh, bản dịch hoặc tên video..."
            aria-label="Tìm kiếm thẻ từ vựng"
            className="w-full pl-9.5 pr-14 py-2 text-xs sm:text-sm bg-[var(--bg-card)] border border-[var(--border-default)] rounded-xl text-[var(--text-main)] placeholder-[var(--text-faint)] focus:outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] transition-all shadow-2xs"
          />
          {filters.searchQuery ? (
            <button
              type="button"
              onClick={() => onChange({ searchQuery: '' })}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[var(--text-muted)] hover:text-[var(--text-main)] rounded-md cursor-pointer"
              title="Xoá tìm kiếm"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          ) : (
            <kbd className="hidden sm:inline-block absolute right-3 top-1/2 -translate-y-1/2 px-1.5 py-0.5 text-[10px] font-mono text-[var(--text-faint)] bg-[var(--bg-muted)] border border-[var(--border-default)] rounded">
              ⌘K
            </kbd>
          )}
        </div>

        {/* Video Filter & Sort */}
        <div className="flex items-center gap-2">
          {videos.length > 0 && (
            <div className="relative flex-1 sm:w-52">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-faint)] pointer-events-none">
                <Film className="w-3.5 h-3.5" />
              </div>
              <select
                value={filters.selectedVideo}
                onChange={(e) => onChange({ selectedVideo: e.target.value })}
                className="w-full appearance-none pl-8 pr-7 py-2 text-xs bg-[var(--bg-card)] border border-[var(--border-default)] rounded-xl text-[var(--text-body)] focus:outline-none focus:border-[var(--accent)] cursor-pointer truncate shadow-2xs font-medium"
              >
                <option value="all">Tất cả video ({videos.length})</option>
                {videos.map((vid) => (
                  <option key={vid} value={vid}>
                    {vid}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-[var(--text-faint)] pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2" />
            </div>
          )}

          <div className="relative w-36 sm:w-40 shrink-0">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-faint)] pointer-events-none">
              <ArrowUpDown className="w-3.5 h-3.5" />
            </div>
            <select
              value={filters.sortBy}
              onChange={(e) => onChange({ sortBy: e.target.value as SortOrder })}
              className="w-full appearance-none pl-8 pr-7 py-2 text-xs bg-[var(--bg-card)] border border-[var(--border-default)] rounded-xl text-[var(--text-body)] focus:outline-none focus:border-[var(--accent)] cursor-pointer shadow-2xs font-medium"
            >
              <option value="newest">Mới nhất</option>
              <option value="oldest">Cũ nhất</option>
              <option value="alphabetical">A → Z</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-[var(--text-faint)] pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2" />
          </div>
        </div>
      </div>

      {/* Tabs Strip & View Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pt-1">
        {/* Category Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pb-0.5 scrollbar-none">
          {tabs.map((tab) => {
            const isActive = filters.status === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onChange({ status: tab.id })}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer shrink-0 flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-2xs'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-muted)]'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full tabular-nums font-semibold ${
                    isActive
                      ? 'bg-white/20 text-white dark:bg-zinc-900/20 dark:text-zinc-900'
                      : 'bg-[var(--bg-muted)] text-[var(--text-muted)]'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* View Switcher Toggle */}
        <div className="flex items-center gap-0.5 p-0.5 rounded-lg border border-[var(--border-default)] bg-[var(--bg-card)] self-end sm:self-auto shrink-0">
          {layoutOptions.map((opt) => {
            const Icon = opt.icon;
            const isCurrent = filters.layoutMode === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => onChange({ layoutMode: opt.id })}
                className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                  isCurrent
                    ? 'bg-[var(--bg-muted)] text-[var(--text-main)] shadow-2xs font-semibold'
                    : 'text-[var(--text-faint)] hover:text-[var(--text-main)]'
                }`}
                title={`Chế độ xem: ${opt.label}`}
              >
                <Icon className="w-3.5 h-3.5" />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
