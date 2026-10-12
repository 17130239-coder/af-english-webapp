'use client';

import React from 'react';
import { Plus, GraduationCap, Download, Sun, Moon } from 'lucide-react';
import { Button } from '@/presentation/components/ui/Button';

interface HeaderProps {
  onOpenAddModal: () => void;
  onOpenStudyModal: () => void;
  onExport: () => void;
  totalCards: number;
  theme?: 'dark' | 'light';
  onToggleTheme?: () => void;
}

export function Header({
  onOpenAddModal,
  onOpenStudyModal,
  onExport,
  totalCards,
  theme = 'dark',
  onToggleTheme,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 bg-[var(--bg-page)]/85 backdrop-blur-md border-b border-[var(--border-default)] font-sans transition-colors duration-150">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-15 flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 flex items-center justify-center font-bold text-xs tracking-tight shadow-xs shrink-0 select-none">
            AF
          </div>

          <div className="flex items-baseline gap-2 min-w-0">
            <span className="text-base font-bold text-[var(--text-main)] tracking-tight truncate">
              AF English
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 shrink-0">
          {totalCards > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={onOpenStudyModal}
              title="Luyện tập ghi nhớ (Phím Space để lật)"
              className="gap-1.5"
            >
              <GraduationCap className="w-4 h-4 text-[var(--accent)]" />
              <span>Luyện Flashcard</span>
            </Button>
          )}

          <Button
            variant="primary"
            size="sm"
            onClick={onOpenAddModal}
            title="Thêm câu mới vào danh sách"
            className="gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Thêm câu</span>
          </Button>

          <Button
            variant="icon"
            onClick={onExport}
            title="Xuất dữ liệu JSON"
            className="hidden md:inline-flex text-[var(--text-muted)] hover:text-[var(--text-main)]"
          >
            <Download className="w-4 h-4" />
          </Button>

          {onToggleTheme && (
            <button
              type="button"
              onClick={onToggleTheme}
              className="p-2 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-muted)] border border-transparent hover:border-[var(--border-default)] transition-colors cursor-pointer"
              title={theme === 'dark' ? 'Giao diện sáng' : 'Giao diện tối'}
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-zinc-600" />
              )}
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
