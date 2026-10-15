'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Search, Star, BookOpen, Clock, ArrowUpDown, Plus, Sparkles, X, Check, ArrowRight, Download } from 'lucide-react';
import { SubtitleCard } from '@/core/entities/card.entity';
import { CardFilterState, FilterStatus, SortOrder } from '@/core/entities/filter.entity';
import { cleanTitle } from '@/presentation/utils/formatters';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  cards: SubtitleCard[];
  filters: CardFilterState;
  onUpdateFilters: (updated: Partial<CardFilterState>) => void;
  onOpenStudy: () => void;
  onOpenAdd: () => void;
  onSelectCard: (card: SubtitleCard) => void;
  onExport?: () => void;
}

export function CommandPalette({
  isOpen,
  onClose,
  cards,
  filters,
  onUpdateFilters,
  onOpenStudy,
  onOpenAdd,
  onSelectCard,
  onExport,
}: CommandPaletteProps) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input on open & reset state
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Matching cards (max 6 items for clean minimalist UX)
  const matchingCards = query.trim()
    ? cards
        .filter((c) => {
          const q = query.toLowerCase();
          return (
            c.text.toLowerCase().includes(q) ||
            c.translation?.toLowerCase().includes(q) ||
            c.keyPhrase?.toLowerCase().includes(q) ||
            c.phraseTranslation?.toLowerCase().includes(q) ||
            c.videoTitle?.toLowerCase().includes(q)
          );
        })
        .slice(0, 6)
    : [];

  // Quick Action Options
  const actions = [
    {
      id: 'study',
      label: 'Luyện tập Flashcards',
      icon: Sparkles,
      hint: 'Phím Space',
      action: () => {
        onClose();
        onOpenStudy();
      },
    },
    {
      id: 'add',
      label: 'Thêm câu mới',
      icon: Plus,
      hint: '+',
      action: () => {
        onClose();
        onOpenAdd();
      },
    },
    {
      id: 'filter-all',
      label: 'Xem tất cả câu',
      icon: BookOpen,
      hint: `${cards.length}`,
      action: () => {
        onUpdateFilters({ status: 'all', searchQuery: '' });
        onClose();
      },
    },
    {
      id: 'filter-fav',
      label: 'Xem câu yêu thích',
      icon: Star,
      hint: '★',
      action: () => {
        onUpdateFilters({ status: 'favorites' });
        onClose();
      },
    },
    {
      id: 'filter-translated',
      label: 'Xem câu đã dịch AI',
      icon: Check,
      hint: 'Đã dịch',
      action: () => {
        onUpdateFilters({ status: 'translated' });
        onClose();
      },
    },
    {
      id: 'sort-toggle',
      label: `Sắp xếp: ${
        filters.sortBy === 'newest' ? 'Mới nhất' : filters.sortBy === 'oldest' ? 'Cũ nhất' : 'A → Z'
      }`,
      icon: ArrowUpDown,
      hint: 'Đổi thứ tự',
      action: () => {
        const nextSort: Record<SortOrder, SortOrder> = {
          newest: 'oldest',
          oldest: 'alphabetical',
          alphabetical: 'newest',
        };
        onUpdateFilters({ sortBy: nextSort[filters.sortBy] });
        onClose();
      },
    },
    {
      id: 'export-data',
      label: 'Xuất dữ liệu (JSON)',
      icon: Download,
      hint: 'Sao lưu',
      action: () => {
        onClose();
        if (onExport) onExport();
      },
    },
  ];

  const totalItems = query.trim() ? matchingCards.length : actions.length;

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % Math.max(1, totalItems));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + totalItems) % Math.max(1, totalItems));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (query.trim() && matchingCards[selectedIndex]) {
          onSelectCard(matchingCards[selectedIndex]);
          onClose();
        } else if (!query.trim() && actions[selectedIndex]) {
          actions[selectedIndex].action();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, query, selectedIndex, totalItems, matchingCards, actions, onClose, onSelectCard]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-150">
      <div
        className="w-full max-w-xl bg-[var(--bg-card)] border border-[var(--border-default)] rounded-2xl shadow-2xl overflow-hidden font-sans"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-[var(--border-subtle)]">
          <Search className="w-4 h-4 text-[var(--accent)] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Tìm kiếm từ vựng, bản dịch, hoặc gõ lệnh..."
            className="flex-1 bg-transparent text-sm text-[var(--text-main)] placeholder-[var(--text-faint)] focus:outline-none"
          />
          <div className="flex items-center gap-1.5 shrink-0">
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="p-1 rounded-md text-[var(--text-muted)] hover:text-[var(--text-main)] cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
            <kbd className="px-1.5 py-0.5 text-[10px] font-mono text-[var(--text-faint)] bg-[var(--bg-muted)] border border-[var(--border-default)] rounded">
              ESC
            </kbd>
          </div>
        </div>

        {/* Content Body */}
        <div className="max-h-80 overflow-y-auto p-2 divide-y divide-[var(--border-subtle)]/40 scrollbar-none">
          {query.trim() ? (
            matchingCards.length > 0 ? (
              <div className="space-y-1">
                <div className="px-3 py-1.5 text-[10px] font-semibold text-[var(--text-faint)] uppercase tracking-wider">
                  Kết quả từ vựng ({matchingCards.length})
                </div>
                {matchingCards.map((card, idx) => {
                  const isSelected = idx === selectedIndex;
                  return (
                    <div
                      key={card.id}
                      onClick={() => {
                        onSelectCard(card);
                        onClose();
                      }}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      className={`px-3 py-2 rounded-xl flex items-center justify-between gap-3 cursor-pointer transition-colors ${
                        isSelected
                          ? 'bg-[var(--accent-subtle)] text-[var(--text-main)]'
                          : 'hover:bg-[var(--bg-muted)] text-[var(--text-body)]'
                      }`}
                    >
                      <div className="min-w-0 flex-1 space-y-0.5">
                        <p className="text-sm font-semibold text-[var(--text-main)] truncate">
                          {card.text}
                        </p>
                        <p className="text-xs text-[var(--text-muted)] truncate">
                          {card.translation || card.phraseTranslation || 'Chưa dịch'}
                        </p>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-[var(--text-faint)] shrink-0" />
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="py-8 text-center text-xs text-[var(--text-muted)]">
                Không tìm thấy câu nào phù hợp với &quot;{query}&quot;
              </div>
            )
          ) : (
            <div className="space-y-1">
              <div className="px-3 py-1.5 text-[10px] font-semibold text-[var(--text-faint)] uppercase tracking-wider">
                Lệnh thao tác nhanh
              </div>
              {actions.map((act, idx) => {
                const Icon = act.icon;
                const isSelected = idx === selectedIndex;
                return (
                  <div
                    key={act.id}
                    onClick={act.action}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className={`px-3 py-2 rounded-xl flex items-center justify-between gap-3 cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-[var(--accent-subtle)] text-[var(--text-main)]'
                        : 'hover:bg-[var(--bg-muted)] text-[var(--text-body)]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className="w-4 h-4 text-[var(--accent)] shrink-0" />
                      <span className="text-sm font-medium text-[var(--text-main)]">
                        {act.label}
                      </span>
                    </div>
                    <span className="text-xs text-[var(--text-faint)] font-mono">{act.hint}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer Hint */}
        <div className="px-4 py-2 bg-[var(--bg-muted)]/50 border-t border-[var(--border-subtle)] flex items-center justify-between text-[11px] text-[var(--text-faint)]">
          <span>Dùng ↑ ↓ để điều hướng, Enter để chọn</span>
          <span>AF English ⌘K</span>
        </div>
      </div>
    </div>
  );
}
