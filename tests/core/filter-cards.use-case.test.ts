import { describe, it, expect } from 'vitest';
import { FilterCardsUseCase } from '@/core/use-cases/filter-cards.use-case';
import { SubtitleCard } from '@/core/entities/card.entity';
import { DEFAULT_FILTER_STATE } from '@/core/entities/filter.entity';

describe('FilterCardsUseCase', () => {
  const useCase = new FilterCardsUseCase();

  const mockCards: SubtitleCard[] = [
    {
      id: 'sub_1',
      text: 'Right now the goal is to grab coffee.',
      videoTitle: 'Vlog in California',
      url: 'https://youtube.com/watch?v=123',
      timestamp: 3000,
      keyPhrase: 'grab coffee',
      phraseTranslation: 'mua cà phê',
      translation: 'Mục tiêu lúc này là mua cà phê.',
      synonyms: ['get coffee', 'buy coffee'],
      examples: [],
      isFavorite: true,
      status: 'translated',
    },
    {
      id: 'sub_2',
      text: 'We are walking the bike across the road.',
      videoTitle: 'Vlog in California',
      url: 'https://youtube.com/watch?v=123',
      timestamp: 2000,
      keyPhrase: 'walk the bike',
      phraseTranslation: 'dắt xe đạp',
      translation: 'Chúng tôi đang dắt xe đạp qua đường.',
      synonyms: ['push the bike'],
      examples: [],
      isFavorite: false,
      status: 'translated',
    },
    {
      id: 'sub_3',
      text: 'Under the weather today.',
      videoTitle: 'Health Tips',
      url: 'https://youtube.com/watch?v=789',
      timestamp: 1000,
      keyPhrase: 'under the weather',
      phraseTranslation: 'cảm thấy không khỏe',
      translation: undefined,
      synonyms: ['sick'],
      examples: [],
      isFavorite: false,
      status: 'pending',
    },
  ];

  it('should return all cards by default filter', () => {
    const result = useCase.execute(mockCards, DEFAULT_FILTER_STATE);
    expect(result.length).toBe(3);
    // Should be sorted by newest timestamp first (3000, 2000, 1000)
    expect(result[0].id).toBe('sub_1');
    expect(result[1].id).toBe('sub_2');
    expect(result[2].id).toBe('sub_3');
  });

  it('should filter by search query matching english text, phrase, or translation', () => {
    const result = useCase.execute(mockCards, {
      ...DEFAULT_FILTER_STATE,
      searchQuery: 'bike',
    });
    expect(result.length).toBe(1);
    expect(result[0].id).toBe('sub_2');

    const resultByVi = useCase.execute(mockCards, {
      ...DEFAULT_FILTER_STATE,
      searchQuery: 'cà phê',
    });
    expect(resultByVi.length).toBe(1);
    expect(resultByVi[0].id).toBe('sub_1');
  });

  it('should filter by favorites only', () => {
    const result = useCase.execute(mockCards, {
      ...DEFAULT_FILTER_STATE,
      status: 'favorites',
    });
    expect(result.length).toBe(1);
    expect(result[0].id).toBe('sub_1');
  });

  it('should filter by pending translation status', () => {
    const result = useCase.execute(mockCards, {
      ...DEFAULT_FILTER_STATE,
      status: 'pending',
    });
    expect(result.length).toBe(1);
    expect(result[0].id).toBe('sub_3');
  });

  it('should filter by specific video title', () => {
    const result = useCase.execute(mockCards, {
      ...DEFAULT_FILTER_STATE,
      selectedVideo: 'Health Tips',
    });
    expect(result.length).toBe(1);
    expect(result[0].id).toBe('sub_3');
  });

  it('should extract distinct video titles correctly', () => {
    const videos = useCase.getDistinctVideos(mockCards);
    expect(videos).toEqual(['Health Tips', 'Vlog in California']);
  });
});
