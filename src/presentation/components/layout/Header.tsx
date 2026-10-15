'use client';

import React, { useRef } from 'react';
import {
  Search,
  X,
  ArrowUpDown,
  Film,
  Plus,
  GraduationCap,
  Sun,
  Moon,
  ChevronDown,
} from 'lucide-react';
import { SortOrder } from '@/core/entities/filter.entity';
import { Button } from '@/presentation/components/ui/Button';
import { cleanTitle } from '@/presentation/utils/formatters';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  sortBy: SortOrder;
  onSortChange: (sort: SortOrder) => void;
  selectedVideo?: string;
  onVideoChange?: (video: string) => void;
  videos?: string[];
  onOpenCommandPalette: () => void;
  onOpenAddModal: () => void;
  onOpenStudyModal: () => void;
  totalCards: number;
  theme?: 'dark' | 'light';
  onToggleTheme?: () => void;
}

export function Header({
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
  selectedVideo = 'all',
  onVideoChange,
  videos = [],
  onOpenCommandPalette,
  onOpenAddModal,
  onOpenStudyModal,
  totalCards,
  theme = 'dark',
  onToggleTheme,
}: HeaderProps) {
  const searchInputRef = useRef<HTMLInputElement>(null);

  return (
    <header className="sticky top-0 z-40 bg-[var(--bg-page)]/90 backdrop-blur-md border-b border-[var(--border-subtle)] font-sans transition-colors duration-150">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-3">
        {/* Brand */}
        <div className="flex items-center gap-2.5 shrink-0 select-none">
          <div className="w-7 h-7 rounded-lg bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 flex items-center justify-center font-bold text-xs tracking-tight shadow-xs shrink-0">
            AF
          </div>
          <span className="text-sm font-bold text-[var(--text-main)] tracking-tight hidden sm:inline">
            AF English
          </span>
        </div>

        {/* Integrated Search & Sort Toolbar (Directly in Header) */}
        <div className="flex-1 max-w-md mx-auto flex items-center gap-1.5">
          {/* Search Bar */}
          <div className="relative flex-1 group">
            <div className="absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--text-faint)]">
              <Search className="w-3.5 h-3.5" />
            </div>
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Tìm từ vựng, bản dịch..."
              aria-label="Tìm kiếm từ vựng"
              className="w-full pl-8 pr-12 py-1.5 text-xs bg-[var(--bg-card)] border border-[var(--border-default)] rounded-lg text-[var(--text-main)] placeholder-[var(--text-faint)] focus:outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] transition-all"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
              {searchQuery ? (
                <button
                  type="button"
                  onClick={() => onSearchChange('')}
                  className="p-0.5 text-[var(--text-faint)] hover:text-[var(--text-main)] cursor-pointer"
                  title="Xoá tìm kiếm"
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

          {/* Compact Sort Selector */}
          <div className="relative shrink-0">
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value as SortOrder)}
              className="appearance-none pl-6 pr-5 py-1.5 text-xs bg-[var(--bg-card)] border border-[var(--border-default)] rounded-lg text-[var(--text-muted)] hover:text-[var(--text-main)] hover:border-[var(--border-hover)] focus:outline-none focus:border-[var(--accent)] cursor-pointer font-medium transition-colors"
              title="Sắp xếp"
            >
              <option value="newest">Mới nhất</option>
              <option value="oldest">Cũ nhất</option>
              <option value="alphabetical">A → Z</option>
            </select>
            <ArrowUpDown className="w-3 h-3 text-[var(--text-faint)] pointer-events-none absolute left-2 top-1/2 -translate-y-1/2" />
            <ChevronDown className="w-2.5 h-2.5 text-[var(--text-faint)] pointer-events-none absolute right-1.5 top-1/2 -translate-y-1/2" />
          </div>

          {/* Video Filter (Only if videos exist) */}
          {videos && videos.length > 0 && onVideoChange && (
            <div className="relative shrink-0 hidden lg:block">
              <select
                value={selectedVideo}
                onChange={(e) => onVideoChange(e.target.value)}
                className="appearance-none pl-6 pr-5 py-1.5 text-xs bg-[var(--bg-card)] border border-[var(--border-default)] rounded-lg text-[var(--text-muted)] hover:text-[var(--text-main)] hover:border-[var(--border-hover)] focus:outline-none focus:border-[var(--accent)] cursor-pointer font-medium max-w-[130px] truncate transition-colors"
                title="Lọc theo video nguồn"
              >
                <option value="all">Tất cả video</option>
                {videos.map((v) => (
                  <option key={v} value={v}>
                    {cleanTitle(v)}
                  </option>
                ))}
              </select>
              <Film className="w-3 h-3 text-[var(--text-faint)] pointer-events-none absolute left-2 top-1/2 -translate-y-1/2" />
              <ChevronDown className="w-2.5 h-2.5 text-[var(--text-faint)] pointer-events-none absolute right-1.5 top-1/2 -translate-y-1/2" />
            </div>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 shrink-0">
          {totalCards > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={onOpenStudyModal}
              title="Luyện Flashcard"
              className="gap-1.5 h-8 text-xs px-2.5"
            >
              <GraduationCap className="w-3.5 h-3.5 text-[var(--accent)]" />
              <span className="hidden sm:inline">Flashcard</span>
            </Button>
          )}

          <Button
            variant="primary"
            size="sm"
            onClick={onOpenAddModal}
            title="Thêm câu mới"
            className="gap-1 h-8 text-xs px-2.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Thêm câu</span>
          </Button>

          {onToggleTheme && (
            <button
              type="button"
              onClick={onToggleTheme}
              className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-muted)] border border-transparent hover:border-[var(--border-default)] transition-colors cursor-pointer"
              title={theme === 'dark' ? 'Giao diện sáng' : 'Giao diện tối'}
            >
              {theme === 'dark' ? (
                <Sun className="w-3.5 h-3.5 text-amber-400" />
              ) : (
                <Moon className="w-3.5 h-3.5 text-zinc-600" />
              )}
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
