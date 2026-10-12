import React from 'react';
import { Plus, GraduationCap, Download, Database } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface HeaderProps {
  onOpenAddModal: () => void;
  onOpenStudyModal: () => void;
  onExport: () => void;
  totalCards: number;
}

export function Header({
  onOpenAddModal,
  onOpenStudyModal,
  onExport,
  totalCards,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 flex items-center justify-center font-bold text-base shadow-xs shrink-0">
            AF
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold tracking-tight text-slate-900 dark:text-white">
                AF English
              </h1>
              <span className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-700 bg-emerald-50 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 rounded">
                <Database className="w-2.5 h-2.5" />
                Neon DB
              </span>
            </div>
            <p className="hidden md:block text-[11px] text-slate-500 dark:text-slate-400">
              Kho thẻ học từ vựng tiếng Anh thông minh qua YouTube Subtitles
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {totalCards > 0 && (
            <Button
              variant="secondary"
              size="sm"
              onClick={onOpenStudyModal}
              title="Luyện tập từ vựng với chế độ Flashcard"
            >
              <GraduationCap className="w-4 h-4 text-indigo-500" />
              <span className="hidden sm:inline">Học Flashcard</span>
            </Button>
          )}

          <Button
            variant="secondary"
            size="sm"
            onClick={onExport}
            title="Xuất danh sách thẻ ra file JSON / CSV"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span className="hidden sm:inline">Xuất file</span>
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={onOpenAddModal}
            title="Thêm từ vựng hoặc câu phụ đề mới"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm câu</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
