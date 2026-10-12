'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { SubtitleCard, CardStats, CreateCardDTO, UpdateCardDTO } from '@/types/card';
import { CardFilterState, LayoutMode } from '@/types/filter';
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
import { useTheme } from '@/lib/hooks/useTheme';

function MainApp() {
  const { showToast } = useToast();
  const { theme, toggleTheme } = useTheme();
  const [cards, setCards] = useState<SubtitleCard[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filter & Search & Layout State
  const [filters, setFilters] = useState<CardFilterState>(() => {
    let savedLayout: LayoutMode = 'grid';
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('af_layout_mode') as LayoutMode | null;
        if (stored && ['grid', 'tape', 'compact'].includes(stored)) {
          savedLayout = stored;
        }
      } catch {
        // silent
      }
    }
    return {
      searchQuery: '',
      status: 'all',
      selectedVideo: 'all',
      sortBy: 'newest',
      layoutMode: savedLayout,
    };
  });

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isStudyModalOpen, setIsStudyModalOpen] = useState(false);
  const [editingCard, setEditingCard] = useState<SubtitleCard | null>(null);

  // Global keyboard shortcut (⌘K or Ctrl+K to search)
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        const searchInput = document.querySelector('input[type="text"]') as HTMLInputElement | null;
        if (searchInput) {
          searchInput.focus();
        }
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, []);

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
          showToast('Không thể kết nối đến máy chủ cơ sở dữ liệu', 'error');
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
    if (updated.layoutMode) {
      try {
        localStorage.setItem('af_layout_mode', updated.layoutMode);
      } catch {
        // silent
      }
    }
    setFilters((prev) => ({ ...prev, ...updated }));
  };

  const handleResetFilters = () => {
    setFilters((prev) => ({
      ...prev,
      searchQuery: '',
      status: 'all',
      selectedVideo: 'all',
      sortBy: 'newest',
    }));
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
      showToast(isFav ? 'Đã thêm vào danh sách yêu thích' : 'Đã bỏ khỏi danh sách yêu thích', 'info');
    } catch {
      setCards((prev) =>
        prev.map((c) => (c.id === id ? { ...c, isFavorite: !isFav } : c))
      );
      showToast('Lỗi khi cập nhật trạng thái yêu thích', 'error');
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
      throw new Error(json.error || 'Lỗi khi tạo thẻ từ vựng');
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
      throw new Error(json.error || 'Lỗi khi cập nhật thẻ từ vựng');
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
      showToast('Đã xóa câu khỏi cơ sở dữ liệu', 'info');
    } catch {
      setCards(previous);
      showToast('Lỗi khi xóa câu', 'error');
    }
  };

  // Export data
  const handleExport = () => {
    if (cards.length === 0) {
      showToast('Chưa có dữ liệu để xuất file', 'info');
      return;
    }

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(cards, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `af-english-${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast(`Đã xuất ${cards.length} câu sang file JSON thành công!`, 'success');
  };

  const isFiltered =
    Boolean(filters.searchQuery.trim()) ||
    filters.status !== 'all' ||
    filters.selectedVideo !== 'all';

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
        {/* Page Title & Breadcrumb Strip */}
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

        {/* Statistics overview cards */}
        <StatsSummary stats={stats} isLoading={isLoading} />

        {/* Filter & Search Bar + Layout Switch */}
        <FilterBar
          filters={filters}
          onChange={handleFilterChange}
          stats={stats}
          videos={distinctVideos}
        />

        {/* Card Grid / Progressive Lazy Stream */}
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
