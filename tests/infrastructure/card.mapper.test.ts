import { describe, it, expect } from 'vitest';
import { CardMapper, RawDatabaseCardRow } from '@/infrastructure/database/card.mapper';

describe('CardMapper', () => {
  it('should map RawDatabaseCardRow with stringified JSON fields to Domain SubtitleCard', () => {
    const rawRow: RawDatabaseCardRow = {
      id: 'sub_123',
      text: 'Learning curve is steep.',
      video_title: 'Tech Talk',
      url: 'https://youtube.com/watch?v=abc&t=45s',
      timestamp: '1700000000000',
      key_phrase: 'learning curve',
      phrase_translation: 'đường cong học tập',
      translation: 'Đường cong học tập khá dốc.',
      explanation: 'Dùng để chỉ việc phải học rất nhiều điều mới.',
      synonyms: '["challenge", "difficulty"]',
      examples: JSON.stringify([
        { context: 'Công việc', sentence: 'The learning curve was steep.', translation: 'Giai đoạn đầu học rất vất vả.' },
      ]),
      is_favorite: true,
      status: 'translated',
    };

    const domain = CardMapper.toDomain(rawRow);

    expect(domain.id).toBe('sub_123');
    expect(domain.text).toBe('Learning curve is steep.');
    expect(domain.videoTitle).toBe('Tech Talk');
    expect(domain.timestamp).toBe(1700000000000);
    expect(domain.keyPhrase).toBe('learning curve');
    expect(domain.phraseTranslation).toBe('đường cong học tập');
    expect(domain.translation).toBe('Đường cong học tập khá dốc.');
    expect(domain.isFavorite).toBe(true);
    expect(domain.synonyms).toEqual(['challenge', 'difficulty']);
    expect(domain.examples).toHaveLength(1);
    expect(domain.examples[0].context).toBe('Công việc');
  });

  it('should handle comma-separated string synonyms gracefully', () => {
    const rawRow: RawDatabaseCardRow = {
      id: 'sub_456',
      text: 'Piece of cake.',
      synonyms: 'easy, simple, breezy',
    };

    const domain = CardMapper.toDomain(rawRow);
    expect(domain.synonyms).toEqual(['easy', 'simple', 'breezy']);
  });

  it('should handle empty or null values gracefully with safe defaults', () => {
    const rawRow: RawDatabaseCardRow = {
      id: 'sub_789',
      text: 'Hello world',
    };

    const domain = CardMapper.toDomain(rawRow);
    expect(domain.videoTitle).toBe('YouTube Video');
    expect(domain.isFavorite).toBe(false);
    expect(domain.synonyms).toEqual([]);
    expect(domain.examples).toEqual([]);
    expect(domain.status).toBe('pending');
  });
});
