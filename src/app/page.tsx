import React from 'react';
import { Container } from '@/infrastructure/di/container';
import { ToastProvider } from '@/presentation/components/ui/Toast';
import { MainApp } from '@/presentation/components/MainApp';
import { SubtitleCard, CardStats } from '@/core/entities/card.entity';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  let initialCards: SubtitleCard[] = [];
  let initialStats: CardStats = {
    total: 0,
    translated: 0,
    pending: 0,
    favorites: 0,
    totalVideos: 0,
  };
  let initialVideos: string[] = [];

  try {
    initialCards = await Container.getCardsUseCase.execute(500);
    initialStats = Container.calculateStatsUseCase.execute(initialCards);
    initialVideos = Container.filterCardsUseCase.getDistinctVideos(initialCards);
  } catch (error) {
    console.error('[SSR] Failed to fetch initial cards on server:', error);
  }

  return (
    <ToastProvider>
      <MainApp
        initialCards={initialCards}
        initialStats={initialStats}
        initialVideos={initialVideos}
      />
    </ToastProvider>
  );
}
