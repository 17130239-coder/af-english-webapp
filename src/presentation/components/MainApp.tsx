'use client';

import React, { useState, useEffect } from 'react';
import { SubtitleCard, CardStats } from '@/core/entities/card.entity';
import { CreateCardDTO, UpdateCardDTO } from '@/core/dtos/card.dto';
import { useCards } from '@/presentation/hooks/useCards';
import { useCardFilters } from '@/presentation/hooks/useCardFilters';
import { useTheme } from '@/presentation/hooks/useTheme';
import { useToast } from '@/presentation/components/ui/Toast';
import { Header } from '@/presentation/components/layout/Header';
import { FilterBar } from '@/presentation/components/filters/FilterBar';
import { SelectionBar } from '@/presentation/components/cards/SelectionBar';
import { CardGrid } from '@/presentation/components/cards/CardGrid';
import { CardGridSkeleton } from '@/presentation/components/cards/CardSkeleton';
import { AddCardModal } from '@/presentation/components/cards/AddCardModal';
import { CardDetailModal } from '@/presentation/components/cards/CardDetailModal';
import { FlashcardModal } from '@/presentation/components/study/FlashcardModal';
import { CommandPalette } from '@/presentation/components/command/CommandPalette';

interface MainAppProps {
  initialCards?: SubtitleCard[];
  initialStats?: CardStats | null;
  initialVideos?: string[];
}

