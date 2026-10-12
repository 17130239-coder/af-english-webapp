'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { SubtitleCard, CardStats, CreateCardDTO, UpdateCardDTO } from '@/types/card';
import { CardFilterState } from '@/types/filter';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { StatsSummary } from '@/components/stats/StatsSummary';
import { FilterBar } from '@/components/filters/FilterBar';
import { CardGrid } from '@/components/cards/CardGrid';
import { CardGridSkeleton } from '@/components/cards/CardSkeleton';
import { AddCardModal } from '@/components/cards/AddCardModal';
import { CardDetailModal } from '@/components/cards/CardDetailModal';
import { FlashcardModal } from '@/components/study/FlashcardModal';
import { ToastProvider, useToast } from '@/components/ui/Toast';
import { cardService } from '@/lib/services/card-service';

function MainApp() {
  const { showToast } = useToast();
  const [cards, setCards] = useState<SubtitleCard[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filter & Search State
  const [filters, setFilters] = useState<CardFilterState>({
    searchQuery: '',
    status: 'all',
    selectedVideo: 'all',
    sortBy: 'newest',
  });

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isStudyModalOpen, setIsStudyModalOpen] = useState(false);
  const [editingCard, setEditingCard] = useState<SubtitleCard | null>(null);

  // Load cards on component mount
  useEffect(() => {
    let ignore = false;

    async function load() {
      try {
        const res = await fetch('/api/cards');
        const json = await res.json();
        if (!ignore && json.success && json.data) {
          setCards(json.data.cards);
        }
      } catch (err) {
        if (!ignore) {
          console.error(err);
          showToast('Không thể kết nối đến máy chủ', 'error');
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    }

    load();

    return () => {
      ignore = true;
    };
  }, [showToast]);

  // Derived filtered cards & stats
  const filteredCards = useMemo(() => {
    return cardService.filterCards(cards, filters);
  }, [cards, filters]);

  const stats: CardStats = useMemo(() => {
    return cardService.calculateStats(cards);
  }, [cards]);

  const distinctVideos = useMemo(() => {
    return cardService.getDistinctVideos(cards);
  }, [cards]);

  // Filter updates
  const handleFilterChange = (updated: Partial<CardFilterState>) => {
    setFilters((prev) => ({ ...prev, ...updated }));
  };

  const handleResetFilters = () => {
    setFilters({
      searchQuery: '',
      status: 'all',
      selectedVideo: 'all',
      sortBy: 'newest',
    });
  };

  // Toggle Favorite
  const handleToggleFavorite = async (id: string, isFav: boolean) => {
    setCards((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isFavorite: isFav } : c))
    );

    try {
      const res = await fetch(`/api/cards/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isFavorite: isFav }),
      });

      if (!res.ok) throw new Error('Không thể cập nhật yêu thích');
      showToast(isFav ? 'Đã thêm vào yêu thích ⭐' : 'Đã bỏ yêu thích', 'info');
    } catch {
      setCards((prev) =>
        prev.map((c) => (c.id === id ? { ...c, isFavorite: !isFav } : c))
      );
      showToast('Lỗi khi cập nhật yêu thích', 'error');
    }
  };

  // Create Card
  const handleCreateCard = async (dto: CreateCardDTO) => {
    const res = await fetch('/api/cards', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dto),
    });

    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.error || 'Lỗi khi tạo thẻ');
    }

    setCards((prev) => [json.data, ...prev]);
  };

  // Update Card
  const handleUpdateCard = async (id: string, dto: UpdateCardDTO) => {
    const res = await fetch(`/api/cards/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dto),
    });

    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.error || 'Lỗi khi cập nhật thẻ');
    }

    setCards((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...json.data } : c))
    );
  };

  // Delete Card
  const handleDeleteCard = async (id: string) => {
    const previous = [...cards];
    setCards((prev) => prev.filter((c) => c.id !== id));

    try {
      const res = await fetch(`/api/cards/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Không thể xóa thẻ');
      showToast('Đã xóa thẻ', 'info');
    } catch {
      setCards(previous);
      showToast('Lỗi khi xóa thẻ', 'error');
    }
  };

  // Export data
  const handleExport = () => {
    if (cards.length === 0) {
      showToast('Chưa có thẻ nào để xuất', 'info');
      return;
    }

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(cards, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `af-english-cards-${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast(`Đã xuất ${cards.length} thẻ thành công!`, 'success');
  };

  const isFiltered =
    Boolean(filters.searchQuery.trim()) ||
    filters.status !== 'all' ||
    filters.selectedVideo !== 'all';

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/60 dark:bg-slate-950 text-slate-900 dark:text-slate-100 antialiased">
      <Header
        onOpenAddModal={() => setIsAddModalOpen(true)}
        onOpenStudyModal={() => setIsStudyModalOpen(true)}
        onExport={handleExport}
        totalCards={cards.length}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Statistics overview */}
        <StatsSummary stats={stats} isLoading={isLoading} />

        {/* Filter & Search Bar */}
        <FilterBar
          filters={filters}
          onChange={handleFilterChange}
          stats={stats}
          videos={distinctVideos}
        />

        {/* Card Grid / List */}
        {isLoading ? (
          <CardGridSkeleton />
        ) : (
          <CardGrid
            cards={filteredCards}
            onToggleFavorite={handleToggleFavorite}
            onEdit={(card) => setEditingCard(card)}
            onDelete={handleDeleteCard}
            onResetFilters={handleResetFilters}
            isFiltered={isFiltered}
          />
        )}
      </main>

      <Footer />

      {/* Modals */}
      <AddCardModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleCreateCard}
      />

      {editingCard && (
        <CardDetailModal
          key={editingCard.id}
          isOpen={true}
          onClose={() => setEditingCard(null)}
          card={editingCard}
          onUpdate={handleUpdateCard}
        />
      )}

      {isStudyModalOpen && (
        <FlashcardModal
          key="study-modal"
          isOpen={true}
          onClose={() => setIsStudyModalOpen(false)}
          cards={filteredCards.length > 0 ? filteredCards : cards}
          onToggleFavorite={handleToggleFavorite}
        />
      )}
    </div>
  );
}

export default function HomePage() {
  return (
    <ToastProvider>
      <MainApp />
    </ToastProvider>
  );
}
