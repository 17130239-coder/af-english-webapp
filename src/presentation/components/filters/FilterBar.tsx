'use client';

import React, { useRef } from 'react';
import { Search, X, LayoutGrid, List } from 'lucide-react';
import { FilterStatus, SortOrder, LayoutMode } from '@/core/entities/filter.entity';
import { CardStats } from '@/core/entities/card.entity';
import { cleanTitle } from '@/presentation/utils/formatters';

interface FilterBarProps {
  currentStatus: FilterStatus;
  onSelectStatus: (status: FilterStatus) => void;
  stats: CardStats;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  sortBy: SortOrder;
  onSortChange: (sort: SortOrder) => void;
  selectedVideo: string;
  onVideoChange: (video: string) => void;
  videos: string[];
  layoutMode: LayoutMode;
  onLayoutChange: (mode: LayoutMode) => void;
  onOpenCommandPalette: () => void;
}

export function FilterBar({
  currentStatus,
  onSelectStatus,
  stats,
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
  selectedVideo,
  onVideoChange,
  videos,
  layoutMode,
  onLayoutChange,
  onOpenCommandPalette,
}: FilterBarProps) {
  const searchInputRef = useRef<HTMLInputElement>(null);

  const tabs: Array<{ id: FilterStatus; label: string; count: number }> = [
    { id: 'all', label: 'Tất cả', count: stats.total },
    { id: 'pending', label: 'Chưa dịch', count: stats.pending },
    { id: 'translated', label: 'Đã dịch', count: stats.translated },
    { id: 'favorites', label: 'Yêu thích', count: stats.favorites },
  ];

  return (
    <section className="flex flex-wrap items-center justify-between gap-3 mb-5 select-none font-sans">
      {/* Left: Filter Tabs matching Extension */}
      <div className="flex items-center gap-1.5 flex-wrap">
        <div className="inline-flex items-center gap-1 p-0.5 rounded-lg bg-[var(--bg-card)] border border-[var(--border-default)]">
          {tabs.map((tab) => {
            const isActive = currentStatus === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onSelectStatus(tab.id)}
                className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-medium cursor-pointer transition-all duration-150 ${
                  isActive
                    ? 'bg-[var(--bg-elevated)] text-[var(--text-main)] shadow-2xs font-semibold'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-muted)]'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-[11px] font-mono ${
                    isActive ? 'text-[var(--accent)] font-semibold' : 'text-[var(--text-faint)]'
                  }`}
                >
                  ({tab.count})
                </span>
              </button>
            );
          })}
        </div>

        {/* View Mode Toggle */}
        <div className="inline-flex items-center gap-0.5 p-0.5 rounded-lg bg-[var(--bg-card)] border border-[var(--border-default)]">
          <button
            type="button"
            onClick={() => onLayoutChange('grid')}
            className={`p-1.5 rounded-md cursor-pointer transition-colors ${
              layoutMode === 'grid'
                ? 'bg-[var(--bg-elevated)] text-[var(--text-main)] shadow-2xs'
                : 'text-[var(--text-faint)] hover:text-[var(--text-main)]'
            }`}
            title="Dạng lưới 3 cột (Grid View)"
          >
            <LayoutGrid className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onLayoutChange('tape')}
            className={`p-1.5 rounded-md cursor-pointer transition-colors ${
              layoutMode === 'tape' || layoutMode === 'compact'
                ? 'bg-[var(--bg-elevated)] text-[var(--text-main)] shadow-2xs'
                : 'text-[var(--text-faint)] hover:text-[var(--text-main)]'
            }`}
            title="Dạng danh sách (List View)"
          >
            <List className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Right: Search, Video filter & Sort Dropdown */}
      <div className="flex items-center gap-2 flex-1 justify-end min-w-[280px] max-w-full sm:max-w-xl">
        {/* Search input */}
        <div className="relative flex-1 min-w-[180px] max-w-xs">
          <Search className="w-3.5 h-3.5 text-[var(--text-faint)] pointer-events-none absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Tìm kiếm từ tiếng Anh, tiếng Việt, hoặc video..."
            className="w-full h-8 pl-8 pr-12 text-xs bg-[var(--bg-card)] border border-[var(--border-default)] hover:border-[var(--border-hover)] focus:border-[var(--border-highlight)] focus:bg-[var(--bg-card)] rounded-md text-[var(--text-main)] placeholder-[var(--text-muted)] outline-none transition-all"
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
            {searchQuery ? (
              <button
                type="button"
                onClick={() => onSearchChange('')}
                className="p-0.5 text-[var(--text-faint)] hover:text-[var(--text-main)] cursor-pointer"
                title="Xóa tìm kiếm"
              >
                <X className="w-3 h-3" />
              </button>
            ) : (
              <button
                type="button"
                onClick={onOpenCommandPalette}
                className="hidden md:inline-flex px-1.5 py-0.5 text-[10px] font-mono text-[var(--text-faint)] hover:text-[var(--text-main)] bg-[var(--bg-muted)] border border-[var(--border-default)] rounded cursor-pointer"
                title="Mở Command Palette (⌘K)"
              >
                ⌘K
              </button>
            )}
          </div>
        </div>

        {/* Video selector */}
        {videos && videos.length > 0 && (
          <select
            value={selectedVideo}
            onChange={(e) => onVideoChange(e.target.value)}
            className="h-8 px-2.5 text-xs bg-[var(--bg-card)] border border-[var(--border-default)] hover:border-[var(--border-hover)] rounded-md text-[var(--text-muted)] hover:text-[var(--text-main)] outline-none cursor-pointer max-w-[150px] sm:max-w-[180px] truncate transition-colors"
            title="Lọc theo video nguồn"
          >
            <option value="all">Tất cả video nguồn</option>
            {videos.map((vid) => (
              <option key={vid} value={vid}>
                {cleanTitle(vid)}
              </option>
            ))}
          </select>
        )}

        {/* Sort selector */}
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value as SortOrder)}
          className="h-8 px-2.5 text-xs bg-[var(--bg-card)] border border-[var(--border-default)] hover:border-[var(--border-hover)] rounded-md text-[var(--text-muted)] hover:text-[var(--text-main)] outline-none cursor-pointer transition-colors"
          title="Sắp xếp"
        >
          <option value="newest">Mới nhất</option>
          <option value="oldest">Cũ nhất</option>
          <option value="alphabetical">A → Z</option>
        </select>
      </div>
    </section>
  );
}
