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
}

export function useCards(): UseCardsReturn {
  const [cards, setCards] = useState<SubtitleCard[]>([]);
  const [stats, setStats] = useState<CardStats | null>(null);
  const [videos, setVideos] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
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
        if (!ignore) setIsLoading(false);
      }
    }

    init();
    return () => {
      ignore = true;
    };
  }, []);

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
    const previous = [...cards];
    setCards((prev) => prev.filter((c) => c.id !== id));

    try {
      const res = await fetch(`/api/cards/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        throw new Error('Không thể xóa thẻ');
      }
    } catch (err) {
      setCards(previous);
      throw err;
    }
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
  };
}
