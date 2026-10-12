/**
 * Core Domain Entity: SubtitleCard & related value objects
 */

export interface CardExample {
  readonly context?: string;
  readonly sentence: string;
  readonly translation: string;
}

export type CardStatus = 'pending' | 'translated';

export interface SubtitleCard {
  readonly id: string;
  readonly text: string;
  readonly videoTitle: string;
  readonly url: string;
  readonly timestamp: number;
  readonly keyPhrase?: string;
  readonly phraseTranslation?: string;
  readonly translation?: string;
  readonly explanation?: string;
  readonly synonyms: readonly string[];
  readonly examples: readonly CardExample[];
  readonly exampleSentence?: string;
  readonly exampleTranslation?: string;
  readonly isFavorite: boolean;
  readonly status: CardStatus;
  readonly createdAt?: string;
  readonly updatedAt?: string;
}

export interface CardStats {
  readonly total: number;
  readonly translated: number;
  readonly pending: number;
  readonly favorites: number;
  readonly totalVideos: number;
}
