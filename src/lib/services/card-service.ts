import { Container } from '@/infrastructure/di/container';
import { SubtitleCard, CardStats } from '@/core/entities/card.entity';
import { CreateCardDTO, UpdateCardDTO } from '@/core/dtos/card.dto';
import { CardFilterState } from '@/core/entities/filter.entity';

/**
 * CardService facade delegating to Clean Architecture Use Cases
 */
export class CardService {
  async getAllCards(limit?: number): Promise<SubtitleCard[]> {
    return Container.getCardsUseCase.execute(limit);
  }

  async getCardById(id: string): Promise<SubtitleCard | null> {
    try {
      return await Container.getCardByIdUseCase.execute(id);
    } catch {
      return null;
    }
  }

  async createCard(dto: CreateCardDTO): Promise<SubtitleCard> {
    return Container.createCardUseCase.execute(dto);
  }

  async updateCard(id: string, dto: UpdateCardDTO): Promise<SubtitleCard | null> {
    try {
      return await Container.updateCardUseCase.execute(id, dto);
    } catch {
      return null;
    }
  }

  async toggleFavorite(id: string, isFavorite: boolean): Promise<SubtitleCard | null> {
    try {
      return await Container.toggleFavoriteUseCase.execute(id, isFavorite);
    } catch {
      return null;
    }
  }

  async deleteCard(id: string): Promise<boolean> {
    try {
      return await Container.deleteCardUseCase.execute(id);
    } catch {
      return false;
    }
  }

  calculateStats(cards: SubtitleCard[]): CardStats {
    return Container.calculateStatsUseCase.execute(cards);
  }

  getDistinctVideos(cards: SubtitleCard[]): string[] {
    return Container.filterCardsUseCase.getDistinctVideos(cards);
  }

  filterCards(cards: SubtitleCard[], filters: CardFilterState): SubtitleCard[] {
    return Container.filterCardsUseCase.execute(cards, filters);
  }
}

export const cardService = new CardService();
