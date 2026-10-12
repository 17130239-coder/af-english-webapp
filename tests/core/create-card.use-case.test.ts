import { describe, it, expect, vi } from 'vitest';
import { CreateCardUseCase } from '@/core/use-cases/create-card.use-case';
import { ICardRepository } from '@/core/repositories/card.repository.interface';
import { ValidationError } from '@/core/errors/domain.error';
import { SubtitleCard } from '@/core/entities/card.entity';

describe('CreateCardUseCase', () => {
  it('should throw ValidationError if text is empty', async () => {
    const mockRepo: ICardRepository = {
      getAll: vi.fn(),
      getById: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      toggleFavorite: vi.fn(),
      delete: vi.fn(),
    };

    const useCase = new CreateCardUseCase(mockRepo);

    await expect(useCase.execute({ text: '   ' })).rejects.toThrow(ValidationError);
    expect(mockRepo.create).not.toHaveBeenCalled();
  });

  it('should sanitize input and call repository.create', async () => {
    const createdCard: SubtitleCard = {
      id: 'sub_test',
      text: 'Practice makes perfect.',
      videoTitle: 'English Idioms',
      url: 'https://youtube.com',
      timestamp: Date.now(),
      synonyms: [],
      examples: [],
      isFavorite: false,
      status: 'pending',
    };

    const mockRepo: ICardRepository = {
      getAll: vi.fn(),
      getById: vi.fn(),
      create: vi.fn().mockResolvedValue(createdCard),
      update: vi.fn(),
      toggleFavorite: vi.fn(),
      delete: vi.fn(),
    };

    const useCase = new CreateCardUseCase(mockRepo);

    const result = await useCase.execute({
      text: '  Practice makes perfect.  ',
      videoTitle: '  English Idioms  ',
    });

    expect(mockRepo.create).toHaveBeenCalledWith(
      expect.objectContaining({
        text: 'Practice makes perfect.',
        videoTitle: 'English Idioms',
      })
    );
    expect(result).toBe(createdCard);
  });
});
