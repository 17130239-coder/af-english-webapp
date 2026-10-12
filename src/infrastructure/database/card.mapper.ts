import { SubtitleCard, CardExample } from '@/core/entities/card.entity';

export interface RawDatabaseCardRow {
  id: string;
  text: string;
  video_title?: string | null;
  url?: string | null;
  timestamp?: string | number | null;
  key_phrase?: string | null;
  phrase_translation?: string | null;
  translation?: string | null;
  explanation?: string | null;
  synonyms?: string | string[] | null;
  examples?: unknown;
  example_sentence?: string | null;
  example_translation?: string | null;
  is_favorite?: boolean | null;
  status?: string | null;
  created_at?: string | Date | null;
  updated_at?: string | Date | null;
}

export class CardMapper {
  static toDomain(row: RawDatabaseCardRow): SubtitleCard {
    let examples: CardExample[] = [];

    if (row.examples) {
      try {
        const parsed = typeof row.examples === 'string' ? JSON.parse(row.examples) : row.examples;
        if (Array.isArray(parsed)) {
          examples = parsed.map((item) => ({
            context: item.context || undefined,
            sentence: String(item.sentence || ''),
            translation: String(item.translation || ''),
          }));
        }
      } catch {
        examples = [];
      }
    }

    if (examples.length === 0 && row.example_sentence) {
      examples = [
        {
          context: 'Ví dụ',
          sentence: String(row.example_sentence),
          translation: String(row.example_translation || ''),
        },
      ];
    }

    let synonyms: string[] = [];
    if (row.synonyms) {
      if (Array.isArray(row.synonyms)) {
        synonyms = row.synonyms;
      } else if (typeof row.synonyms === 'string') {
        const trimmed = row.synonyms.trim();
        if (trimmed.startsWith('[')) {
          try {
            const parsed = JSON.parse(trimmed);
            synonyms = Array.isArray(parsed) ? parsed : [];
          } catch {
            synonyms = trimmed.split(',').map((s) => s.trim()).filter(Boolean);
          }
        } else {
          synonyms = trimmed.split(',').map((s) => s.trim()).filter(Boolean);
        }
      }
    }

    const timestamp = Number(row.timestamp) || (row.created_at ? new Date(row.created_at).getTime() : Date.now());

    return {
      id: String(row.id),
      text: String(row.text || ''),
      videoTitle: String(row.video_title || 'YouTube Video'),
      url: String(row.url || ''),
      timestamp,
      keyPhrase: row.key_phrase ? String(row.key_phrase) : undefined,
      phraseTranslation: row.phrase_translation ? String(row.phrase_translation) : undefined,
      translation: row.translation ? String(row.translation) : undefined,
      explanation: row.explanation ? String(row.explanation) : undefined,
      synonyms,
      examples,
      exampleSentence: row.example_sentence ? String(row.example_sentence) : undefined,
      exampleTranslation: row.example_translation ? String(row.example_translation) : undefined,
      isFavorite: Boolean(row.is_favorite),
      status: (row.status === 'translated' || row.translation) ? 'translated' : 'pending',
      createdAt: row.created_at ? new Date(row.created_at).toISOString() : undefined,
      updatedAt: row.updated_at ? new Date(row.updated_at).toISOString() : undefined,
    };
  }
}
