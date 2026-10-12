'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { SubtitleCard } from '@/types/card';
import { LayoutMode } from '@/types/filter';
import { CardItem } from './CardItem';
import { SearchX, RotateCcw, ArrowDown, CheckCheck } from 'lucide-react';
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

const PAGE_CHUNK = 12;

export function CardGrid({
  cards,
  onToggleFavorite,
  onEdit,
  onDelete,
  onResetFilters,
  isFiltered = false,
  layoutMode = 'grid',
}: CardGridProps) {
  // Lazy Loading progressive stream state
  const [visibleCount, setVisibleCount] = useState(PAGE_CHUNK);
  const [prevTrackCount, setPrevTrackCount] = useState(cards.length);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  // Adjust pagination synchronously during render when card list changes
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

  // IntersectionObserver for auto lazy loading when scrolling
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || visibleCount >= cards.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          loadMore();
        }
      },
      { rootMargin: '250px' }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [visibleCount, cards.length, loadMore]);

  if (cards.length === 0) {
    return (
      <div className="phoenix-card p-10 sm:p-14 text-center my-6 select-none border-dashed">
        <div className="w-12 h-12 mx-auto bg-[#eff2f6] dark:bg-[#1f232e] text-[#ea580c] rounded-full flex items-center justify-center mb-3">
          <SearchX className="w-6 h-6 stroke-[2]" />
        </div>

        <h3 className="text-base font-bold text-[#141824] dark:text-[#eff2f6] mb-1">
          {isFiltered
            ? 'Không tìm thấy câu phù hợp'
            : 'Chưa có dữ liệu từ vựng'}
        </h3>

        <p className="text-sm text-[#6e7891] dark:text-[#8a94ad] max-w-md mx-auto mb-5 leading-relaxed">
          {isFiltered
            ? 'Bộ lọc hiện tại không có kết quả nào. Hãy thử thay đổi từ khoá tìm kiếm hoặc đặt lại bộ lọc.'
            : 'Hệ thống chưa có thẻ từ vựng nào. Bạn có thể thêm câu mới thủ công hoặc trích xuất từ AF Extension.'}
        </p>

        {isFiltered && onResetFilters && (
          <Button
            variant="secondary"
            size="sm"
            onClick={onResetFilters}
          >
            <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
            <span>Đặt lại bộ lọc</span>
          </Button>
        )}
      </div>
    );
  }

  const visibleCards = cards.slice(0, visibleCount);
  const streamPercent = Math.round((visibleCards.length / cards.length) * 100);
  const hasMore = visibleCards.length < cards.length;

  return (
    <div className="space-y-6">
      {/* Cards stream container depending on layout mode */}
      <div
        className={
          layoutMode === 'grid'
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5'
            : layoutMode === 'tape'
            ? 'flex flex-col space-y-4 max-w-4xl mx-auto'
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

      {/* Lazy Load Sentinel Trigger */}
      <div ref={sentinelRef} className="h-2" />

      {/* Lazy Loading Progress & Actions Bar */}
      {cards.length > PAGE_CHUNK && (
        <div className="phoenix-card px-5 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-sans select-none">
          <div className="flex items-center gap-3">
            <span className="text-[#6e7891] dark:text-[#8a94ad]">
              Đang hiển thị <strong className="text-[#141824] dark:text-[#eff2f6] tabular-nums">{visibleCards.length}</strong> / <strong className="text-[#141824] dark:text-[#eff2f6] tabular-nums">{cards.length}</strong> câu
            </span>
            <div className="w-24 h-1.5 bg-[#eff2f6] dark:bg-[#1f232e] rounded-full overflow-hidden hidden xs:block">
              <div
                className="h-full bg-[#ea580c] transition-all duration-200 rounded-full"
                style={{ width: `${streamPercent}%` }}
              />
            </div>
            <span className="text-[#ea580c] font-bold tabular-nums">
              ({streamPercent}%)
            </span>
          </div>

          <div className="flex items-center gap-2">
            {hasMore ? (
              <>
                <button
                  type="button"
                  onClick={loadMore}
                  className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-white dark:bg-[#141824] hover:bg-[#eff2f6] dark:hover:bg-[#1f232e] text-[#31374a] dark:text-[#eff2f6] border border-[#cbd0dd] dark:border-[#272f3d] flex items-center gap-1.5 cursor-pointer shadow-2xs transition-colors"
                >
                  <ArrowDown className="w-3.5 h-3.5 text-[#ea580c]" />
                  <span>Tải thêm (+{Math.min(PAGE_CHUNK, cards.length - visibleCards.length)})</span>
                </button>

                <button
                  type="button"
                  onClick={loadAll}
                  className="px-3 py-1.5 text-xs font-medium rounded-lg text-[#6e7891] hover:text-[#141824] dark:text-[#8a94ad] dark:hover:text-[#eff2f6] hover:bg-[#eff2f6] dark:hover:bg-[#1f232e] cursor-pointer transition-colors"
                >
                  <span>Xem tất cả</span>
                </button>
              </>
            ) : (
              <span className="text-[#25b003] font-semibold flex items-center gap-1 text-xs">
                <CheckCheck className="w-4 h-4" />
                <span>Đã hiển thị toàn bộ {cards.length} câu</span>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
