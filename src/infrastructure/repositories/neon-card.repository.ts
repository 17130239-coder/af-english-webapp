import { sql } from '../database/neon.client';
import { CardMapper, RawDatabaseCardRow } from '../database/card.mapper';
import { ICardRepository } from '@/core/repositories/card.repository.interface';
import { SubtitleCard } from '@/core/entities/card.entity';
import { CreateCardDTO, UpdateCardDTO } from '@/core/dtos/card.dto';
import { DatabaseError } from '@/core/errors/domain.error';

export class NeonCardRepository implements ICardRepository {
  async getAll(limit = 500): Promise<SubtitleCard[]> {
    try {
      const rows = (await sql`
        SELECT * FROM subtitles
        ORDER BY timestamp DESC NULLS LAST
        LIMIT ${limit};
      `) as RawDatabaseCardRow[];

      return rows.map((r) => CardMapper.toDomain(r));
    } catch (error) {
      throw new DatabaseError('Không thể lấy danh sách thẻ từ cơ sở dữ liệu Neon.', error);
    }
  }

  async getById(id: string): Promise<SubtitleCard | null> {
    try {
      const rows = (await sql`
        SELECT * FROM subtitles
        WHERE id = ${id}
        LIMIT 1;
      `) as RawDatabaseCardRow[];

      if (!rows || rows.length === 0) return null;
      return CardMapper.toDomain(rows[0]);
    } catch (error) {
      throw new DatabaseError(`Không thể lấy thẻ ${id} từ cơ sở dữ liệu.`, error);
    }
  }

  async create(dto: CreateCardDTO): Promise<SubtitleCard> {
    try {
      const id = `sub_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      const now = Date.now();
      const status = dto.translation ? 'translated' : 'pending';
      const synonymsJson = dto.synonyms ? JSON.stringify(dto.synonyms) : '[]';
      const examplesJson = dto.examples ? JSON.stringify(dto.examples) : '[]';

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
          ${dto.text},
          ${dto.videoTitle || 'Thêm thủ công'},
          ${dto.url || ''},
          ${now},
          ${dto.keyPhrase || null},
          ${dto.phraseTranslation || null},
          ${dto.translation || null},
          ${dto.explanation || null},
          ${synonymsJson},
          ${examplesJson},
          ${Boolean(dto.isFavorite)},
          ${status},
          NOW(),
          NOW()
        )
        RETURNING *;
      `) as RawDatabaseCardRow[];

      return CardMapper.toDomain(rows[0]);
    } catch (error) {
      throw new DatabaseError('Không thể tạo mới thẻ trong cơ sở dữ liệu.', error);
    }
  }

  async update(id: string, dto: UpdateCardDTO): Promise<SubtitleCard | null> {
    try {
      const current = await this.getById(id);
      if (!current) return null;

      const text = dto.text !== undefined ? dto.text : current.text;
      const videoTitle = dto.videoTitle !== undefined ? dto.videoTitle : current.videoTitle;
      const url = dto.url !== undefined ? dto.url : current.url;
      const keyPhrase = dto.keyPhrase !== undefined ? dto.keyPhrase : (current.keyPhrase || null);
      const phraseTranslation = dto.phraseTranslation !== undefined ? dto.phraseTranslation : (current.phraseTranslation || null);
      const translation = dto.translation !== undefined ? dto.translation : (current.translation || null);
      const explanation = dto.explanation !== undefined ? dto.explanation : (current.explanation || null);
      const synonyms = dto.synonyms !== undefined ? JSON.stringify(dto.synonyms) : JSON.stringify(current.synonyms);
      const examples = dto.examples !== undefined ? JSON.stringify(dto.examples) : JSON.stringify(current.examples);
      const isFavorite = dto.isFavorite !== undefined ? dto.isFavorite : current.isFavorite;
      const status = dto.status !== undefined ? dto.status : (translation ? 'translated' : 'pending');

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
      `) as RawDatabaseCardRow[];

      if (!rows || rows.length === 0) return null;
      return CardMapper.toDomain(rows[0]);
    } catch (error) {
      throw new DatabaseError(`Không thể cập nhật thẻ ${id}.`, error);
    }
  }

  async toggleFavorite(id: string, isFavorite: boolean): Promise<SubtitleCard | null> {
    try {
      const rows = (await sql`
        UPDATE subtitles
        SET is_favorite = ${isFavorite}, updated_at = NOW()
        WHERE id = ${id}
        RETURNING *;
      `) as RawDatabaseCardRow[];

      if (!rows || rows.length === 0) return null;
      return CardMapper.toDomain(rows[0]);
    } catch (error) {
      throw new DatabaseError(`Không thể cập nhật trạng thái yêu thích của thẻ ${id}.`, error);
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      await sql`
        DELETE FROM subtitles
        WHERE id = ${id};
      `;
      return true;
    } catch (error) {
      throw new DatabaseError(`Không thể xóa thẻ ${id}.`, error);
    }
  }
}
