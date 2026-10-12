import { describe, it, expect, vi } from 'vitest';
import { GetCardsUseCase } from '@/core/use-cases/get-cards.use-case';
import { GetCardByIdUseCase } from '@/core/use-cases/get-card-by-id.use-case';
import { UpdateCardUseCase } from '@/core/use-cases/update-card.use-case';
import { DeleteCardUseCase } from '@/core/use-cases/delete-card.use-case';
import { ToggleFavoriteUseCase } from '@/core/use-cases/toggle-favorite.use-case';
import { ICardRepository } from '@/core/repositories/card.repository.interface';
import { CardNotFoundError, ValidationError } from '@/core/errors/domain.error';
import { SubtitleCard } from '@/core/entities/card.entity';

describe('Card Core CRUD Use Cases', () => {
  const dummyCard: SubtitleCard = {
    id: 'sub_test_1',
    text: 'Every cloud has a silver lining.',
    videoTitle: 'Idioms in Context',
    url: 'https://youtube.com',
    timestamp: Date.now(),
    synonyms: [],
    examples: [],
    isFavorite: false,
    status: 'pending',
  };

  const createMockRepo = (): ICardRepository => ({
    getAll: vi.fn().mockResolvedValue([dummyCard]),
    getById: vi.fn().mockResolvedValue(dummyCard),
    create: vi.fn(),
    update: vi.fn().mockResolvedValue({ ...dummyCard, translation: 'Trong cái rủi có cái may.' }),
    toggleFavorite: vi.fn().mockResolvedValue({ ...dummyCard, isFavorite: true }),
    delete: vi.fn().mockResolvedValue(true),
  });

  describe('GetCardsUseCase', () => {
    it('should retrieve list of cards with default limit', async () => {
      const repo = createMockRepo();
      const useCase = new GetCardsUseCase(repo);
      const cards = await useCase.execute();

      expect(repo.getAll).toHaveBeenCalledWith(500);
      expect(cards).toHaveLength(1);
    });
  });

  describe('GetCardByIdUseCase', () => {
    it('should return card when found', async () => {
      const repo = createMockRepo();
      const useCase = new GetCardByIdUseCase(repo);
      const card = await useCase.execute('sub_test_1');

      expect(card.id).toBe('sub_test_1');
    });

    it('should throw CardNotFoundError when repository returns null', async () => {
      const repo = createMockRepo();
      (repo.getById as ReturnType<typeof vi.fn>).mockResolvedValue(null);
      const useCase = new GetCardByIdUseCase(repo);

      await expect(useCase.execute('non_existent')).rejects.toThrow(CardNotFoundError);
    });
  });

  describe('UpdateCardUseCase', () => {
    it('should throw ValidationError if id is empty', async () => {
      const repo = createMockRepo();
      const useCase = new UpdateCardUseCase(repo);

      await expect(useCase.execute('', { text: 'New text' })).rejects.toThrow(ValidationError);
    });

    it('should throw ValidationError if text is whitespace only', async () => {
      const repo = createMockRepo();
      const useCase = new UpdateCardUseCase(repo);

      await expect(useCase.execute('sub_test_1', { text: '   ' })).rejects.toThrow(ValidationError);
    });

    it('should throw CardNotFoundError if card does not exist to update', async () => {
      const repo = createMockRepo();
      (repo.update as ReturnType<typeof vi.fn>).mockResolvedValue(null);
      const useCase = new UpdateCardUseCase(repo);

      await expect(useCase.execute('sub_test_1', { text: 'Updated' })).rejects.toThrow(CardNotFoundError);
    });

    it('should update card successfully', async () => {
      const repo = createMockRepo();
      const useCase = new UpdateCardUseCase(repo);
      const updated = await useCase.execute('sub_test_1', { translation: 'Trong cái rủi có cái may.' });

      expect(updated.translation).toBe('Trong cái rủi có cái may.');
      expect(repo.update).toHaveBeenCalledWith('sub_test_1', { translation: 'Trong cái rủi có cái may.' });
    });
  });

  describe('ToggleFavoriteUseCase', () => {
    it('should throw ValidationError if id is invalid', async () => {
      const repo = createMockRepo();
      const useCase = new ToggleFavoriteUseCase(repo);

      await expect(useCase.execute('  ', true)).rejects.toThrow(ValidationError);
    });

    it('should toggle favorite status', async () => {
      const repo = createMockRepo();
      const useCase = new ToggleFavoriteUseCase(repo);
      const result = await useCase.execute('sub_test_1', true);

      expect(result.isFavorite).toBe(true);
      expect(repo.toggleFavorite).toHaveBeenCalledWith('sub_test_1', true);
    });
  });

  describe('DeleteCardUseCase', () => {
    it('should throw ValidationError if id is invalid', async () => {
      const repo = createMockRepo();
      const useCase = new DeleteCardUseCase(repo);

      await expect(useCase.execute('',)).rejects.toThrow(ValidationError);
    });

    it('should delete card successfully', async () => {
      const repo = createMockRepo();
      const useCase = new DeleteCardUseCase(repo);
      const ok = await useCase.execute('sub_test_1');

      expect(ok).toBe(true);
      expect(repo.delete).toHaveBeenCalledWith('sub_test_1');
    });
  });
});
