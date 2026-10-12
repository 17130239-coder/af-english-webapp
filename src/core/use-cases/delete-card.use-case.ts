import { ICardRepository } from '../repositories/card.repository.interface';
import { ValidationError } from '../errors/domain.error';

export class DeleteCardUseCase {
  constructor(private readonly repository: ICardRepository) {}

  async execute(id: string): Promise<boolean> {
    if (!id || !id.trim()) {
      throw new ValidationError('Mã định danh thẻ (id) không hợp lệ.');
    }
    return this.repository.delete(id);
  }
}
