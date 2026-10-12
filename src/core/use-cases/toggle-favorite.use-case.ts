import { ICardRepository } from '../repositories/card.repository.interface';
import { SubtitleCard } from '../entities/card.entity';
import { CardNotFoundError, ValidationError } from '../errors/domain.error';

export class ToggleFavoriteUseCase {
  constructor(private readonly repository: ICardRepository) {}

  async execute(id: string, isFavorite: boolean): Promise<SubtitleCard> {
    if (!id || !id.trim()) {
      throw new ValidationError('Mã định danh thẻ (id) không hợp lệ.');
    }

    const updated = await this.repository.toggleFavorite(id, isFavorite);
    if (!updated) {
      throw new CardNotFoundError(id);
    }

    return updated;
  }
}
