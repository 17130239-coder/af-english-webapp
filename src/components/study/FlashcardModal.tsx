'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { SubtitleCard } from '@/types/card';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import {
  Volume2,
  ChevronLeft,
  ChevronRight,
  Shuffle,
  Star,
  RotateCw,
  Lightbulb,
} from 'lucide-react';
import { speakEnglish } from '@/lib/utils/speech';
import { splitByPhrase } from '@/lib/utils/formatters';

interface FlashcardModalProps {
  isOpen: boolean;
  onClose: () => void;
  cards: SubtitleCard[];
  onToggleFavorite: (id: string, isFav: boolean) => void;
}

export function FlashcardModal({
  isOpen,
  onClose,
  cards,
  onToggleFavorite,
}: FlashcardModalProps) {
  const [deck, setDeck] = useState<SubtitleCard[]>(() => cards);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev < deck.length - 1 ? prev + 1 : prev));
    setIsFlipped(false);
  }, [deck.length]);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : prev));
    setIsFlipped(false);
  }, []);

  const handleShuffle = useCallback(() => {
    setDeck((prev) => [...prev].sort(() => Math.random() - 0.5));
    setCurrentIndex(0);
    setIsFlipped(false);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        setIsFlipped((prev) => !prev);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrev();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleNext, handlePrev]);

  if (!isOpen || deck.length === 0) return null;

  const currentCard = deck[currentIndex] || deck[0];
  const progressPercent = Math.round(((currentIndex + 1) / deck.length) * 100);
  const segments = splitByPhrase(currentCard.text, currentCard.keyPhrase);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Chế độ học Flashcard"
      description={`Thẻ ${currentIndex + 1} trên ${deck.length} • Phím Space để lật thẻ, Mũi tên trái/phải để chuyển thẻ`}
      maxWidth="xl"
    >
      <div className="space-y-4">
        {/* Progress bar */}
        <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
          <div
            className="bg-indigo-600 h-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Card Flip Container */}
        <div
          onClick={() => setIsFlipped(!isFlipped)}
          className={`min-h-[260px] p-6 sm:p-8 rounded-2xl border transition-all cursor-pointer select-none flex flex-col justify-between ${
            isFlipped
              ? 'bg-indigo-50/40 dark:bg-indigo-950/20 border-indigo-200 dark:border-indigo-800'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm hover:border-slate-300'
          }`}
        >
          {/* Top of Card */}
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-semibold tracking-wider uppercase text-[10px] text-indigo-600 dark:text-indigo-400">
              {isFlipped ? 'Mặt sau (Bản dịch & Giải thích)' : 'Mặt trước (Tiếng Anh)'}
            </span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleFavorite(currentCard.id, !currentCard.isFavorite);
                  setDeck((prev) =>
                    prev.map((c) =>
                      c.id === currentCard.id ? { ...c, isFavorite: !c.isFavorite } : c
                    )
                  );
                }}
                className={`p-1 rounded cursor-pointer ${
                  currentCard.isFavorite
                    ? 'text-yellow-500'
                    : 'text-slate-300 hover:text-slate-500'
                }`}
              >
                <Star className={`w-4 h-4 ${currentCard.isFavorite ? 'fill-current' : ''}`} />
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  speakEnglish(currentCard.text);
                }}
                className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded cursor-pointer"
                title="Nghe phát âm"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Center Content */}
          <div className="my-6 text-center">
            {!isFlipped ? (
              <div className="space-y-3">
                <p className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-50 leading-relaxed">
                  {segments.map((seg, idx) =>
                    seg.match ? (
                      <mark
                        key={idx}
                        className="bg-amber-100 text-amber-900 dark:bg-amber-950/70 dark:text-amber-200 px-1 py-0.5 rounded"
                      >
                        {seg.text}
                      </mark>
                    ) : (
                      <span key={idx}>{seg.text}</span>
                    )
                  )}
                </p>
                {currentCard.keyPhrase && (
                  <p className="text-sm text-indigo-600 dark:text-indigo-400 font-medium">
                    Cụm từ: &quot;{currentCard.keyPhrase}&quot;
                  </p>
                )}
              </div>
            ) : (
              <div className="space-y-4 text-left">
                {currentCard.keyPhrase && currentCard.phraseTranslation && (
                  <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-indigo-100 dark:border-indigo-900/40 text-sm">
                    <span className="font-bold text-indigo-900 dark:text-indigo-300 mr-2">
                      {currentCard.keyPhrase}:
                    </span>
                    <span className="text-indigo-700 dark:text-indigo-200">
                      {currentCard.phraseTranslation}
                    </span>
                  </div>
                )}

                <div>
                  <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                    Bản dịch câu:
                  </h4>
                  <p className="text-base font-medium text-slate-800 dark:text-slate-100">
                    {currentCard.translation || 'Chưa có bản dịch'}
                  </p>
                </div>

                {currentCard.explanation && (
                  <div className="flex items-start gap-2 p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300">
                    <Lightbulb className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    <p>{currentCard.explanation}</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Bottom Flip Hint */}
          <div className="flex items-center justify-center gap-1.5 text-xs text-slate-400 dark:text-slate-500">
            <RotateCw className="w-3.5 h-3.5" />
            <span>Nhấp vào thẻ hoặc bấm phím Space để lật</span>
          </div>
        </div>

        {/* Navigation Controls */}
        <div className="flex items-center justify-between pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrev}
            disabled={currentIndex === 0}
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Trước</span>
          </Button>

          <Button variant="ghost" size="sm" onClick={handleShuffle} title="Trộn thứ tự thẻ">
            <Shuffle className="w-4 h-4" />
            <span>Trộn thẻ</span>
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={handleNext}
            disabled={currentIndex === deck.length - 1}
          >
            <span>Tiếp theo</span>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Modal>
  );
}
