import { ICardRepository } from '../repositories/card.repository.interface';
import { SubtitleCard } from '../entities/card.entity';
import { CardNotFoundError } from '../errors/domain.error';

export class GetCardByIdUseCase {
  constructor(private readonly repository: ICardRepository) {}

  async execute(id: string): Promise<SubtitleCard> {
    const card = await this.repository.getById(id);
    if (!card) {
      throw new CardNotFoundError(id);
    }
    return card;
  }
}
