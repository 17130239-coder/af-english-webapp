import { CardExample, CardStatus } from '../entities/card.entity';

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
