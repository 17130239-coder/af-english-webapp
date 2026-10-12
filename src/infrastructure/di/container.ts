import { NeonCardRepository } from '../repositories/neon-card.repository';
import { GetCardsUseCase } from '@/core/use-cases/get-cards.use-case';
import { GetCardByIdUseCase } from '@/core/use-cases/get-card-by-id.use-case';
import { CreateCardUseCase } from '@/core/use-cases/create-card.use-case';
import { UpdateCardUseCase } from '@/core/use-cases/update-card.use-case';
import { DeleteCardUseCase } from '@/core/use-cases/delete-card.use-case';
import { ToggleFavoriteUseCase } from '@/core/use-cases/toggle-favorite.use-case';
import { CalculateStatsUseCase } from '@/core/use-cases/calculate-stats.use-case';
import { FilterCardsUseCase } from '@/core/use-cases/filter-cards.use-case';

/**
 * Dependency Injection (Composition Root)
 */
class Container {
  private static _cardRepository = new NeonCardRepository();

  public static readonly getCardsUseCase = new GetCardsUseCase(this._cardRepository);
  public static readonly getCardByIdUseCase = new GetCardByIdUseCase(this._cardRepository);
  public static readonly createCardUseCase = new CreateCardUseCase(this._cardRepository);
  public static readonly updateCardUseCase = new UpdateCardUseCase(this._cardRepository);
  public static readonly deleteCardUseCase = new DeleteCardUseCase(this._cardRepository);
  public static readonly toggleFavoriteUseCase = new ToggleFavoriteUseCase(this._cardRepository);
  public static readonly calculateStatsUseCase = new CalculateStatsUseCase();
  public static readonly filterCardsUseCase = new FilterCardsUseCase();
}

export { Container };
