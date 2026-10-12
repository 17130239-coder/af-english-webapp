'use client';

import { useState, useMemo } from 'react';
import { SubtitleCard, CardStats } from '@/core/entities/card.entity';
import { CardFilterState, DEFAULT_FILTER_STATE } from '@/core/entities/filter.entity';
import { FilterCardsUseCase } from '@/core/use-cases/filter-cards.use-case';
import { CalculateStatsUseCase } from '@/core/use-cases/calculate-stats.use-case';

const filterUseCase = new FilterCardsUseCase();
const statsUseCase = new CalculateStatsUseCase();

export function useCardFilters(cards: SubtitleCard[]) {
  const [filters, setFilters] = useState<CardFilterState>(() => {
    let savedLayout: CardFilterState['layoutMode'] = DEFAULT_FILTER_STATE.layoutMode;
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('af_layout_mode');
        if (stored === 'grid' || stored === 'tape' || stored === 'compact') {
          savedLayout = stored;
        }
      } catch {
        // silent
      }
    }
    return {
      ...DEFAULT_FILTER_STATE,
      layoutMode: savedLayout,
    };
  });

  const filteredCards = useMemo(() => {
    return filterUseCase.execute(cards, filters);
  }, [cards, filters]);

  const stats: CardStats = useMemo(() => {
    return statsUseCase.execute(cards);
  }, [cards]);

  const distinctVideos = useMemo(() => {
    return filterUseCase.getDistinctVideos(cards);
  }, [cards]);

  const updateFilters = (changes: Partial<CardFilterState>) => {
    if (changes.layoutMode && typeof window !== 'undefined') {
      try {
        localStorage.setItem('af_layout_mode', changes.layoutMode);
      } catch {
        // silent
      }
    }
    setFilters((prev) => ({ ...prev, ...changes }));
  };

  const resetFilters = () => {
    setFilters((prev) => ({
      ...DEFAULT_FILTER_STATE,
      layoutMode: prev.layoutMode,
    }));
  };

  const isFiltered =
    Boolean(filters.searchQuery.trim()) ||
    filters.status !== 'all' ||
    filters.selectedVideo !== 'all';

  return {
    filters,
    filteredCards,
    stats,
    distinctVideos,
    updateFilters,
    resetFilters,
    isFiltered,
  };
}
