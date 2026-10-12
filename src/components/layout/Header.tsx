'use client';

import React from 'react';
import { Plus, BookOpen, Download, Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/Button';

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
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-[#1c1d23]/95 backdrop-blur-md border-b border-[#e5e7ee] dark:border-[#2a2c35] font-sans transition-colors duration-150">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Brand & Identity */}
        <div className="flex items-center gap-3 sm:gap-4 min-w-0">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#fb923c] to-[#f97316] text-white flex items-center justify-center font-bold text-base shadow-xs shrink-0">
            <BookOpen className="w-5 h-5 stroke-[2.2]" />
          </div>

          <div className="flex items-center gap-2 min-w-0">
            <h1 className="text-base sm:text-lg font-bold text-[#1b1e28] dark:text-[#f4f5f8] leading-tight truncate">
              AF English
            </h1>
            <span
              title="Phiên bản Pro"
              className="badge-phoenix badge-phoenix-primary text-[10px] hidden xs:inline-flex cursor-help"
            >
              PRO
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 shrink-0">
          {onToggleTheme && (
            <button
              type="button"
              onClick={onToggleTheme}
              className="p-2 rounded-lg text-[#4b5266] hover:text-[#1b1e28] dark:text-[#9da3b4] dark:hover:text-[#f4f5f8] hover:bg-[#f1f3f7] dark:hover:bg-[#252730] border border-[#e5e7ee] dark:border-[#2a2c35] transition-colors cursor-pointer"
              title={theme === 'dark' ? 'Chuyển sang giao diện sáng' : 'Chuyển sang giao diện tối'}
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-[#f97316]" />
              )}
            </button>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={onExport}
            title="Xuất dữ liệu JSON"
            className="hidden sm:inline-flex"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Xuất JSON</span>
          </Button>

          {totalCards > 0 && (
            <Button
              variant="secondary"
              size="sm"
              onClick={onOpenStudyModal}
              title="Luyện tập Flashcard"
            >
              <BookOpen className="w-3.5 h-3.5 text-[#f97316]" />
              <span>Học Flashcard</span>
            </Button>
          )}

          <Button
            variant="primary"
            size="sm"
            onClick={onOpenAddModal}
            title="Thêm từ vựng mới"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">Thêm câu mới</span>
            <span className="xs:hidden">Thêm</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