export function MainApp({
  initialCards = [],
  initialStats = null,
  initialVideos = [],
}: MainAppProps) {
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
  } = useCards({ initialCards, initialStats, initialVideos });

  const {
    filters,
    filteredCards,
    stats,
    distinctVideos,
    updateFilters,
    resetFilters,
    isFiltered,
  } = useCardFilters(cards);

  // Selection state
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isStudyModalOpen, setIsStudyModalOpen] = useState(false);
  const [isStudyMounted, setIsStudyMounted] = useState(false);
  const [studyCards, setStudyCards] = useState<SubtitleCard[]>([]);
  const [editingCard, setEditingCard] = useState<SubtitleCard | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  const handleOpenStudy = (customDeck?: SubtitleCard[]) => {
    const deck = customDeck && customDeck.length > 0
      ? customDeck
      : filteredCards.length > 0
      ? filteredCards
      : cards;
    setStudyCards(deck);
    setIsStudyMounted(true);
    setIsStudyModalOpen(true);
  };

  const handleCloseStudy = () => {
    setIsStudyModalOpen(false);
    setTimeout(() => {
      setIsStudyMounted(false);
    }, 200);
  };

  const handleOpenEdit = (card: SubtitleCard) => {
    setEditingCard(card);
    setIsEditModalOpen(true);
  };

  const handleCloseEdit = () => {
    setIsEditModalOpen(false);
    setTimeout(() => {
      setEditingCard(null);
    }, 200);
  };

  // Selection handlers
  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleToggleSelectAll = () => {
    if (selectedIds.size === filteredCards.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredCards.map((c) => c.id)));
    }
  };

  const handleClearSelection = () => {
    setSelectedIds(new Set());
  };

  const handleDeleteSelected = async () => {
    if (selectedIds.size === 0) return;
    if (!confirm(`Bạn có chắc muốn xóa ${selectedIds.size} thẻ đã chọn?`)) return;

    const ids = Array.from(selectedIds);
    let successCount = 0;
    for (const id of ids) {
      try {
        await deleteCard(id);
        successCount++;
      } catch {
        // continue
      }
    }
    setSelectedIds(new Set());
    showToast(`Đã xóa ${successCount} thẻ thành công`, 'info');
  };

  const handleOpenStudySelected = () => {
    const selectedCards = cards.filter((c) => selectedIds.has(c.id));
    if (selectedCards.length === 0) return;
    handleOpenStudy(selectedCards);
  };

  // Global search & command palette shortcut (⌘K or Ctrl+K)
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
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
      showToast('Đã thêm câu mới thành công', 'success');
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Lỗi khi tạo câu', 'error');
      throw err;
    }
  };

  const handleUpdateCard = async (id: string, dto: UpdateCardDTO) => {
    try {
      await updateCard(id, dto);
      showToast('Cập nhật thành công', 'success');
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Lỗi khi cập nhật câu', 'error');
      throw err;
    }
  };

  const handleDeleteCard = async (id: string) => {
    try {
      await deleteCard(id);
      setSelectedIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
      showToast('Đã xóa câu khỏi danh sách', 'info');
    } catch {
      showToast('Lỗi khi xóa', 'error');
    }
  };

  const handleExport = () => {
    const ok = exportCards();
    if (!ok) {
      showToast('Chưa có dữ liệu để xuất file', 'info');
    } else {
      showToast(`Đã xuất ${cards.length} câu sang file JSON`, 'success');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-page)] text-[var(--text-body)] antialiased font-sans">
      {/* Top Navigation Bar */}
      <Header
        onOpenAddModal={() => setIsAddModalOpen(true)}
        onOpenStudyModal={() => handleOpenStudy()}
        onExport={handleExport}
        totalCards={cards.length}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      {/* Main Content Area matching Extension .main-content (max-w-[1400px]) */}
      <main className="flex-1 max-w-[1400px] w-full mx-auto px-4 sm:px-7 py-6">
        {/* Search, Filter Tabs & Sort Controls */}
        <FilterBar
          currentStatus={filters.status}
          onSelectStatus={(status) => updateFilters({ status })}
          stats={stats}
          searchQuery={filters.searchQuery}
          onSearchChange={(q) => updateFilters({ searchQuery: q })}
          sortBy={filters.sortBy}
          onSortChange={(sort) => updateFilters({ sortBy: sort })}
          selectedVideo={filters.selectedVideo}
          onVideoChange={(vid) => updateFilters({ selectedVideo: vid })}
          videos={distinctVideos}
          layoutMode={filters.layoutMode}
          onLayoutChange={(layoutMode) => updateFilters({ layoutMode })}
          onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        />

        {/* Sticky Batch Selection Action Bar */}
        <SelectionBar
          selectedCount={selectedIds.size}
          totalVisible={filteredCards.length}
          isAllSelected={selectedIds.size > 0 && selectedIds.size === filteredCards.length}
          onToggleSelectAll={handleToggleSelectAll}
          onOpenStudy={handleOpenStudySelected}
          onDeleteSelected={handleDeleteSelected}
          onClearSelection={handleClearSelection}
        />

        {/* Cards Stream / Grid */}
        {isLoading ? (
          <CardGridSkeleton />
        ) : (
          <CardGrid
            cards={filteredCards}
            selectedIds={selectedIds}
            onToggleSelect={handleToggleSelect}
            onToggleFavorite={handleToggleFavorite}
            onEdit={handleOpenEdit}
            onDelete={handleDeleteCard}
            onResetFilters={resetFilters}
            isFiltered={isFiltered}
            layoutMode={filters.layoutMode}
          />
        )}
      </main>

      {/* ⌘K Command Palette */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        cards={cards}
        filters={filters}
        onUpdateFilters={updateFilters}
        onOpenStudy={() => handleOpenStudy()}
        onOpenAdd={() => setIsAddModalOpen(true)}
        onSelectCard={handleOpenEdit}
        onExport={handleExport}
      />

      {/* Modals */}
      <AddCardModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleCreateCard}
      />

      {editingCard && (
        <CardDetailModal
          key={editingCard.id}
          isOpen={isEditModalOpen}
          onClose={handleCloseEdit}
          card={editingCard}
          onUpdate={handleUpdateCard}
        />
      )}

      {isStudyMounted && (
        <FlashcardModal
          isOpen={isStudyModalOpen}
          onClose={handleCloseStudy}
          cards={studyCards.length > 0 ? studyCards : cards}
          onToggleFavorite={handleToggleFavorite}
        />
      )}
    </div>
  );
}
