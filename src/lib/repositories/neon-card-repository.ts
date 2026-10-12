import { sql } from '@/lib/db/neon';
import { SubtitleCard, CardExample, CreateCardDTO, UpdateCardDTO } from '@/types/card';
import { ICardRepository } from './card-repository.interface';

interface NeonDbRow {
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

export class NeonCardRepository implements ICardRepository {
  private mapRow(row: NeonDbRow): SubtitleCard {
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

  async getAll(limit = 500): Promise<SubtitleCard[]> {
    const rows = (await sql`
      SELECT * FROM subtitles
      ORDER BY timestamp DESC
      LIMIT ${limit};
    `) as NeonDbRow[];

    return rows.map((r) => this.mapRow(r));
  }

  async getById(id: string): Promise<SubtitleCard | null> {
    const rows = (await sql`
      SELECT * FROM subtitles
      WHERE id = ${id}
      LIMIT 1;
    `) as NeonDbRow[];

    if (!rows || rows.length === 0) return null;
    return this.mapRow(rows[0]);
  }

  async create(data: CreateCardDTO): Promise<SubtitleCard> {
    const id = `sub_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const now = Date.now();
    const status = data.translation ? 'translated' : 'pending';
    const synonymsJson = data.synonyms ? JSON.stringify(data.synonyms) : '[]';
    const examplesJson = data.examples ? JSON.stringify(data.examples) : '[]';

    const rows = (await sql`
      INSERT INTO subtitles (
        id,
        text,
        video_title,
        url,
        timestamp,
        key_phrase,
        phrase_translation,
        translation,
        explanation,
        synonyms,
        examples,
        is_favorite,
        status,
        created_at,
        updated_at
      ) VALUES (
        ${id},
        ${data.text},
        ${data.videoTitle || 'Thêm thủ công'},
        ${data.url || ''},
        ${now},
        ${data.keyPhrase || null},
        ${data.phraseTranslation || null},
        ${data.translation || null},
        ${data.explanation || null},
        ${synonymsJson},
        ${examplesJson},
        ${Boolean(data.isFavorite)},
        ${status},
        NOW(),
        NOW()
      )
      RETURNING *;
    `) as NeonDbRow[];

    return this.mapRow(rows[0]);
  }

  async update(id: string, data: UpdateCardDTO): Promise<SubtitleCard | null> {
    const current = await this.getById(id);
    if (!current) return null;

    const text = data.text !== undefined ? data.text : current.text;
    const videoTitle = data.videoTitle !== undefined ? data.videoTitle : current.videoTitle;
    const url = data.url !== undefined ? data.url : current.url;
    const keyPhrase = data.keyPhrase !== undefined ? data.keyPhrase : (current.keyPhrase || null);
    const phraseTranslation = data.phraseTranslation !== undefined ? data.phraseTranslation : (current.phraseTranslation || null);
    const translation = data.translation !== undefined ? data.translation : (current.translation || null);
    const explanation = data.explanation !== undefined ? data.explanation : (current.explanation || null);
    const synonyms = data.synonyms !== undefined ? JSON.stringify(data.synonyms) : JSON.stringify(current.synonyms);
    const examples = data.examples !== undefined ? JSON.stringify(data.examples) : JSON.stringify(current.examples);
    const isFavorite = data.isFavorite !== undefined ? data.isFavorite : current.isFavorite;
    const status = data.status !== undefined ? data.status : (translation ? 'translated' : 'pending');

    const rows = (await sql`
      UPDATE subtitles
      SET
        text = ${text},
        video_title = ${videoTitle},
        url = ${url},
        key_phrase = ${keyPhrase},
        phrase_translation = ${phraseTranslation},
        translation = ${translation},
        explanation = ${explanation},
        synonyms = ${synonyms},
        examples = ${examples},
        is_favorite = ${isFavorite},
        status = ${status},
        updated_at = NOW()
      WHERE id = ${id}
      RETURNING *;
    `) as NeonDbRow[];

    if (!rows || rows.length === 0) return null;
    return this.mapRow(rows[0]);
  }

  async toggleFavorite(id: string, isFavorite: boolean): Promise<SubtitleCard | null> {
    const rows = (await sql`
      UPDATE subtitles
      SET is_favorite = ${isFavorite}, updated_at = NOW()
      WHERE id = ${id}
      RETURNING *;
    `) as NeonDbRow[];

    if (!rows || rows.length === 0) return null;
    return this.mapRow(rows[0]);
  }

  async delete(id: string): Promise<boolean> {
    await sql`
      DELETE FROM subtitles
      WHERE id = ${id};
    `;
    return true;
  }
}
