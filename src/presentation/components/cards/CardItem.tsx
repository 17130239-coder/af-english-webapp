'use client';

import React, { useState } from 'react';
import { SubtitleCard } from '@/types/card';
import { LayoutMode } from '@/types/filter';
import {
  Volume2,
  Copy,
  Check,
  Star,
  ChevronDown,
  ChevronUp,
  Edit2,
  Trash2,
  Play,
  Lightbulb,
} from 'lucide-react';
import {
  parseYouTubeTimestamp,
  formatVideoTime,
  splitByPhrase,
  cleanTitle,
} from '@/presentation/utils/formatters';
import { SpeechSynthesisService } from '@/infrastructure/services/speech-synthesis.service';
import { useToast } from '@/components/ui/Toast';

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
  layoutMode = 'grid',
}: CardItemProps) {
  const { showToast } = useToast();
  const [copiedText, setCopiedText] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const ytSeconds = parseYouTubeTimestamp(card.url);
  const timeFormatted = ytSeconds !== null ? formatVideoTime(ytSeconds) : null;
  const textSegments = splitByPhrase(card.text, card.keyPhrase);

  const hasContextDetails = Boolean(
    card.explanation ||
    (card.examples && card.examples.length > 0) ||
    card.exampleSentence ||
    (card.synonyms && card.synonyms.length > 0)
  );

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
   * 1. COMPACT VIEW (Dense table row)
   * ------------------------------------------------------------- */
  if (layoutMode === 'compact') {
    return (
      <article
        className={`notebook-card px-4 py-2.5 flex flex-col md:flex-row md:items-center justify-between gap-2.5 ${
          card.isFavorite ? 'border-amber-400/60 dark:border-amber-600/50' : ''
        }`}
      >
        <div className="flex-1 min-w-0 space-y-0.5">
          <div className="flex items-center gap-2 text-xs">
            {timeFormatted && card.url ? (
              <a
                href={card.url}
                target="_blank"
                rel="noopener noreferrer"
                title={`Mở video YouTube tại ${timeFormatted}`}
                className="inline-flex items-center gap-1 text-[11px] font-medium text-[var(--accent)] hover:underline"
              >
                <Play className="w-2.5 h-2.5 fill-current" />
                <span>{timeFormatted}</span>
              </a>
            ) : null}

            {card.keyPhrase && (
              <span className="font-semibold text-[var(--accent-text)] dark:text-[var(--accent)] truncate">
                {card.keyPhrase}
              </span>
            )}

            {card.videoTitle && (
              <span className="text-[11px] text-[var(--text-faint)] truncate max-w-xs">
                · {cleanTitle(card.videoTitle)}
              </span>
            )}
          </div>

          <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3">
            <p className="text-sm font-medium text-[var(--text-main)] truncate">
              {textSegments.map((seg, idx) =>
                seg.match ? (
                  <mark
                    key={idx}
                    className="bg-[var(--highlight-bg)] text-[var(--highlight-text)] font-semibold px-1 py-0.2 rounded mx-0.5"
                  >
                    {seg.text}
                  </mark>
                ) : (
                  <span key={idx}>{seg.text}</span>
                )
              )}
            </p>

            {card.translation && (
              <span className="text-xs text-[var(--text-muted)] italic truncate shrink-0 max-w-sm">
                &quot;{card.translation}&quot;
              </span>
            )}
          </div>
        </div>

        {/* Quiet controls */}
        <div className="flex items-center gap-1 shrink-0 self-end md:self-center">
          <button
            type="button"
            onClick={(e) => handleSpeak(e, card.text, 1.0)}
            className={`p-1.5 rounded-md cursor-pointer transition-colors ${
              isPlayingAudio
                ? 'text-[var(--accent)] bg-[var(--accent-subtle)]'
                : 'text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-muted)]'
            }`}
            title="Nghe phát âm"
          >
            <Volume2 className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={handleCopyText}
            className="p-1.5 rounded-md text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-muted)] cursor-pointer transition-colors"
            title="Sao chép"
          >
            {copiedText ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
          </button>

          <button
            type="button"
            onClick={() => onToggleFavorite(card.id, !card.isFavorite)}
            className={`p-1.5 rounded-md cursor-pointer transition-colors ${
              card.isFavorite
                ? 'text-amber-500'
                : 'text-[var(--text-faint)] hover:text-amber-500'
            }`}
            title={card.isFavorite ? 'Bỏ yêu thích' : 'Yêu thích'}
          >
            <Star className={`w-4 h-4 ${card.isFavorite ? 'fill-current' : ''}`} />
          </button>

          <button
            type="button"
            onClick={() => onEdit(card)}
            className="p-1.5 rounded-md text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-muted)] cursor-pointer transition-colors"
            title="Sửa"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => {
              if (confirm('Bạn có chắc muốn xoá câu này?')) onDelete(card.id);
            }}
            className="p-1.5 rounded-md text-zinc-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 cursor-pointer transition-colors"
            title="Xoá"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </article>
    );
  }

  /* -------------------------------------------------------------
   * 2. GRID & TAPE VIEW: Human-crafted Index Card
   * ------------------------------------------------------------- */
  return (
    <article
      className={`notebook-card p-5 flex flex-col justify-between ${
        card.isFavorite ? 'border-amber-400/60 dark:border-amber-600/50 shadow-2xs' : 'shadow-2xs'
      }`}
    >
      <div className="space-y-3">
        {/* Card Header: Video Source Breadcrumb & Actions */}
        <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-[var(--border-subtle)]">
          <div className="flex items-center gap-1.5 min-w-0 text-xs text-[var(--text-muted)]">
            {card.url ? (
              <a
                href={card.url}
                target="_blank"
                rel="noopener noreferrer"
                title={`Mở YouTube: ${cleanTitle(card.videoTitle)}`}
                className="hover:text-[var(--text-main)] truncate transition-colors max-w-[200px] sm:max-w-[260px]"
              >
                {cleanTitle(card.videoTitle) || 'YouTube'}
              </a>
            ) : (
              <span className="truncate max-w-[200px] sm:max-w-[260px]">
                {cleanTitle(card.videoTitle) || 'Thủ công'}
              </span>
            )}

            {timeFormatted && card.url && (
              <>
                <span className="text-[var(--text-faint)]">·</span>
                <a
                  href={card.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={`Phát tại ${timeFormatted}`}
                  className="inline-flex items-center gap-0.5 font-medium text-[var(--accent)] hover:underline shrink-0"
                >
                  <Play className="w-2.5 h-2.5 fill-current" />
                  <span>{timeFormatted}</span>
                </a>
              </>
            )}
          </div>

          {/* Quiet actions */}
          <div className="flex items-center gap-1 shrink-0">
            <button
              type="button"
              onClick={() => onToggleFavorite(card.id, !card.isFavorite)}
              className={`p-1 rounded-md cursor-pointer transition-colors ${
                card.isFavorite
                  ? 'text-amber-500'
                  : 'text-[var(--text-faint)] hover:text-amber-500'
              }`}
              title={card.isFavorite ? 'Bỏ yêu thích' : 'Đánh dấu yêu thích'}
            >
              <Star className={`w-4 h-4 ${card.isFavorite ? 'fill-current' : ''}`} />
            </button>

            <button
              type="button"
              onClick={() => onEdit(card)}
              className="p-1 text-[var(--text-faint)] hover:text-[var(--text-main)] rounded-md cursor-pointer transition-colors"
              title="Chỉnh sửa"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={() => {
                if (confirm('Bạn có chắc muốn xoá câu này?')) onDelete(card.id);
              }}
              className="p-1 text-[var(--text-faint)] hover:text-rose-600 rounded-md cursor-pointer transition-colors"
              title="Xoá"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* English Sentence Hero with Highlighter */}
        <div className="pt-0.5">
          <p className="text-base sm:text-lg font-medium text-[var(--text-main)] leading-relaxed tracking-tight">
            {textSegments.map((seg, idx) =>
              seg.match ? (
                <mark
                  key={idx}
                  className="bg-[var(--highlight-bg)] text-[var(--highlight-text)] font-semibold px-1.5 py-0.5 rounded mx-0.5 inline-block"
                >
                  {seg.text}
                </mark>
              ) : (
                <span key={idx}>{seg.text}</span>
              )
            )}
          </p>
        </div>

        {/* Key phrase callout line (if exists) */}
        {card.keyPhrase && (
          <div className="flex items-center gap-2 text-xs">
            <span className="font-semibold text-[var(--accent-text)] dark:text-[var(--accent)]">
              {card.keyPhrase}
            </span>
            {card.phraseTranslation && (
              <span className="text-[var(--text-muted)]">
                → {card.phraseTranslation}
              </span>
            )}
          </div>
        )}

        {/* Audio Pronunciation & Copy bar */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={(e) => handleSpeak(e, card.text, 1.0)}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-lg cursor-pointer transition-colors ${
                isPlayingAudio
                  ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-2xs'
                  : 'bg-[var(--bg-muted)] text-[var(--text-body)] hover:text-[var(--text-main)] hover:bg-[var(--border-default)]'
              }`}
              title="Phát âm tiếng Anh chuẩn"
            >
              <Volume2 className={`w-3.5 h-3.5 ${isPlayingAudio ? 'animate-pulse' : ''}`} />
              <span>{isPlayingAudio ? 'Đang đọc...' : 'Nghe'}</span>
            </button>

            <button
              type="button"
              onClick={(e) => handleSpeak(e, card.text, 0.75)}
              className="px-2 py-1 text-[11px] font-medium rounded-lg text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-muted)] cursor-pointer transition-colors"
              title="Nghe tốc độ chậm 0.75x"
            >
              0.75x
            </button>
          </div>

          <button
            type="button"
            onClick={handleCopyText}
            className="p-1.5 rounded-lg text-[var(--text-faint)] hover:text-[var(--text-main)] hover:bg-[var(--bg-muted)] cursor-pointer transition-colors"
            title="Sao chép câu tiếng Anh"
          >
            {copiedText ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Vietnamese Translation (Quiet, Natural Subtitle) */}
        {card.translation && (
          <div className="pt-2 border-t border-[var(--border-subtle)]">
            <p className="text-sm text-[var(--text-muted)] leading-relaxed">
              &quot;{card.translation}&quot;
            </p>
          </div>
        )}

        {/* Expandable Context Details (Grammar, Examples, Synonyms) */}
        {hasContextDetails && (
          <div className="pt-1">
            <button
              type="button"
              onClick={() => setShowDetails(!showDetails)}
              className="text-xs font-medium text-[var(--text-muted)] hover:text-[var(--text-main)] inline-flex items-center gap-1 cursor-pointer transition-colors"
            >
              <span>{showDetails ? 'Thu gọn chi tiết' : 'Xem ví dụ & giải thích'}</span>
              {showDetails ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>

            {showDetails && (
              <div className="mt-3 space-y-3 pt-3 border-t border-[var(--border-subtle)] text-xs">
                {/* Grammar note */}
                {card.explanation && (
                  <div className="p-3 rounded-lg bg-[var(--bg-muted)] text-[var(--text-body)] flex items-start gap-2">
                    <Lightbulb className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                    <p className="leading-relaxed">{card.explanation}</p>
                  </div>
                )}

                {/* Synonyms */}
                {card.synonyms && card.synonyms.length > 0 && (
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[var(--text-muted)]">Đồng nghĩa:</span>
                    {card.synonyms.map((syn, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={(e) => handleSpeak(e, syn, 1.0)}
                        className="px-2 py-0.5 rounded-md bg-[var(--bg-muted)] hover:bg-[var(--border-default)] text-[var(--text-body)] cursor-pointer transition-colors"
                        title={`Nghe: ${syn}`}
                      >
                        {syn}
                      </button>
                    ))}
                  </div>
                )}

                {/* Examples */}
                {((card.examples && card.examples.length > 0) || card.exampleSentence) && (
                  <div className="space-y-2">
                    {card.exampleSentence && (
                      <div className="pl-2.5 border-l-2 border-[var(--border-default)] space-y-0.5">
                        <p className="font-medium text-[var(--text-main)]">
                          {card.exampleSentence}
                        </p>
                        {card.exampleTranslation && (
                          <p className="text-[var(--text-muted)]">
                            {card.exampleTranslation}
                          </p>
                        )}
                      </div>
                    )}

                    {card.examples &&
                      card.examples.map((ex, idx) => (
                        <div
                          key={idx}
                          className="pl-2.5 border-l-2 border-[var(--border-default)] space-y-0.5"
                        >
                          <div className="flex items-center gap-1.5">
                            {ex.context && (
                              <span className="text-[10px] font-semibold text-[var(--text-faint)] uppercase tracking-wider">
                                {ex.context}
                              </span>
                            )}
                          </div>
                          <p className="font-medium text-[var(--text-main)]">
                            {ex.sentence}
                          </p>
                          {ex.translation && (
                            <p className="text-[var(--text-muted)]">
                              {ex.translation}
                            </p>
                          )}
                        </div>
                      ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </article>
  );
}
