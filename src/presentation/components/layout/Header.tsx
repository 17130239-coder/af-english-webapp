'use client';

import React from 'react';
import Image from 'next/image';
import {
  Plus,
  GraduationCap,
  Download,
  Sun,
  Moon,
} from 'lucide-react';
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
    <header className="sticky top-0 z-40 bg-[var(--bg-page)]/95 backdrop-blur-md border-b border-[var(--border-default)] font-sans transition-colors duration-150">
      <div className="max-w-[1400px] w-full mx-auto px-4 sm:px-7 h-14 flex items-center justify-between gap-4">
        {/* Brand: Logo & Title (af-english) matching extension */}
        <div className="flex items-center gap-2.5 shrink-0 select-none">
          <div className="w-7 h-7 rounded-lg overflow-hidden shrink-0 border border-[var(--border-subtle)] bg-[var(--bg-card)] p-0.5 relative flex items-center justify-center">
            <Image
              src="/icons/icon32.png"
              alt="af-english Logo"
              width={22}
              height={22}
              className="w-full h-full object-contain"
              priority
            />
          </div>
          <span className="text-sm font-bold text-[var(--text-main)] tracking-tight">
            af-english
          </span>
        </div>

        {/* Right Navigation Actions matching Extension HyperUI Button Group */}
        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="primary"
            size="sm"
            onClick={onOpenAddModal}
            title="Thêm từ hoặc câu mới"
            className="gap-1.5 h-8 text-xs px-3 shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.2]" />
            <span>Thêm câu</span>
          </Button>

          {totalCards > 0 && (
            <Button
              variant="secondary"
              size="sm"
              onClick={onOpenStudyModal}
              title="Luyện tập Flashcard"
              className="gap-1.5 h-8 text-xs px-2.5 hidden sm:inline-flex"
            >
              <GraduationCap className="w-3.5 h-3.5 text-[var(--accent)]" />
              <span>Flashcard</span>
            </Button>
          )}

          <Button
            variant="secondary"
            size="sm"
            onClick={onExport}
            title="Xuất dữ liệu từ vựng sang file JSON"
            className="gap-1.5 h-8 text-xs px-2.5 hidden md:inline-flex"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Xuất file</span>
          </Button>

          {onToggleTheme && (
            <button
              type="button"
              onClick={onToggleTheme}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-main)] bg-[var(--bg-card)] hover:bg-[var(--bg-muted)] border border-[var(--border-default)] hover:border-[var(--border-hover)] transition-colors cursor-pointer"
              title={theme === 'dark' ? 'Chuyển sang giao diện sáng' : 'Chuyển sang giao diện tối'}
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
