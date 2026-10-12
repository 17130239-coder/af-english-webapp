import { describe, it, expect } from 'vitest';
import {
  parseYouTubeTimestamp,
  formatVideoTime,
  splitByPhrase,
  cleanTitle,
} from '@/presentation/utils/formatters';

describe('Presentation Formatters', () => {
  describe('parseYouTubeTimestamp', () => {
    it('should parse seconds from ?t=728s', () => {
      expect(parseYouTubeTimestamp('https://www.youtube.com/watch?v=abc&t=728s')).toBe(728);
    });

    it('should parse seconds from plain number ?t=728', () => {
      expect(parseYouTubeTimestamp('https://www.youtube.com/watch?v=abc&t=728')).toBe(728);
    });

    it('should parse compound format ?t=1h2m3s', () => {
      expect(parseYouTubeTimestamp('https://www.youtube.com/watch?v=abc&t=1h2m3s')).toBe(3723);
    });

    it('should return null when URL has no timestamp', () => {
      expect(parseYouTubeTimestamp('https://www.youtube.com/watch?v=abc')).toBeNull();
      expect(parseYouTubeTimestamp(undefined)).toBeNull();
      expect(parseYouTubeTimestamp('')).toBeNull();
    });
  });

  describe('formatVideoTime', () => {
    it('should format seconds into M:SS when less than an hour', () => {
      expect(formatVideoTime(125)).toBe('2:05');
      expect(formatVideoTime(728)).toBe('12:08');
    });

    it('should format seconds into HH:MM:SS when an hour or more', () => {
      expect(formatVideoTime(3665)).toBe('1:01:05');
    });
  });

  describe('splitByPhrase', () => {
    it('should split text and tag matching phrase', () => {
      const result = splitByPhrase('Right now the goal is to go get some coffee', 'go get');
      expect(result).toHaveLength(3);
      expect(result[0]).toEqual({ text: 'Right now the goal is to ', match: false });
      expect(result[1]).toEqual({ text: 'go get', match: true });
      expect(result[2]).toEqual({ text: ' some coffee', match: false });
    });

    it('should return whole text when phrase is not present or empty', () => {
      const result = splitByPhrase('Hello world', undefined);
      expect(result).toEqual([{ text: 'Hello world', match: false }]);
    });
  });

  describe('cleanTitle', () => {
    it('should strip excessive trailing badges or emojis for cleaner editorial display', () => {
      expect(cleanTitle('Living rent free in a Tesla: Monterey, Ca 📍')).toBe('Living rent free in a Tesla: Monterey, Ca');
      expect(cleanTitle('TED Talk: The secret to success')).toBe('TED Talk: The secret to success');
    });
  });
});
