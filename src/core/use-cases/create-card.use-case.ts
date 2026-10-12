import { ICardRepository } from '../repositories/card.repository.interface';
import { CreateCardDTO } from '../dtos/card.dto';
import { SubtitleCard } from '../entities/card.entity';
import { ValidationError } from '../errors/domain.error';

export class CreateCardUseCase {
  constructor(private readonly repository: ICardRepository) {}

  async execute(dto: CreateCardDTO): Promise<SubtitleCard> {
    if (!dto.text || !dto.text.trim()) {
      throw new ValidationError('Câu tiếng Anh không được để trống.');
    }

    const sanitized: CreateCardDTO = {
      ...dto,
      text: dto.text.trim(),
      videoTitle: dto.videoTitle?.trim() || 'Thêm thủ công',
      url: dto.url?.trim() || '',
      keyPhrase: dto.keyPhrase?.trim() || undefined,
      phraseTranslation: dto.phraseTranslation?.trim() || undefined,
      translation: dto.translation?.trim() || undefined,
      explanation: dto.explanation?.trim() || undefined,
      synonyms: dto.synonyms?.map((s) => s.trim()).filter(Boolean) || [],
      examples: dto.examples || [],
      isFavorite: Boolean(dto.isFavorite),
    };

    return this.repository.create(sanitized);
  }
}
