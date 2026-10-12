'use client';

import React from 'react';
import { Search, X, LayoutGrid, Rows3, StretchHorizontal, ChevronDown } from 'lucide-react';
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
    { id: 'all', label: 'Tất cả câu', count: stats.total },
    { id: 'favorites', label: '★ Yêu thích', count: stats.favorites },
    { id: 'translated', label: 'Đã dịch nghĩa', count: stats.translated },
    { id: 'pending', label: 'Chờ dịch', count: stats.pending },
  ];

  const layoutOptions: Array<{ id: LayoutMode; label: string; icon: typeof LayoutGrid }> = [
    { id: 'grid', label: 'Lưới', icon: LayoutGrid },
    { id: 'tape', label: 'Danh sách', icon: Rows3 },
    { id: 'compact', label: 'Thu gọn', icon: StretchHorizontal },
  ];

  return (
    <div className="space-y-4 mb-6 font-sans select-none">
      {/* Top Filter Controls: Search + Video Select + Sort */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search Input (Pill rounded Phoenix style) */}
        <div className="relative flex-1">
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-[#6e7891] dark:text-[#8a94ad]">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={filters.searchQuery}
            onChange={(e) => onChange({ searchQuery: e.target.value })}
            aria-label="Tìm kiếm"
            className="w-full pl-10 pr-20 py-2.5 text-xs sm:text-sm bg-white dark:bg-[#141824] border border-[#cbd0dd] dark:border-[#272f3d] rounded-full text-[#141824] dark:text-[#eff2f6] focus:outline-none focus:border-[#ea580c] focus:ring-2 focus:ring-[#ea580c]/20 transition-all shadow-2xs"
          />
          {filters.searchQuery ? (
            <button
              type="button"
              onClick={() => onChange({ searchQuery: '' })}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[#6e7891] hover:text-[#141824] dark:hover:text-white rounded-full cursor-pointer"
              title="Xoá tìm kiếm"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          ) : (
            <kbd className="hidden sm:inline-block absolute right-3.5 top-1/2 -translate-y-1/2 px-2 py-0.5 text-[10px] font-mono text-[#6e7891] dark:text-[#8a94ad] bg-[#eff2f6] dark:bg-[#1f232e] border border-[#cbd0dd] dark:border-[#272f3d] rounded">
              ⌘K
            </kbd>
          )}
        </div>

        {/* Video Reel Filter & Sort Selectors */}
        <div className="flex items-center gap-2.5">
          {videos.length > 0 && (
            <div className="relative flex-1 sm:w-56">
              <select
                value={filters.selectedVideo}
                onChange={(e) => onChange({ selectedVideo: e.target.value })}
                className="w-full appearance-none pl-3 pr-8 py-2.5 text-xs bg-white dark:bg-[#141824] border border-[#cbd0dd] dark:border-[#272f3d] rounded-lg text-[#31374a] dark:text-[#eff2f6] focus:outline-none focus:border-[#ea580c] focus:ring-2 focus:ring-[#ea580c]/20 cursor-pointer truncate shadow-2xs font-medium"
              >
                <option value="all">Tất cả video ({videos.length})</option>
                {videos.map((vid) => (
                  <option key={vid} value={vid}>
                    {vid}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-[#6e7891] pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2" />
            </div>
          )}

          <div className="relative w-40 shrink-0">
            <select
              value={filters.sortBy}
              onChange={(e) => onChange({ sortBy: e.target.value as SortOrder })}
              className="w-full appearance-none pl-3 pr-8 py-2.5 text-xs bg-white dark:bg-[#141824] border border-[#cbd0dd] dark:border-[#272f3d] rounded-lg text-[#31374a] dark:text-[#eff2f6] focus:outline-none focus:border-[#ea580c] focus:ring-2 focus:ring-[#ea580c]/20 cursor-pointer shadow-2xs font-medium"
            >
              <option value="newest">Mới nhất trước</option>
              <option value="oldest">Cũ nhất trước</option>
              <option value="alphabetical">Bảng chữ cái (A-Z)</option>
            </select>
            <ChevronDown className="w-4 h-4 text-[#6e7891] pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2" />
          </div>
        </div>
      </div>

      {/* Channel Selection Tabs + Layout View Switches */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
        {/* Category Tabs (Phoenix Segmented Tabs) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {tabs.map((tab) => {
            const isActive = filters.status === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onChange({ status: tab.id })}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer shrink-0 flex items-center gap-2 ${
                  isActive
                    ? 'bg-[#ea580c] text-white shadow-xs'
                    : 'bg-white dark:bg-[#141824] hover:bg-[#eff2f6] dark:hover:bg-[#1f232e] text-[#525b75] dark:text-[#9fa6bc] border border-[#e3e6ed] dark:border-[#272f3d]'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full tabular-nums font-bold ${
                    isActive
                      ? 'bg-white/25 text-white'
                      : 'bg-[#eff2f6] dark:bg-[#1f232e] text-[#6e7891] dark:text-[#8a94ad]'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Layout Mode Segmented Control */}
        <div className="flex items-center p-1 bg-white dark:bg-[#141824] border border-[#e3e6ed] dark:border-[#272f3d] rounded-lg self-end sm:self-auto shrink-0 shadow-2xs">
          {layoutOptions.map((opt) => {
            const Icon = opt.icon;
            const isSelected = filters.layoutMode === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => onChange({ layoutMode: opt.id })}
                className={`px-2.5 py-1 text-xs font-medium rounded-md flex items-center gap-1.5 transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-[#eff2f6] dark:bg-[#1f232e] text-[#141824] dark:text-[#eff2f6] font-semibold shadow-2xs'
                    : 'text-[#6e7891] dark:text-[#8a94ad] hover:text-[#141824] dark:hover:text-white'
                }`}
                title={`Hiển thị dạng ${opt.label}`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span className="hidden xs:inline">{opt.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
