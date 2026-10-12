import { ICardRepository } from '../repositories/card.repository.interface';
import { SubtitleCard } from '../entities/card.entity';

export class GetCardsUseCase {
  constructor(private readonly repository: ICardRepository) {}

  async execute(limit: number = 500): Promise<SubtitleCard[]> {
    return this.repository.getAll(limit);
  }
}
