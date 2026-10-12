import { SubtitleCard, CreateCardDTO, UpdateCardDTO } from '@/types/card';

export interface ICardRepository {
  getAll(limit?: number): Promise<SubtitleCard[]>;
  getById(id: string): Promise<SubtitleCard | null>;
  create(data: CreateCardDTO): Promise<SubtitleCard>;
  update(id: string, data: UpdateCardDTO): Promise<SubtitleCard | null>;
  toggleFavorite(id: string, isFavorite: boolean): Promise<SubtitleCard | null>;
  delete(id: string): Promise<boolean>;
}
