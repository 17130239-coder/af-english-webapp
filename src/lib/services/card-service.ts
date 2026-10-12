import { ICardRepository } from '@/lib/repositories/card-repository.interface';
import { NeonCardRepository } from '@/lib/repositories/neon-card-repository';
import { SubtitleCard, CardStats, CreateCardDTO, UpdateCardDTO } from '@/types/card';
import { CardFilterState } from '@/types/filter';

export class CardService {
  private repository: ICardRepository;

  constructor(repository?: ICardRepository) {
    this.repository = repository || new NeonCardRepository();
  }

  async getAllCards(limit?: number): Promise<SubtitleCard[]> {
    return this.repository.getAll(limit);
  }

  async getCardById(id: string): Promise<SubtitleCard | null> {
    return this.repository.getById(id);
  }

  async createCard(dto: CreateCardDTO): Promise<SubtitleCard> {
    if (!dto.text || !dto.text.trim()) {
      throw new Error('Văn bản câu tiếng Anh không được để trống');
    }
    return this.repository.create({
      ...dto,
      text: dto.text.trim(),
    });
  }

  async updateCard(id: string, dto: UpdateCardDTO): Promise<SubtitleCard | null> {
    return this.repository.update(id, dto);
  }

  async toggleFavorite(id: string, isFavorite: boolean): Promise<SubtitleCard | null> {
    return this.repository.toggleFavorite(id, isFavorite);
  }

  async deleteCard(id: string): Promise<boolean> {
    return this.repository.delete(id);
  }

  calculateStats(cards: SubtitleCard[]): CardStats {
    let translated = 0;
    let favorites = 0;
    const uniqueVideos = new Set<string>();

    for (const card of cards) {
      if (card.status === 'translated' || Boolean(card.translation)) {
        translated++;
      }
      if (card.isFavorite) {
        favorites++;
      }
      if (card.videoTitle && card.videoTitle.trim() && card.videoTitle !== 'YouTube Video') {
        uniqueVideos.add(card.videoTitle.trim());
      }
    }

    return {
      total: cards.length,
      translated,
      pending: cards.length - translated,
      favorites,
      totalVideos: uniqueVideos.size,
    };
  }

  getDistinctVideos(cards: SubtitleCard[]): string[] {
    const videoSet = new Set<string>();
    for (const card of cards) {
      if (card.videoTitle && card.videoTitle.trim()) {
        videoSet.add(card.videoTitle.trim());
      }
    }
    return Array.from(videoSet).sort();
  }

  filterCards(cards: SubtitleCard[], filters: CardFilterState): SubtitleCard[] {
    const { searchQuery, status, selectedVideo, sortBy } = filters;
    const query = searchQuery.trim().toLowerCase();

    const filtered = cards.filter((card) => {
      // 1. Status Filter
      if (status === 'favorites' && !card.isFavorite) return false;
      if (status === 'translated' && !card.translation) return false;
      if (status === 'pending' && Boolean(card.translation)) return false;

      // 2. Video Filter
      if (selectedVideo && selectedVideo !== 'all' && card.videoTitle !== selectedVideo) {
        return false;
      }

      // 3. Search Query
      if (query) {
        const textMatch = card.text.toLowerCase().includes(query);
        const transMatch = card.translation?.toLowerCase().includes(query);
        const keyPhraseMatch = card.keyPhrase?.toLowerCase().includes(query);
        const phraseTransMatch = card.phraseTranslation?.toLowerCase().includes(query);
        const videoMatch = card.videoTitle.toLowerCase().includes(query);
        const synonymMatch = card.synonyms.some((s) => s.toLowerCase().includes(query));

        if (!textMatch && !transMatch && !keyPhraseMatch && !phraseTransMatch && !videoMatch && !synonymMatch) {
          return false;
        }
      }

      return true;
    });

    // Sort order
    return filtered.sort((a, b) => {
      if (sortBy === 'newest') {
        return (b.timestamp || 0) - (a.timestamp || 0);
      }
      if (sortBy === 'oldest') {
        return (a.timestamp || 0) - (b.timestamp || 0);
      }
      if (sortBy === 'alphabetical') {
        return a.text.localeCompare(b.text);
      }
      return 0;
    });
  }
}

// Singleton service instance
export const cardService = new CardService();
