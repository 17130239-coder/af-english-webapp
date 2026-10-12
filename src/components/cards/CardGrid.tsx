'use client';

import React from 'react';
import { SubtitleCard } from '@/types/card';
import { CardItem } from './CardItem';
import { SearchX, Inbox } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface CardGridProps {
  cards: SubtitleCard[];
  onToggleFavorite: (id: string, isFav: boolean) => void;
  onEdit: (card: SubtitleCard) => void;
  onDelete: (id: string) => void;
  onResetFilters?: () => void;
  isFiltered?: boolean;
}

export function CardGrid({
  cards,
  onToggleFavorite,
  onEdit,
  onDelete,
  onResetFilters,
  isFiltered = false,
}: CardGridProps) {
  if (cards.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-2xs">
        <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mb-3.5">
          {isFiltered ? <SearchX className="w-6 h-6" /> : <Inbox className="w-6 h-6" />}
        </div>
        <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 mb-1">
          {isFiltered ? 'Không tìm thấy thẻ phù hợp' : 'Chưa có thẻ từ vựng nào'}
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mb-4">
          {isFiltered
            ? 'Thử thay đổi từ khóa tìm kiếm hoặc bỏ chọn các bộ lọc trạng thái để xem nhiều thẻ hơn.'
            : 'Các câu phụ đề bạn lưu trên YouTube hoặc qua AF Extension sẽ hiển thị tại đây.'}
        </p>
        {isFiltered && onResetFilters && (
          <Button variant="secondary" size="sm" onClick={onResetFilters}>
            Xóa bộ lọc
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
      {cards.map((card) => (
        <CardItem
          key={card.id}
          card={card}
          onToggleFavorite={onToggleFavorite}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
