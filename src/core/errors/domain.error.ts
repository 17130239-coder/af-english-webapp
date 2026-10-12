/**
 * Domain & Application Errors
 */

export class DomainError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DomainError';
  }
}

export class ValidationError extends DomainError {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class CardNotFoundError extends DomainError {
  constructor(id: string) {
    super(`Không tìm thấy thẻ từ vựng với mã: ${id}`);
    this.name = 'CardNotFoundError';
  }
}

export class DatabaseError extends DomainError {
  constructor(message: string, public readonly originalError?: unknown) {
    super(message);
    this.name = 'DatabaseError';
  }
}
