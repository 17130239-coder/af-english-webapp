/**
 * Domain Entities & Value Objects for AF English Cards
 */

export interface CardExample {
  context?: string;
  sentence: string;
  translation: string;
}

export type CardStatus = 'pending' | 'translated';

export interface SubtitleCard {
  id: string;
  text: string;
  videoTitle: string;
  url: string;
  timestamp: number;
  keyPhrase?: string;
  phraseTranslation?: string;
  translation?: string;
  explanation?: string;
  synonyms: string[];
  examples: CardExample[];
  exampleSentence?: string;
  exampleTranslation?: string;
  isFavorite: boolean;
  status: CardStatus;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateCardDTO {
  text: string;
  videoTitle?: string;
  url?: string;
  keyPhrase?: string;
  phraseTranslation?: string;
  translation?: string;
  explanation?: string;
  synonyms?: string[];
  examples?: CardExample[];
  isFavorite?: boolean;
}

export interface UpdateCardDTO {
  text?: string;
  videoTitle?: string;
  url?: string;
  keyPhrase?: string;
  phraseTranslation?: string;
  translation?: string;
  explanation?: string;
  synonyms?: string[];
  examples?: CardExample[];
  isFavorite?: boolean;
  status?: CardStatus;
}

export interface CardStats {
  total: number;
  translated: number;
  pending: number;
  favorites: number;
  totalVideos: number;
}
