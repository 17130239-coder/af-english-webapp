'use client';

import { useState, useEffect, useCallback } from 'react';
import { SubtitleCard, CardStats } from '@/core/entities/card.entity';
import { CreateCardDTO, UpdateCardDTO } from '@/core/dtos/card.dto';

interface UseCardsReturn {
  cards: SubtitleCard[];
  stats: CardStats | null;
  videos: string[];
  isLoading: boolean;
  error: string | null;
  reload: () => Promise<void>;
  createCard: (dto: CreateCardDTO) => Promise<SubtitleCard>;
  updateCard: (id: string, dto: UpdateCardDTO) => Promise<void>;
  toggleFavorite: (id: string, isFav: boolean) => Promise<void>;
  deleteCard: (id: string) => Promise<void>;
  exportCards: () => boolean;
}

interface UseCardsOptions {
  initialCards?: SubtitleCard[];
  initialStats?: CardStats | null;
  initialVideos?: string[];
}

export function useCards(options?: UseCardsOptions): UseCardsReturn {
  const [cards, setCards] = useState<SubtitleCard[]>(options?.initialCards || []);
  const [stats, setStats] = useState<CardStats | null>(options?.initialStats || null);
  const [videos, setVideos] = useState<string[]>(options?.initialVideos || []);
  const [isLoading, setIsLoading] = useState(!options?.initialCards);
  const [error, setError] = useState<string | null>(null);

  const fetchCards = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await fetch('/api/cards');
      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Lỗi khi tải danh sách thẻ từ vựng');
      }

      setCards(json.data.cards);
      setStats(json.data.stats);
      setVideos(json.data.videos);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Lỗi kết nối máy chủ';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // If cards were already supplied via SSR, do not fetch again on mount
    if (options?.initialCards && options.initialCards.length > 0) {
      return;
    }

    let ignore = false;
    async function init() {
      try {
        setIsLoading(true);
        const res = await fetch('/api/cards');
        const json = await res.json();
        if (!ignore && json.success && json.data) {
          setCards(json.data.cards);
          setStats(json.data.stats);
          setVideos(json.data.videos);
        }
      } catch (err) {
        if (!ignore) {
          setError(err instanceof Error ? err.message : 'Lỗi kết nối máy chủ');
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    }

    init();
    return () => {
      ignore = true;
    };
  }, [options?.initialCards]);

  const createCard = useCallback(async (dto: CreateCardDTO): Promise<SubtitleCard> => {
    const res = await fetch('/api/cards', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dto),
    });

    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.error || 'Lỗi khi tạo thẻ mới');
    }

    const created: SubtitleCard = json.data;
    setCards((prev) => [created, ...prev]);
    return created;
  }, []);

  const updateCard = useCallback(async (id: string, dto: UpdateCardDTO): Promise<void> => {
    const res = await fetch(`/api/cards/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dto),
    });

    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.error || 'Lỗi khi cập nhật thẻ');
    }

    const updated: SubtitleCard = json.data;
    setCards((prev) => prev.map((c) => (c.id === id ? updated : c)));
  }, []);

  const toggleFavorite = useCallback(async (id: string, isFav: boolean): Promise<void> => {
    // Optimistic UI update
    setCards((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isFavorite: isFav } : c))
    );

    try {
      const res = await fetch(`/api/cards/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isFavorite: isFav }),
      });

      if (!res.ok) {
        throw new Error('Không thể cập nhật trạng thái yêu thích');
      }
    } catch (err) {
      // Rollback on failure
      setCards((prev) =>
        prev.map((c) => (c.id === id ? { ...c, isFavorite: !isFav } : c))
      );
      throw err;
    }
  }, []);

  const deleteCard = useCallback(async (id: string): Promise<void> => {
    let removedCard: SubtitleCard | undefined;
    setCards((prev) => {
      removedCard = prev.find((c) => c.id === id);
      return prev.filter((c) => c.id !== id);
    });

    try {
      const res = await fetch(`/api/cards/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        throw new Error('Không thể xóa thẻ');
      }
    } catch (err) {
      if (removedCard) {
        setCards((prev) => [removedCard!, ...prev]);
      }
      throw err;
    }
  }, []);

  const exportCards = useCallback((): boolean => {
    if (cards.length === 0) return false;
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(cards, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `af-english-${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    return true;
  }, [cards]);

  return {
    cards,
    stats,
    videos,
    isLoading,
    error,
    reload: fetchCards,
    createCard,
    updateCard,
    toggleFavorite,
    deleteCard,
    exportCards,
  };
}
