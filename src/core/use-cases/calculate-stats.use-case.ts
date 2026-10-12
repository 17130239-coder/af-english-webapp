import { SubtitleCard, CardStats } from '../entities/card.entity';

export class CalculateStatsUseCase {
  execute(cards: readonly SubtitleCard[]): CardStats {
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
}
