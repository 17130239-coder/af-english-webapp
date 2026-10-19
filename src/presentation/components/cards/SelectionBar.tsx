'use client';

import React from 'react';
import { GraduationCap, Trash2, X } from 'lucide-react';
import { Button } from '@/presentation/components/ui/Button';

interface SelectionBarProps {
  selectedCount: number;
  totalVisible: number;
  isAllSelected: boolean;
  onToggleSelectAll: () => void;
  onOpenStudy: () => void;
  onDeleteSelected: () => void;
  onClearSelection: () => void;
}

export function SelectionBar({
  selectedCount,
  totalVisible,
  isAllSelected,
  onToggleSelectAll,
  onOpenStudy,
  onDeleteSelected,
  onClearSelection,
}: SelectionBarProps) {
  if (selectedCount === 0) return null;

  return (
    <div className="sticky top-16 z-30 mb-4 rounded-xl bg-[var(--bg-card)]/95 backdrop-blur-md border border-[var(--border-highlight)] px-4 py-2.5 flex items-center justify-between gap-3 shadow-sm font-sans select-none animate-in fade-in slide-in-from-top-2 duration-150">
      <div className="flex items-center gap-2.5">
        <label className="inline-flex items-center gap-2 cursor-pointer text-xs text-[var(--text-body)]">
          <input
            type="checkbox"
            checked={isAllSelected}
            onChange={onToggleSelectAll}
            className="w-3.5 h-3.5 rounded border border-[var(--border-default)] accent-[var(--accent)] cursor-pointer"
          />
          <span>
            Đã chọn: <strong className="text-[var(--text-main)] font-semibold">{selectedCount}</strong> / {totalVisible} thẻ
          </span>
        </label>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="secondary"
          size="sm"
          onClick={onOpenStudy}
          className="gap-1.5 h-7 text-xs px-2.5"
          title="Luyện tập Flashcard các câu đã chọn"
        >
          <GraduationCap className="w-3.5 h-3.5 text-[var(--accent)]" />
          <span>Học đã chọn ({selectedCount})</span>
        </Button>

        <Button
          variant="danger"
          size="sm"
          onClick={onDeleteSelected}
          className="gap-1.5 h-7 text-xs px-2.5"
          title="Xóa các câu đã chọn"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Xóa đã chọn</span>
        </Button>

        <button
          type="button"
          onClick={onClearSelection}
          className="text-xs text-[var(--text-muted)] hover:text-[var(--text-main)] cursor-pointer ml-1 inline-flex items-center gap-0.5"
          title="Bỏ chọn tất cả"
        >
          <X className="w-3.5 h-3.5" />
          <span>Bỏ chọn</span>
        </button>
      </div>
    </div>
  );
}
