'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { SubtitleCard } from '@/types/card';
import { Modal } from '@/components/ui/Modal';
import {
  Volume2,
  ChevronLeft,
  ChevronRight,
  Shuffle,
  Star,
  RotateCw,
  Play,
} from 'lucide-react';
import { speakEnglish } from '@/lib/utils/speech';
import { splitByPhrase, parseYouTubeTimestamp, formatVideoTime } from '@/lib/utils/formatters';

interface FlashcardModalProps {
  isOpen: boolean;
  onClose: () => void;
  cards: SubtitleCard[];
  onToggleFavorite: (id: string, onlineIsFav: boolean) => void;
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

  const handleGrade = useCallback((grade: 'again' | 'hard' | 'good' | 'easy') => {
    if (process.env.NODE_ENV !== 'production') {
      console.debug('SRS Graded:', grade);
    }
    handleNext();
  }, [handleNext]);

  const handleSpeak = (text: string, rate: number = 1.0) => {
    setIsPlayingAudio(true);
    speakEnglish(text, () => setIsPlayingAudio(false), rate);
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
      } else if (e.key === '1') {
        handleGrade('again');
      } else if (e.key === '2') {
        handleGrade('hard');
      } else if (e.key === '3') {
        handleGrade('good');
      } else if (e.key === '4') {
        handleGrade('easy');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleNext, handlePrev, handleGrade]);

  if (!isOpen || deck.length === 0) return null;

  const currentCard = deck[currentIndex] || deck[0];
  const progressPercent = Math.round(((currentIndex + 1) / deck.length) * 100);
  const segments = splitByPhrase(currentCard.text, currentCard.keyPhrase);
  const ytSeconds = parseYouTubeTimestamp(currentCard.url);
  const timeFormatted = ytSeconds !== null ? formatVideoTime(ytSeconds) : null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Luyện tập Flashcard"
      description={`Thẻ ${currentIndex + 1} / ${deck.length} • Bấm Phím cách để lật thẻ`}
      maxWidth="2xl"
    >
      <div className="space-y-5 font-sans select-none">
        {/* Progress Bar & Quick Controls */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-[#6b7280] dark:text-[#9ca3af]">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-[#1b1e28] dark:text-[#f4f5f8]">
                Tiến độ: {currentIndex + 1}/{deck.length}
              </span>
              <span>({progressPercent}%)</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleShuffle}
                className="inline-flex items-center gap-1 px-2 py-1 rounded text-[#6b7280] hover:text-[#1b1e28] dark:text-[#9ca3af] dark:hover:text-[#f4f5f8] hover:bg-[#f1f3f7] dark:hover:bg-[#252730] cursor-pointer transition-colors"
                title="Xáo trộn thứ tự các thẻ"
              >
                <Shuffle className="w-3.5 h-3.5" />
                <span>Xáo trộn</span>
              </button>

              <button
                type="button"
                onClick={() => onToggleFavorite(currentCard.id, !currentCard.isFavorite)}
                className={`p-1 rounded cursor-pointer transition-colors ${
                  currentCard.isFavorite
                    ? 'text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-950/40'
                    : 'text-[#6b7280] hover:text-amber-500 hover:bg-[#f1f3f7] dark:hover:bg-[#252730]'
                }`}
                title={currentCard.isFavorite ? 'Bỏ yêu thích' : 'Đánh dấu yêu thích'}
              >
                <Star className={`w-4 h-4 ${currentCard.isFavorite ? 'fill-current' : ''}`} />
              </button>
            </div>
          </div>

          <div className="w-full bg-[#f1f3f7] dark:bg-[#252730] h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-[#f97316] h-full transition-all duration-300 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Study Flashcard Surface */}
        <div
          onClick={() => setIsFlipped(!isFlipped)}
          className={`p-6 sm:p-8 rounded-xl border transition-all duration-200 cursor-pointer min-h-[280px] flex flex-col justify-between ${
            isFlipped
              ? 'bg-[#f8f9fb] dark:bg-[#181921] border-[#f97316]/30 shadow-xs'
              : 'bg-white dark:bg-[#1c1d23] hover:border-[#cbd2df] dark:hover:border-[#3b3e4c] border-[#e5e7ee] dark:border-[#2a2c35] shadow-sm'
          }`}
        >
          {/* Card Top Label */}
          <div className="flex items-center justify-between pb-3 border-b border-[#e5e7ee] dark:border-[#2a2c35]">
            <span className="badge-phoenix badge-phoenix-primary">
              {isFlipped ? 'Mặt sau: Nghĩa & Ngữ cảnh' : 'Mặt trước: Câu tiếng Anh'}
            </span>

            {timeFormatted && (
              currentCard.url ? (
                <a
                  href={currentCard.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  title={`Mở video YouTube: ${currentCard.videoTitle} (tại ${timeFormatted})`}
                  className="inline-flex items-center gap-1 text-xs text-[#6b7285] dark:text-[#7d8498] hover:text-[#f97316] transition-colors"
                >
                  <Play className="w-3 h-3 text-[#f97316] fill-current" />
                  <span>{timeFormatted}</span>
                </a>
              ) : (
                <span
                  title={currentCard.videoTitle}
                  className="inline-flex items-center gap-1 text-xs text-[#6b7285] dark:text-[#7d8498]"
                >
                  <Play className="w-3 h-3 text-[#f97316] fill-current" />
                  <span>{timeFormatted}</span>
                </span>
              )
            )}
          </div>

          {/* Central Study Content */}
          <div className="my-auto py-4 text-center space-y-4">
            {!isFlipped ? (
              /* FRONT: English text + Target phrase */
              <div className="space-y-4">
                {currentCard.keyPhrase && (
                  <div className="inline-block bg-orange-50 dark:bg-orange-950/40 text-orange-700 dark:text-orange-300 font-bold text-sm px-3 py-1 rounded-md border border-orange-200/60 dark:border-orange-800/40">
                    {currentCard.keyPhrase}
                  </div>
                )}

                <p className="text-xl sm:text-2xl font-bold text-[#1b1e28] dark:text-[#f4f5f8] leading-relaxed max-w-xl mx-auto">
                  {segments.map((seg, idx) =>
                    seg.match ? (
                      <mark
                        key={idx}
                        className="bg-orange-50 text-orange-700 dark:bg-orange-950/40 dark:text-orange-300 font-extrabold px-1.5 py-0.5 rounded mx-1"
                      >
                        {seg.text}
                      </mark>
                    ) : (
                      <span key={idx}>{seg.text}</span>
                    )
                  )}
                </p>

                <p className="text-xs text-[#6b7285] dark:text-[#7d8498] italic">
                  (Bấm vào thẻ hoặc nhấn Phím cách để xem nghĩa)
                </p>
              </div>
            ) : (
              /* BACK: Vietnamese translation + notes */
              <div className="space-y-4 text-left max-w-xl mx-auto">
                <div>
                  <span className="text-xs font-bold text-[#6b7285] dark:text-[#7d8498] uppercase tracking-wider block mb-1">
                    Bản dịch tiếng Việt
                  </span>
                  <p className="text-lg sm:text-xl font-bold text-[#1b1e28] dark:text-[#f4f5f8] leading-relaxed">
                    &quot;{currentCard.translation || 'Chưa có bản dịch'}&quot;
                  </p>
                </div>

                {currentCard.phraseTranslation && (
                  <div className="p-3 bg-orange-50/60 dark:bg-orange-950/30 rounded-lg border border-orange-200/40 dark:border-orange-900/40">
                    <span className="text-xs font-semibold text-orange-700 dark:text-orange-300">
                      Nghĩa từ khoá:
                    </span>
                    <p className="text-sm font-bold text-[#1b1e28] dark:text-[#f4f5f8] mt-0.5">
                      {currentCard.keyPhrase} — {currentCard.phraseTranslation}
                    </p>
                  </div>
                )}

                {currentCard.explanation && (
                  <div className="p-3 bg-white dark:bg-[#1c1d23] rounded-lg border border-[#e5e7ee] dark:border-[#2a2c35] text-xs text-[#4b5266] dark:text-[#9da3b4]">
                    <span className="font-bold text-[#1b1e28] dark:text-[#f4f5f8] mr-1">
                      Ghi chú ngữ pháp:
                    </span>
                    <span>{currentCard.explanation}</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Audio Pronunciation Pill Bar */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="flex items-center justify-between pt-3 border-t border-[#e5e7ee] dark:border-[#2a2c35]"
          >
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleSpeak(currentCard.text, 1.0)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-[#f97316] hover:bg-[#ea580c] text-white shadow-2xs cursor-pointer transition-colors"
                title="Nghe phát âm chuẩn"
              >
                <Volume2 className={`w-3.5 h-3.5 ${isPlayingAudio ? 'animate-bounce' : ''}`} />
                <span>{isPlayingAudio ? 'Đang đọc...' : 'Nghe 1.0x'}</span>
              </button>

              <button
                type="button"
                onClick={() => handleSpeak(currentCard.text, 0.75)}
                className="px-2.5 py-1.5 text-xs font-medium rounded-lg bg-white dark:bg-[#1c1d23] hover:bg-[#f1f3f7] dark:hover:bg-[#252730] text-[#4b5266] dark:text-[#9da3b4] border border-[#e2e5ec] dark:border-[#2f313c] cursor-pointer transition-colors"
                title="Nghe phát âm chậm"
              >
                <span>0.75x</span>
              </button>
            </div>

            <button
              type="button"
              onClick={() => setIsFlipped(!isFlipped)}
              className="inline-flex items-center gap-1 text-xs font-semibold text-[#f97316] hover:underline cursor-pointer"
            >
              <RotateCw className="w-3.5 h-3.5" />
              <span>{isFlipped ? 'Xem lại mặt trước' : 'Lật thẻ [Space]'}</span>
            </button>
          </div>
        </div>

        {/* Spaced Repetition Grading (Shown when flipped) */}
        {isFlipped && (
          <div className="space-y-2 animate-in fade-in duration-200">
            <span className="block text-xs font-semibold text-center text-[#6b7285] dark:text-[#7d8498]">
              Đánh giá mức độ ghi nhớ (Phím số 1 - 4):
            </span>
            <div className="grid grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => handleGrade('again')}
                className="py-2 px-2 text-xs font-semibold rounded-lg bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/40 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-900/60 cursor-pointer transition-colors text-center"
              >
                <span className="block font-bold">1. Học lại</span>
                <span className="text-[10px] opacity-75">&lt; 1 phút</span>
              </button>

              <button
                type="button"
                onClick={() => handleGrade('hard')}
                className="py-2 px-2 text-xs font-semibold rounded-lg bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/40 dark:hover:bg-amber-900/40 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-900/60 cursor-pointer transition-colors text-center"
              >
                <span className="block font-bold">2. Khó</span>
                <span className="text-[10px] opacity-75">10 phút</span>
              </button>

              <button
                type="button"
                onClick={() => handleGrade('good')}
                className="py-2 px-2 text-xs font-semibold rounded-lg bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/40 dark:hover:bg-blue-900/40 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-900/60 cursor-pointer transition-colors text-center"
              >
                <span className="block font-bold">3. Tốt</span>
                <span className="text-[10px] opacity-75">1 ngày</span>
              </button>

              <button
                type="button"
                onClick={() => handleGrade('easy')}
                className="py-2 px-2 text-xs font-semibold rounded-lg bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:hover:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/60 cursor-pointer transition-colors text-center"
              >
                <span className="block font-bold">4. Dễ</span>
                <span className="text-[10px] opacity-75">4 ngày</span>
              </button>
            </div>
          </div>
        )}

        {/* Bottom Navigation Buttons */}
        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className="inline-flex items-center gap-1 px-3.5 py-2 text-xs font-semibold rounded-lg bg-white dark:bg-[#1c1d23] hover:bg-[#f1f3f7] dark:hover:bg-[#252730] text-[#3a4052] dark:text-[#f4f5f8] border border-[#e2e5ec] dark:border-[#2f313c] disabled:opacity-40 disabled:pointer-events-none cursor-pointer transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Câu trước [←]</span>
          </button>

          <button
            type="button"
            onClick={handleNext}
            disabled={currentIndex === deck.length - 1}
            className="inline-flex items-center gap-1 px-3.5 py-2 text-xs font-semibold rounded-lg bg-[#f97316] hover:bg-[#ea580c] text-white disabled:opacity-40 disabled:pointer-events-none cursor-pointer transition-colors shadow-2xs"
          >
            <span>Câu tiếp theo [→]</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </Modal>
  );
}
