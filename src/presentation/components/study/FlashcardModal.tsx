'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { SubtitleCard } from '@/core/entities/card.entity';
import { Modal } from '@/presentation/components/ui/Modal';
import {
  Volume2,
  ChevronLeft,
  ChevronRight,
  Shuffle,
  Star,
  Play,
  RotateCw,
} from 'lucide-react';
import { SpeechSynthesisService } from '@/infrastructure/services/speech-synthesis.service';
import { splitByPhrase, parseYouTubeTimestamp, formatVideoTime } from '@/presentation/utils/formatters';

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
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

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

  const handleSpeak = (text: string, rate: number = 1.0) => {
    setIsPlayingAudio(true);
    SpeechSynthesisService.speak(text, () => setIsPlayingAudio(false), rate);
  };

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        setIsFlipped((prev) => !prev);
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        e.preventDefault();
        handleNext();
      } else if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        e.preventDefault();
        handlePrev();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleNext, handlePrev]);

  if (deck.length === 0) return null;

  const currentCard = deck[currentIndex] || deck[0];
  const progressPercent = Math.round(((currentIndex + 1) / deck.length) * 100);
  const segments = splitByPhrase(currentCard.text, currentCard.keyPhrase);
  const ytSeconds = parseYouTubeTimestamp(currentCard.url);
  const timeFormatted = ytSeconds !== null ? formatVideoTime(ytSeconds) : null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Thẻ ghi nhớ Flashcard"
      description={`Thẻ ${currentIndex + 1} / ${deck.length} · Phím Space để lật thẻ`}
      maxWidth="xl"
    >
      <div className="space-y-4 font-sans select-none">
        {/* Progress & Controls */}
        <div className="flex items-center justify-between text-xs text-[var(--text-muted)]">
          <span className="font-medium text-[var(--text-main)]">
            {currentIndex + 1} / {deck.length} câu ({progressPercent}%)
          </span>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handleShuffle}
              className="p-1.5 text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-muted)] rounded-md cursor-pointer transition-colors"
              title="Trộn ngẫu nhiên"
            >
              <Shuffle className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => onToggleFavorite(currentCard.id, !currentCard.isFavorite)}
              className={`p-1.5 rounded-md cursor-pointer transition-colors ${
                currentCard.isFavorite
                  ? 'text-amber-500'
                  : 'text-[var(--text-faint)] hover:text-amber-500 hover:bg-[var(--bg-muted)]'
              }`}
              title={currentCard.isFavorite ? 'Bỏ yêu thích' : 'Yêu thích'}
            >
              <Star className={`w-4 h-4 ${currentCard.isFavorite ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>

        {/* Slim progress bar */}
        <div className="w-full bg-[var(--border-subtle)] h-1 rounded-full overflow-hidden">
          <div
            className="bg-[var(--accent)] h-full transition-all duration-200"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Flashcard Surface - Fixed Height to prevent any modal shifting */}
        <div
          onClick={() => setIsFlipped(!isFlipped)}
          className={`p-6 sm:p-7 rounded-xl border transition-colors duration-150 cursor-pointer h-[330px] sm:h-[350px] flex flex-col justify-between ${
            isFlipped
              ? 'bg-[var(--bg-muted)] border-[var(--border-hover)]'
              : 'bg-[var(--bg-card)] border-[var(--border-default)] hover:border-[var(--border-hover)] shadow-xs'
          }`}
        >
          {/* Top Label */}
          <div className="flex items-center justify-between text-xs text-[var(--text-muted)] pb-2 border-b border-[var(--border-subtle)] shrink-0">
            <span className="font-semibold text-[11px] uppercase tracking-wider">
              {isFlipped ? 'Mặt sau · Nghĩa & Ngữ cảnh' : 'Mặt trước · Tiếng Anh'}
            </span>

            {timeFormatted && (
              <span className="inline-flex items-center gap-1 text-[11px]">
                <Play className="w-2.5 h-2.5 fill-current text-[var(--accent)]" />
                <span>{timeFormatted}</span>
              </span>
            )}
          </div>

          {/* Central Body */}
          <div className="flex-1 my-auto py-2 flex flex-col justify-center overflow-y-auto">
            {!isFlipped ? (
              <div className="space-y-3 text-center my-auto">
                {currentCard.keyPhrase && (
                  <div className="inline-block bg-[var(--highlight-bg)] text-[var(--highlight-text)] font-semibold text-xs px-2.5 py-1 rounded-md">
                    {currentCard.keyPhrase}
                  </div>
                )}

                <p className="text-xl sm:text-2xl font-medium text-[var(--text-main)] leading-relaxed max-w-xl mx-auto tracking-tight">
                  {segments.map((seg, idx) =>
                    seg.match ? (
                      <mark
                        key={idx}
                        className="bg-[var(--highlight-bg)] text-[var(--highlight-text)] font-semibold px-1 py-0.5 rounded mx-0.5"
                      >
                        {seg.text}
                      </mark>
                    ) : (
                      <span key={idx}>{seg.text}</span>
                    )
                  )}
                </p>

                <p className="text-xs text-[var(--text-faint)]">
                  (Nhấn Space hoặc bấm vào đây để xem bản dịch)
                </p>
              </div>
            ) : (
              <div className="space-y-3 text-left my-auto">
                {currentCard.keyPhrase && currentCard.phraseTranslation && (
                  <div className="p-2.5 rounded-lg bg-[var(--bg-card)] border border-[var(--border-default)] text-xs">
                    <span className="font-semibold text-[var(--accent)] mr-1.5">
                      {currentCard.keyPhrase}:
                    </span>
                    <span className="text-[var(--text-body)]">
                      {currentCard.phraseTranslation}
                    </span>
                  </div>
                )}

                <div>
                  <p className="text-base sm:text-lg font-medium text-[var(--text-main)] leading-relaxed">
                    &quot;{currentCard.translation || 'Chưa có bản dịch'}&quot;
                  </p>
                </div>

                {currentCard.explanation && (
                  <p className="text-xs text-[var(--text-muted)] leading-relaxed pt-1 border-t border-[var(--border-subtle)]">
                    {currentCard.explanation}
                  </p>
                )}

                {currentCard.exampleSentence && (
                  <div className="text-xs text-[var(--text-muted)] italic pt-1 border-t border-[var(--border-subtle)]">
                    Ví dụ: {currentCard.exampleSentence}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Bottom Card Controls */}
          <div className="flex items-center justify-between pt-2 border-t border-[var(--border-subtle)] text-xs shrink-0">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleSpeak(currentCard.text, 1.0);
              }}
              className="inline-flex items-center gap-1.5 text-[var(--text-muted)] hover:text-[var(--text-main)] cursor-pointer"
            >
              <Volume2 className={`w-3.5 h-3.5 ${isPlayingAudio ? 'animate-pulse' : ''}`} />
              <span>Phát âm</span>
            </button>

            <span className="inline-flex items-center gap-1 text-[var(--text-faint)]">
              <RotateCw className="w-3 h-3" />
              <span>Lật thẻ (Space)</span>
            </span>
          </div>
        </div>

        {/* Navigation buttons */}
        <div className="flex items-center justify-between pt-1">
          <button
            type="button"
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className="px-3 py-1.5 text-xs font-medium rounded-lg border border-[var(--border-default)] hover:bg-[var(--bg-muted)] text-[var(--text-body)] disabled:opacity-30 disabled:pointer-events-none cursor-pointer flex items-center gap-1"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>Câu trước</span>
          </button>

          <span className="text-xs text-[var(--text-faint)] hidden sm:inline">
            Dùng phím mũi tên ← → để chuyển câu
          </span>

          <button
            type="button"
            onClick={handleNext}
            disabled={currentIndex === deck.length - 1}
            className="px-3.5 py-1.5 text-xs font-medium rounded-lg bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 hover:opacity-90 disabled:opacity-30 disabled:pointer-events-none cursor-pointer flex items-center gap-1 shadow-2xs"
          >
            <span>Tiếp theo</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </Modal>
  );
}
