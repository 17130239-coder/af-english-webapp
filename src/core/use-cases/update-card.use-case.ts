import { ICardRepository } from '../repositories/card.repository.interface';
import { UpdateCardDTO } from '../dtos/card.dto';
import { SubtitleCard } from '../entities/card.entity';
import { CardNotFoundError, ValidationError } from '../errors/domain.error';

export class UpdateCardUseCase {
  constructor(private readonly repository: ICardRepository) {}

  async execute(id: string, dto: UpdateCardDTO): Promise<SubtitleCard> {
    if (!id || !id.trim()) {
      throw new ValidationError('Mã định danh thẻ (id) không hợp lệ.');
    }

    if (dto.text !== undefined && !dto.text.trim()) {
      throw new ValidationError('Câu tiếng Anh không được để trống.');
    }

    const updated = await this.repository.update(id, dto);
    if (!updated) {
      throw new CardNotFoundError(id);
    }

    return updated;
  }
}
