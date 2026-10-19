'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { SubtitleCard } from '@/core/entities/card.entity';
import { LayoutMode } from '@/core/entities/filter.entity';
import { CardItem } from './CardItem';
import { SearchX, RotateCcw, ArrowDown } from 'lucide-react';
import { Button } from '@/presentation/components/ui/Button';

interface CardGridProps {
  cards: SubtitleCard[];
  selectedIds?: Set<string>;
  onToggleSelect?: (id: string) => void;
  onToggleFavorite: (id: string, isFav: boolean) => void;
  onEdit: (card: SubtitleCard) => void;
  onDelete: (id: string) => void;
  onResetFilters?: () => void;
  isFiltered?: boolean;
  layoutMode?: LayoutMode;
}

const PAGE_CHUNK = 24;

export function CardGrid({
  cards,
  selectedIds,
  onToggleSelect,
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
      <div className="rounded-xl border border-dashed border-[var(--border-default)] p-10 sm:p-14 text-center my-6 select-none bg-[var(--bg-card)]">
        <div className="w-10 h-10 mx-auto bg-[var(--bg-muted)] text-[var(--text-muted)] rounded-full flex items-center justify-center mb-3">
          <SearchX className="w-5 h-5" />
        </div>

        <h3 className="text-base font-semibold text-[var(--text-main)] mb-1">
          {isFiltered ? 'Không tìm thấy câu phù hợp' : 'Chưa có phụ đề nào được lưu'}
        </h3>

        <p className="text-xs sm:text-sm text-[var(--text-muted)] max-w-sm mx-auto mb-4 leading-relaxed">
          {isFiltered
            ? 'Hãy thử thay đổi từ khoá tìm kiếm hoặc đặt lại các bộ lọc đang chọn.'
            : 'Khi xem video trên YouTube, nhấp vào phụ đề để sao chép và đồng bộ tự động lên đây.'}
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
    <div className="space-y-4">
      <div
        className={
          layoutMode === 'grid'
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4'
            : 'flex flex-col rounded-xl border border-[var(--border-default)] bg-[var(--bg-card)] overflow-hidden divide-y divide-[var(--border-subtle)]'
        }
      >
        {visibleCards.map((card) => (
          <CardItem
            key={card.id}
            card={card}
            isSelected={selectedIds?.has(card.id)}
            onToggleSelect={onToggleSelect}
            onToggleFavorite={onToggleFavorite}
            onEdit={onEdit}
            onDelete={onDelete}
            layoutMode={layoutMode}
          />
        ))}
      </div>

      <div ref={sentinelRef} className="h-4" />

      {cards.length > PAGE_CHUNK && (
        <div className="rounded-xl border border-[var(--border-default)] bg-[var(--bg-card)] px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-sans select-none">
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
              <span className="text-[var(--text-faint)] text-xs">
                Đã hiển thị toàn bộ {cards.length} câu
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
