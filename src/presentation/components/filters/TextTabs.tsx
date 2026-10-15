'use client';

import React from 'react';
import { LayoutGrid, List } from 'lucide-react';
import { FilterStatus, LayoutMode } from '@/core/entities/filter.entity';
import { CardStats } from '@/core/entities/card.entity';

interface TextTabsProps {
  currentStatus: FilterStatus;
  onSelectStatus: (status: FilterStatus) => void;
  stats: CardStats;
  layoutMode: LayoutMode;
  onLayoutChange: (mode: LayoutMode) => void;
}

export function TextTabs({
  currentStatus,
  onSelectStatus,
  stats,
  layoutMode,
  onLayoutChange,
}: TextTabsProps) {
  const tabs: Array<{ id: FilterStatus; label: string; count: number }> = [
    { id: 'all', label: 'Tất cả', count: stats.total },
    { id: 'favorites', label: 'Yêu thích', count: stats.favorites },
    { id: 'translated', label: 'Đã dịch', count: stats.translated },
    { id: 'pending', label: 'Chờ dịch', count: stats.pending },
  ];

  return (
    <div className="flex items-center justify-between border-b border-[var(--border-subtle)] mb-4 select-none">
      {/* Minimalist Text Tabs with Underline */}
      <div className="flex items-center gap-6 overflow-x-auto scrollbar-none">
        {tabs.map((tab) => {
          const isActive = currentStatus === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onSelectStatus(tab.id)}
              className={`py-2.5 text-xs sm:text-sm font-medium transition-colors cursor-pointer shrink-0 flex items-center gap-1.5 border-b-2 -mb-px ${
                isActive
                  ? 'border-[var(--accent)] text-[var(--text-main)] font-semibold'
                  : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-main)]'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`text-[11px] tabular-nums font-mono ${
                  isActive ? 'text-[var(--accent)] font-semibold' : 'text-[var(--text-faint)]'
                }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* View Switcher: List vs Grid */}
      <div className="flex items-center gap-1 shrink-0 pb-1.5">
        <button
          type="button"
          onClick={() => onLayoutChange('tape')}
          className={`p-1.5 rounded-md cursor-pointer transition-colors ${
            layoutMode === 'tape' || layoutMode === 'compact'
              ? 'bg-[var(--bg-muted)] text-[var(--text-main)]'
              : 'text-[var(--text-faint)] hover:text-[var(--text-main)]'
          }`}
          title="Xem dạng danh sách (List view)"
        >
          <List className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => onLayoutChange('grid')}
          className={`p-1.5 rounded-md cursor-pointer transition-colors ${
            layoutMode === 'grid'
              ? 'bg-[var(--bg-muted)] text-[var(--text-main)]'
              : 'text-[var(--text-faint)] hover:text-[var(--text-main)]'
          }`}
          title="Xem dạng lưới (Grid view)"
        >
          <LayoutGrid className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
