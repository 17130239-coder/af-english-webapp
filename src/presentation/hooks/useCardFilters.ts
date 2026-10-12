'use client';

import { useState, useMemo } from 'react';
import { SubtitleCard, CardStats } from '@/core/entities/card.entity';
import { CardFilterState, DEFAULT_FILTER_STATE } from '@/core/entities/filter.entity';
import { FilterCardsUseCase } from '@/core/use-cases/filter-cards.use-case';
import { CalculateStatsUseCase } from '@/core/use-cases/calculate-stats.use-case';

const filterUseCase = new FilterCardsUseCase();
const statsUseCase = new CalculateStatsUseCase();

export function useCardFilters(cards: SubtitleCard[]) {
  const [filters, setFilters] = useState<CardFilterState>(DEFAULT_FILTER_STATE);

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
    setFilters((prev) => ({ ...prev, ...changes }));
  };

  const resetFilters = () => {
    setFilters(DEFAULT_FILTER_STATE);
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
