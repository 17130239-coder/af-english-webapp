import { SubtitleCard } from '../entities/card.entity';
import { CardFilterState } from '../entities/filter.entity';

export class FilterCardsUseCase {
  execute(cards: readonly SubtitleCard[], filters: CardFilterState): SubtitleCard[] {
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

    return [...filtered].sort((a, b) => {
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

  getDistinctVideos(cards: readonly SubtitleCard[]): string[] {
    const videoSet = new Set<string>();
    for (const card of cards) {
      if (card.videoTitle && card.videoTitle.trim()) {
        videoSet.add(card.videoTitle.trim());
      }
    }
    return Array.from(videoSet).sort();
  }
}
