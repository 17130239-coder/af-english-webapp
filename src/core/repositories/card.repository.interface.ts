import { SubtitleCard } from '../entities/card.entity';
import { CreateCardDTO, UpdateCardDTO } from '../dtos/card.dto';

/**
 * Port: Card Repository Interface
 */
export interface ICardRepository {
  getAll(limit?: number): Promise<SubtitleCard[]>;
  getById(id: string): Promise<SubtitleCard | null>;
  create(dto: CreateCardDTO): Promise<SubtitleCard>;
  update(id: string, dto: UpdateCardDTO): Promise<SubtitleCard | null>;
  toggleFavorite(id: string, isFavorite: boolean): Promise<SubtitleCard | null>;
  delete(id: string): Promise<boolean>;
}
