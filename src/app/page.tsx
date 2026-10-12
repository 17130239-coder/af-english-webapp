'use client';

import React, { useState, useEffect } from 'react';
import { SubtitleCard } from '@/core/entities/card.entity';
import { CreateCardDTO, UpdateCardDTO } from '@/core/dtos/card.dto';
import { useCards } from '@/presentation/hooks/useCards';
import { useCardFilters } from '@/presentation/hooks/useCardFilters';
import { useTheme } from '@/lib/hooks/useTheme';
import { ToastProvider, useToast } from '@/components/ui/Toast';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { StatsSummary } from '@/components/stats/StatsSummary';
import { FilterBar } from '@/components/filters/FilterBar';
import { CardGrid } from '@/components/cards/CardGrid';
import { CardGridSkeleton } from '@/components/cards/CardSkeleton';
import { AddCardModal } from '@/components/cards/AddCardModal';
import { CardDetailModal } from '@/components/cards/CardDetailModal';
import { FlashcardModal } from '@/components/study/FlashcardModal';

function MainApp() {
  const { showToast } = useToast();
  const { theme, toggleTheme } = useTheme();

  const {
    cards,
    isLoading,
    createCard,
    updateCard,
    toggleFavorite,
    deleteCard,
    exportCards,
  } = useCards();

  const {
    filters,
    filteredCards,
    stats,
    distinctVideos,
    updateFilters,
    resetFilters,
    isFiltered,
  } = useCardFilters(cards);

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isStudyModalOpen, setIsStudyModalOpen] = useState(false);
  const [editingCard, setEditingCard] = useState<SubtitleCard | null>(null);

  // Global search shortcut (⌘K or Ctrl+K)
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        const searchInput = document.querySelector('input[type="text"]') as HTMLInputElement | null;
        searchInput?.focus();
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, []);

  const handleToggleFavorite = async (id: string, isFav: boolean) => {
    try {
      await toggleFavorite(id, isFav);
      showToast(isFav ? 'Đã thêm vào yêu thích' : 'Đã bỏ yêu thích', 'info');
    } catch {
      showToast('Lỗi khi cập nhật trạng thái yêu thích', 'error');
    }
  };

  const handleCreateCard = async (dto: CreateCardDTO) => {
    try {
      await createCard(dto);
      showToast('Đã thêm thẻ mới thành công', 'success');
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Lỗi khi tạo thẻ', 'error');
      throw err;
    }
  };

  const handleUpdateCard = async (id: string, dto: UpdateCardDTO) => {
    try {
      await updateCard(id, dto);
      showToast('Cập nhật thẻ thành công', 'success');
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Lỗi khi cập nhật thẻ', 'error');
      throw err;
    }
  };

  const handleDeleteCard = async (id: string) => {
    try {
      await deleteCard(id);
      showToast('Đã xóa thẻ khỏi hệ thống', 'info');
    } catch {
      showToast('Lỗi khi xóa thẻ', 'error');
    }
  };

  const handleExport = () => {
    const ok = exportCards();
    if (!ok) {
      showToast('Chưa có dữ liệu để xuất file', 'info');
    } else {
      showToast(`Đã xuất ${cards.length} thẻ sang file JSON`, 'success');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-page)] text-[var(--text-body)] antialiased font-sans">
      <Header
        onOpenAddModal={() => setIsAddModalOpen(true)}
        onOpenStudyModal={() => setIsStudyModalOpen(true)}
        onExport={handleExport}
        totalCards={cards.length}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6">
        {/* Subtle metrics summary */}
        <StatsSummary stats={stats} isLoading={isLoading} />

        {/* Filter & Search Bar */}
        <FilterBar
          filters={filters}
          onChange={updateFilters}
          stats={stats}
          videos={distinctVideos}
        />

        {/* Card Stream / Grid */}
        {isLoading ? (
          <CardGridSkeleton />
        ) : (
          <CardGrid
            cards={filteredCards}
            onToggleFavorite={handleToggleFavorite}
            onEdit={(card) => setEditingCard(card)}
            onDelete={handleDeleteCard}
            onResetFilters={resetFilters}
            isFiltered={isFiltered}
            layoutMode={filters.layoutMode}
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
