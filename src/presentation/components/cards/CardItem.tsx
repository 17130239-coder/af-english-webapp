'use client';

import React, { useState } from 'react';
import { SubtitleCard } from '@/core/entities/card.entity';
import { LayoutMode } from '@/core/entities/filter.entity';
import {
  Volume2,
  Copy,
  Check,
  Star,
  Edit2,
  Trash2,
  Play,
} from 'lucide-react';
import {
  parseYouTubeTimestamp,
  formatVideoTime,
  splitByPhrase,
  cleanTitle,
} from '@/presentation/utils/formatters';
import { SpeechSynthesisService } from '@/infrastructure/services/speech-synthesis.service';
import { useToast } from '@/presentation/components/ui/Toast';

interface CardItemProps {
  card: SubtitleCard;
  onToggleFavorite: (id: string, isFav: boolean) => void;
  onEdit: (card: SubtitleCard) => void;
  onDelete: (id: string) => void;
  layoutMode?: LayoutMode;
}

export function CardItem({
  card,
  onToggleFavorite,
  onEdit,
  onDelete,
  layoutMode = 'tape',
}: CardItemProps) {
  const { showToast } = useToast();
  const [copiedText, setCopiedText] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const ytSeconds = parseYouTubeTimestamp(card.url);
  const timeFormatted = ytSeconds !== null ? formatVideoTime(ytSeconds) : null;
  const textSegments = splitByPhrase(card.text, card.keyPhrase);

  const handleCopyText = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(card.text);
      setCopiedText(true);
      showToast('Đã sao chép vào clipboard', 'success');
      setTimeout(() => setCopiedText(false), 1500);
    } catch {
      showToast('Không thể sao chép văn bản', 'error');
    }
  };

  const handleSpeak = (e: React.MouseEvent, text: string, rate: number = 1.0) => {
    e.stopPropagation();
    setIsPlayingAudio(true);
    SpeechSynthesisService.speak(text, () => setIsPlayingAudio(false), rate);
  };

  /* -------------------------------------------------------------
   * 1. MINIMALIST LIST VIEW (Default / Less is More 2-Element Rule)
   * ------------------------------------------------------------- */
  if (layoutMode === 'tape' || layoutMode === 'compact') {
    return (
      <article
        onClick={() => onEdit(card)}
        className="group relative py-3.5 px-3 sm:px-4 border-b border-[var(--border-subtle)] hover:bg-[var(--bg-card)] transition-colors cursor-pointer flex items-center justify-between gap-4 font-sans select-none"
      >
        {/* Core 2 Elements: English (with keyphrase) & Vietnamese translation */}
        <div className="flex-1 min-w-0 space-y-1">
          {/* Element 1: English Sentence / Vocabulary */}
          <div className="flex items-baseline gap-2 min-w-0">
            <p className="text-sm sm:text-base font-semibold text-[var(--text-main)] truncate tracking-tight inline-flex items-center">
              <span className="truncate">
                {textSegments.map((seg, idx) =>
                  seg.match ? (
                    <span
                      key={idx}
                      className="text-amber-500 dark:text-amber-400 font-semibold underline decoration-amber-500/40 underline-offset-4 bg-transparent"
                    >
                      {seg.text}
                    </span>
                  ) : (
                    <span key={idx}>{seg.text}</span>
                  )
                )}
              </span>
              <button
                type="button"
                onClick={(e) => handleSpeak(e, card.text, 1.0)}
                className={`inline-flex items-center align-middle ml-1.5 p-0.5 rounded text-[var(--text-muted)] hover:text-[var(--text-main)] shrink-0 cursor-pointer transition-colors ${
                  isPlayingAudio ? 'text-[var(--accent)] animate-pulse' : ''
                }`}
                title="Nghe phát âm"
              >
                <Volume2 className="w-3.5 h-3.5" />
              </button>
            </p>

            {timeFormatted && card.url && (
              <a
                href={card.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                title={`Mở video YouTube tại ${timeFormatted}`}
                className="inline-flex items-center gap-0.5 text-[11px] font-mono font-medium text-[var(--accent)] hover:underline shrink-0"
              >
                <Play className="w-2.5 h-2.5 fill-current" />
                <span>{timeFormatted}</span>
              </a>
            )}
          </div>

          {/* Element 2: Vietnamese Translation */}
          <p className="text-xs sm:text-sm text-[var(--text-muted)] truncate">
            {card.translation ||
              (card.phraseTranslation
                ? `${card.keyPhrase}: ${card.phraseTranslation}`
                : 'Chưa có bản dịch')}
          </p>
        </div>

        {/* Quiet Actions: Hover to Reveal on Desktop */}
        <div
          onClick={(e) => e.stopPropagation()}
          className="opacity-100 sm:opacity-0 sm:group-hover:opacity-100 sm:focus-within:opacity-100 transition-opacity duration-150 flex items-center gap-1 shrink-0"
        >
          <button
            type="button"
            onClick={(e) => handleSpeak(e, card.text, 1.0)}
            className={`p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-muted)] cursor-pointer transition-colors ${
              isPlayingAudio ? 'text-[var(--accent)]' : ''
            }`}
            title="Nghe phát âm"
          >
            <Volume2 className={`w-4 h-4 ${isPlayingAudio ? 'animate-pulse' : ''}`} />
          </button>

          <button
            type="button"
            onClick={handleCopyText}
            className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-muted)] cursor-pointer transition-colors"
            title="Sao chép"
          >
            {copiedText ? (
              <Check className="w-4 h-4 text-emerald-500" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </button>

          <button
            type="button"
            onClick={() => onToggleFavorite(card.id, !card.isFavorite)}
            className={`p-1.5 rounded-lg cursor-pointer transition-colors ${
              card.isFavorite
                ? 'text-amber-500'
                : 'text-[var(--text-muted)] hover:text-amber-500 hover:bg-[var(--bg-muted)]'
            }`}
            title={card.isFavorite ? 'Bỏ yêu thích' : 'Đánh dấu yêu thích'}
          >
            <Star className={`w-4 h-4 ${card.isFavorite ? 'fill-current' : ''}`} />
          </button>

          <button
            type="button"
            onClick={() => onEdit(card)}
            className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-muted)] cursor-pointer transition-colors"
            title="Chỉnh sửa & xem ví dụ"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => {
              if (confirm('Bạn có chắc muốn xoá câu này?')) onDelete(card.id);
            }}
            className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-rose-500 hover:bg-[var(--bg-muted)] cursor-pointer transition-colors"
            title="Xoá câu"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </article>
    );
  }

  /* -------------------------------------------------------------
   * 2. MINIMALIST GRID VIEW (2-Element Rule & Hover to reveal)
   * ------------------------------------------------------------- */
  return (
    <article
      onClick={() => onEdit(card)}
      className={`group relative p-4.5 rounded-2xl border transition-all cursor-pointer font-sans select-none flex flex-col justify-between ${
        card.isFavorite
          ? 'border-amber-400/50 bg-[var(--bg-card)]'
          : 'border-[var(--border-subtle)] hover:border-[var(--border-default)] bg-[var(--bg-card)]'
      }`}
    >
      <div className="space-y-2">
        {/* Source Video & Timestamp Link */}
        <div className="flex items-center justify-between text-xs text-[var(--text-muted)] pb-1">
          <span className="truncate max-w-[180px] sm:max-w-[220px] text-[11px] text-[var(--text-faint)]">
            {cleanTitle(card.videoTitle) || 'YouTube Video'}
          </span>

          {timeFormatted && card.url && (
            <a
              href={card.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              title={`Mở video tại ${timeFormatted}`}
              className="inline-flex items-center gap-0.5 text-[11px] font-mono font-medium text-[var(--accent)] hover:underline shrink-0"
            >
              <Play className="w-2.5 h-2.5 fill-current" />
              <span>{timeFormatted}</span>
            </a>
          )}
        </div>

        {/* Element 1: English Sentence with inline speaker */}
        <p className="text-base font-semibold text-[var(--text-main)] leading-snug tracking-tight">
          {textSegments.map((seg, idx) =>
            seg.match ? (
              <span
                key={idx}
                className="text-amber-500 dark:text-amber-400 font-semibold underline decoration-amber-500/40 underline-offset-4 bg-transparent"
              >
                {seg.text}
              </span>
            ) : (
              <span key={idx}>{seg.text}</span>
            )
          )}
          <button
            type="button"
            onClick={(e) => handleSpeak(e, card.text, 1.0)}
            className={`inline-flex items-center align-middle ml-1.5 p-0.5 rounded text-[var(--text-muted)] hover:text-[var(--text-main)] cursor-pointer transition-colors ${
              isPlayingAudio ? 'text-[var(--accent)] animate-pulse' : ''
            }`}
            title="Nghe phát âm"
          >
            <Volume2 className="w-3.5 h-3.5" />
          </button>
        </p>

        {/* Element 2: Vietnamese Translation */}
        <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed">
          {card.translation || card.phraseTranslation || 'Chưa có bản dịch'}
        </p>
      </div>

      {/* Action Bar: Hover to reveal on desktop */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="opacity-100 sm:opacity-0 sm:group-hover:opacity-100 sm:focus-within:opacity-100 transition-opacity duration-150 pt-3 mt-3 border-t border-[var(--border-subtle)] flex items-center justify-between"
      >
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={(e) => handleSpeak(e, card.text, 1.0)}
            className={`p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-muted)] cursor-pointer transition-colors ${
              isPlayingAudio ? 'text-[var(--accent)]' : ''
            }`}
            title="Nghe phát âm"
          >
            <Volume2 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleCopyText}
            className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-muted)] cursor-pointer transition-colors"
            title="Sao chép"
          >
            {copiedText ? (
              <Check className="w-4 h-4 text-emerald-500" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </button>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onToggleFavorite(card.id, !card.isFavorite)}
            className={`p-1.5 rounded-lg cursor-pointer transition-colors ${
              card.isFavorite
                ? 'text-amber-500'
                : 'text-[var(--text-muted)] hover:text-amber-500 hover:bg-[var(--bg-muted)]'
            }`}
            title={card.isFavorite ? 'Bỏ yêu thích' : 'Yêu thích'}
          >
            <Star className={`w-4 h-4 ${card.isFavorite ? 'fill-current' : ''}`} />
          </button>
          <button
            type="button"
            onClick={() => onEdit(card)}
            className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-muted)] cursor-pointer transition-colors"
            title="Chỉnh sửa & xem chi tiết"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => {
              if (confirm('Bạn có chắc muốn xoá câu này?')) onDelete(card.id);
            }}
            className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-rose-500 hover:bg-[var(--bg-muted)] cursor-pointer transition-colors"
            title="Xoá"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </article>
  );
}
