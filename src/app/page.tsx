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

  // Clean Architecture presentation hooks
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

  // Modal UI states
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

  // Action Handlers
  const handleToggleFavorite = async (id: string, isFav: boolean) => {
    try {
      await toggleFavorite(id, isFav);
      showToast(isFav ? 'Đã thêm vào yêu thích ⭐' : 'Đã bỏ yêu thích', 'info');
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
      showToast(`Đã xuất ${cards.length} thẻ sang file JSON!`, 'success');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f5f7fa] dark:bg-[#0f111a] text-[#141824] dark:text-[#eff2f6] transition-colors duration-150 antialiased font-sans">
      <Header
        onOpenAddModal={() => setIsAddModalOpen(true)}
        onOpenStudyModal={() => setIsStudyModalOpen(true)}
        onExport={handleExport}
        totalCards={cards.length}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">
        {/* Title & Overview Ribbon */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-[#e3e6ed] dark:border-[#272f3d]">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#141824] dark:text-[#eff2f6] tracking-tight">
              Kho từ vựng & Câu hội thoại
            </h2>
            <p className="text-xs sm:text-sm text-[#6e7891] dark:text-[#8a94ad] mt-0.5">
              Tra cứu, nghe phát âm ngữ cảnh và luyện tập ghi nhớ qua flashcard
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className="badge-phoenix badge-phoenix-secondary">
              {filteredCards.length} kết quả
            </span>
            <span className="badge-phoenix badge-phoenix-primary uppercase">
              Chế độ: {filters.layoutMode === 'grid' ? 'Lưới' : filters.layoutMode === 'tape' ? 'Danh sách' : 'Thu gọn'}
            </span>
          </div>
        </div>

        {/* Aggregate Metrics */}
        <StatsSummary stats={stats} isLoading={isLoading} />

        {/* Filter & Search Bar with Layout Switcher */}
        <FilterBar
          filters={filters}
          onChange={updateFilters}
          stats={stats}
          videos={distinctVideos}
        />

        {/* Cards Presentation */}
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
