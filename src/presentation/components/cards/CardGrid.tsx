'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { SubtitleCard } from '@/types/card';
import { LayoutMode } from '@/types/filter';
import { CardItem } from './CardItem';
import { SearchX, RotateCcw, ArrowDown } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface CardGridProps {
  cards: SubtitleCard[];
  onToggleFavorite: (id: string, isFav: boolean) => void;
  onEdit: (card: SubtitleCard) => void;
  onDelete: (id: string) => void;
  onResetFilters?: () => void;
  isFiltered?: boolean;
  layoutMode?: LayoutMode;
}

const PAGE_CHUNK = 15;

export function CardGrid({
  cards,
  onToggleFavorite,
  onEdit,
  onDelete,
  onResetFilters,
  isFiltered = false,
  layoutMode = 'grid',
}: CardGridProps) {
  const [visibleCount, setVisibleCount] = useState(PAGE_CHUNK);
  const [prevTrackCount, setPrevTrackCount] = useState(cards.length);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  if (prevTrackCount !== cards.length) {
    setPrevTrackCount(cards.length);
    setVisibleCount(PAGE_CHUNK);
  }

  const loadMore = useCallback(() => {
    setVisibleCount((prev) => Math.min(prev + PAGE_CHUNK, cards.length));
  }, [cards.length]);

  const loadAll = useCallback(() => {
    setVisibleCount(cards.length);
  }, [cards.length]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || visibleCount >= cards.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          loadMore();
        }
      },
      { rootMargin: '300px' }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [visibleCount, cards.length, loadMore]);

  if (cards.length === 0) {
    return (
      <div className="notebook-card p-10 sm:p-14 text-center my-6 select-none border-dashed">
        <div className="w-10 h-10 mx-auto bg-[var(--bg-muted)] text-[var(--text-muted)] rounded-full flex items-center justify-center mb-3">
          <SearchX className="w-5 h-5" />
        </div>

        <h3 className="text-base font-semibold text-[var(--text-main)] mb-1">
          {isFiltered ? 'Không tìm thấy câu phù hợp' : 'Chưa có dữ liệu từ vựng'}
        </h3>

        <p className="text-xs sm:text-sm text-[var(--text-muted)] max-w-sm mx-auto mb-4 leading-relaxed">
          {isFiltered
            ? 'Hãy thử thay đổi từ khoá tìm kiếm hoặc đặt lại các bộ lọc đang chọn.'
            : 'Các câu lưu từ tiện ích AF Extension trên YouTube sẽ xuất hiện tại đây.'}
        </p>

        {isFiltered && onResetFilters && (
          <Button variant="outline" size="sm" onClick={onResetFilters} className="gap-1.5">
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Đặt lại bộ lọc</span>
          </Button>
        )}
      </div>
    );
  }

  const visibleCards = cards.slice(0, visibleCount);
  const hasMore = visibleCards.length < cards.length;

  return (
    <div className="space-y-5">
      <div
        className={
          layoutMode === 'grid'
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4'
            : layoutMode === 'tape'
            ? 'flex flex-col space-y-3 max-w-3xl mx-auto'
            : 'flex flex-col space-y-2'
        }
      >
        {visibleCards.map((card) => (
          <CardItem
            key={card.id}
            card={card}
            onToggleFavorite={onToggleFavorite}
            onEdit={onEdit}
            onDelete={onDelete}
            layoutMode={layoutMode}
          />
        ))}
      </div>

      <div ref={sentinelRef} className="h-4" />

      {cards.length > PAGE_CHUNK && (
        <div className="notebook-card px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-sans select-none">
          <span className="text-[var(--text-muted)]">
            Hiển thị <strong className="text-[var(--text-main)] tabular-nums">{visibleCards.length}</strong> / <strong className="text-[var(--text-main)] tabular-nums">{cards.length}</strong> câu
          </span>

          <div className="flex items-center gap-2">
            {hasMore ? (
              <>
                <Button variant="outline" size="sm" onClick={loadMore} className="gap-1.5">
                  <ArrowDown className="w-3.5 h-3.5 text-[var(--accent)]" />
                  <span>Tải thêm</span>
                </Button>
                <Button variant="ghost" size="sm" onClick={loadAll}>
                  Xem tất cả
                </Button>
              </>
            ) : (
              <span className="text-zinc-500 text-xs">
                Đã hiển thị toàn bộ {cards.length} câu
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
