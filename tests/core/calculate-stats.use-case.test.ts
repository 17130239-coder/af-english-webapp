import { describe, it, expect } from 'vitest';
import { CalculateStatsUseCase } from '@/core/use-cases/calculate-stats.use-case';
import { SubtitleCard } from '@/core/entities/card.entity';

describe('CalculateStatsUseCase', () => {
  const useCase = new CalculateStatsUseCase();

  const mockCards: SubtitleCard[] = [
    {
      id: 'sub_1',
      text: 'Good morning everyone.',
      videoTitle: 'Vlog in California',
      url: 'https://youtube.com/watch?v=123',
      timestamp: 1000,
      translation: 'Chào buổi sáng mọi người.',
      synonyms: [],
      examples: [],
      isFavorite: true,
      status: 'translated',
    },
    {
      id: 'sub_2',
      text: 'What do you think?',
      videoTitle: 'Vlog in California',
      url: 'https://youtube.com/watch?v=123',
      timestamp: 2000,
      translation: undefined,
      synonyms: [],
      examples: [],
      isFavorite: false,
      status: 'pending',
    },
    {
      id: 'sub_3',
      text: 'Let us go get coffee.',
      videoTitle: 'Exploring New York',
      url: 'https://youtube.com/watch?v=456',
      timestamp: 3000,
      translation: 'Cùng đi uống cà phê nhé.',
      synonyms: [],
      examples: [],
      isFavorite: true,
      status: 'translated',
    },
  ];

  it('should correctly calculate total, translated, pending, favorites and totalVideos', () => {
    const stats = useCase.execute(mockCards);

    expect(stats.total).toBe(3);
    expect(stats.translated).toBe(2);
    expect(stats.pending).toBe(1);
    expect(stats.favorites).toBe(2);
    expect(stats.totalVideos).toBe(2);
  });

  it('should return zeros for empty card list', () => {
    const stats = useCase.execute([]);

    expect(stats.total).toBe(0);
    expect(stats.translated).toBe(0);
    expect(stats.pending).toBe(0);
    expect(stats.favorites).toBe(0);
    expect(stats.totalVideos).toBe(0);
  });
});
