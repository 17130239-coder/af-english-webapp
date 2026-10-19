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
  ChevronRight,
  ChevronDown,
} from 'lucide-react';
import {
  parseYouTubeTimestamp,
  formatVideoTime,
  formatRelativeTime,
  splitByPhrase,
  cleanTitle,
} from '@/presentation/utils/formatters';
import { SpeechSynthesisService } from '@/infrastructure/services/speech-synthesis.service';
import { useToast } from '@/presentation/components/ui/Toast';

interface CardItemProps {
  card: SubtitleCard;
  isSelected?: boolean;
  onToggleSelect?: (id: string) => void;
  onToggleFavorite: (id: string, isFav: boolean) => void;
  onEdit: (card: SubtitleCard) => void;
  onDelete: (id: string) => void;
  layoutMode?: LayoutMode;
}

export function CardItem({
  card,
  isSelected = false,
  onToggleSelect,
  onToggleFavorite,
  onEdit,
  onDelete,
  layoutMode = 'grid',
}: CardItemProps) {
  const { showToast } = useToast();
  const [copiedText, setCopiedText] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isExamplesOpen, setIsExamplesOpen] = useState(false);

  const ytSeconds = parseYouTubeTimestamp(card.url);
  const timeFormatted = ytSeconds !== null ? formatVideoTime(ytSeconds) : null;
  const textSegments = splitByPhrase(card.text, card.keyPhrase);

  const examplesList =
    card.examples && card.examples.length > 0
      ? card.examples
      : card.exampleSentence
      ? [
          {
            context: 'Ví dụ',
            sentence: card.exampleSentence,
            translation: card.exampleTranslation || '',
          },
        ]
      : [];

  const hasKeyPhrase = Boolean(card.keyPhrase);
  const synonymsList = Array.isArray(card.synonyms) ? card.synonyms : [];
  const hasSynonyms = synonymsList.length > 0;
  const hasExplanation = Boolean(card.explanation);
  const hasExamples = examplesList.length > 0;

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
   * 1. LIST VIEW (Tape / Compact mode)
   * ------------------------------------------------------------- */
  if (layoutMode === 'tape' || layoutMode === 'compact') {
    return (
      <article
        onClick={() => onEdit(card)}
        className={`group relative py-3.5 px-3 sm:px-4 border-b border-[var(--border-default)] hover:bg-[var(--bg-card)] transition-colors cursor-pointer flex items-center justify-between gap-4 font-sans select-none ${
          isSelected ? 'bg-[var(--accent-subtle)]' : ''
        }`}
      >
        <div className="flex items-center gap-2.5 flex-1 min-w-0">
          {onToggleSelect && (
            <input
              type="checkbox"
              checked={isSelected}
              onClick={(e) => e.stopPropagation()}
              onChange={() => onToggleSelect(card.id)}
              className="w-3.5 h-3.5 rounded border border-[var(--border-default)] accent-[var(--accent)] cursor-pointer shrink-0"
              title="Chọn thẻ"
            />
          )}

          <div className="flex-1 min-w-0 space-y-1">
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

            <p className="text-xs sm:text-sm text-[var(--text-muted)] truncate">
              {card.translation ||
                (card.phraseTranslation
                  ? `${card.keyPhrase}: ${card.phraseTranslation}`
                  : 'Chưa có bản dịch')}
            </p>
          </div>
        </div>

        {/* Quiet Actions */}
        <div
          onClick={(e) => e.stopPropagation()}
          className="opacity-100 sm:opacity-0 sm:group-hover:opacity-100 sm:focus-within:opacity-100 transition-opacity duration-150 flex items-center gap-1 shrink-0"
        >
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
            title="Xoá câu"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </article>
    );
  }

  /* -------------------------------------------------------------
   * 2. GRID VIEW (100% Consistent with AF English Extension Dashboard)
   * ------------------------------------------------------------- */
  return (
    <article
      onClick={() => onEdit(card)}
      className={`group relative rounded-xl p-4 sm:p-4.5 border transition-all duration-150 cursor-pointer font-sans select-none flex flex-col justify-between h-full bg-[var(--bg-card)] ${
        isSelected
          ? 'border-[var(--accent)] ring-1 ring-[var(--accent)] bg-[var(--accent-subtle)]'
          : card.isFavorite
          ? 'border-amber-500/30 hover:border-amber-500/50'
          : 'border-[var(--border-default)] hover:border-[var(--border-highlight)]'
      }`}
    >
      {/* Top Content Block */}
      <div className="flex flex-col flex-1 gap-2.5">
        {/* DÒNG 1: Card Header (Metadata & Hover Actions) */}
        <div className="flex items-center justify-between gap-2 min-h-[22px]">
          {/* Header Left: Selection Checkbox + Play & Video Title */}
          <div className="flex items-center gap-1.5 min-w-0 flex-1">
            {onToggleSelect && (
              <label
                onClick={(e) => e.stopPropagation()}
                className={`inline-flex items-center cursor-pointer transition-opacity ${
                  isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                }`}
                title="Chọn thẻ"
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => onToggleSelect(card.id)}
                  className="w-3.5 h-3.5 rounded border border-[var(--border-default)] accent-[var(--accent)] cursor-pointer"
                />
              </label>
            )}

            {/* Play & Video Meta Link */}
            <a
              href={card.url || '#'}
              target={card.url ? '_blank' : undefined}
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              title={
                timeFormatted
                  ? `Mở video YouTube tại ${timeFormatted} (${cleanTitle(card.videoTitle)})`
                  : `Mở video: ${cleanTitle(card.videoTitle)}`
              }
              className="inline-flex items-center gap-1 text-[11px] text-[var(--text-muted)] hover:text-[var(--text-main)] truncate transition-colors max-w-[200px] sm:max-w-[260px]"
            >
              <span className="text-[9px] text-[var(--text-muted)]">▶</span>
              {timeFormatted && (
                <>
                  <span className="font-mono text-[11px] text-[var(--text-muted)]">
                    {timeFormatted}
                  </span>
                  <span className="text-[var(--text-faint)]">·</span>
                </>
              )}
              <span className="truncate">{cleanTitle(card.videoTitle) || 'YouTube Video'}</span>
            </a>
          </div>

          {/* Header Right: Date by default, replaced by Actions on Hover */}
          <div onClick={(e) => e.stopPropagation()} className="flex items-center shrink-0">
            {/* Saved Relative Date */}
            <span className="text-[11px] font-mono text-[var(--text-muted)] group-hover:hidden transition-opacity">
              {formatRelativeTime(card.timestamp)}
            </span>

            {/* Hover Actions Group */}
            <div className="hidden group-hover:flex items-center gap-0.5">
              <button
                type="button"
                onClick={() => onToggleFavorite(card.id, !card.isFavorite)}
                className={`w-6 h-6 rounded flex items-center justify-center cursor-pointer transition-colors ${
                  card.isFavorite
                    ? 'text-amber-500'
                    : 'text-[var(--text-muted)] hover:text-amber-500 hover:bg-[var(--bg-muted)]'
                }`}
                title={card.isFavorite ? 'Bỏ yêu thích' : 'Yêu thích'}
              >
                <Star className={`w-3.5 h-3.5 ${card.isFavorite ? 'fill-current' : ''}`} />
              </button>

              <button
                type="button"
                onClick={() => onEdit(card)}
                className="w-6 h-6 rounded flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-muted)] cursor-pointer transition-colors"
                title="Chỉnh sửa câu"
              >
                <Edit2 className="w-3 h-3" />
              </button>

              <button
                type="button"
                onClick={handleCopyText}
                className="w-6 h-6 rounded flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-muted)] cursor-pointer transition-colors"
                title="Sao chép câu tiếng Anh"
              >
                {copiedText ? (
                  <Check className="w-3 h-3 text-emerald-500" />
                ) : (
                  <Copy className="w-3 h-3" />
                )}
              </button>

              <button
                type="button"
                onClick={(e) => handleSpeak(e, card.text, 1.0)}
                className={`w-6 h-6 rounded flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-muted)] cursor-pointer transition-colors ${
                  isPlayingAudio ? 'text-[var(--accent)] animate-pulse' : ''
                }`}
                title="Nghe phát âm"
              >
                <Volume2 className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={() => {
                  if (confirm('Bạn có chắc muốn xoá câu này?')) onDelete(card.id);
                }}
                className="w-6 h-6 rounded flex items-center justify-center text-[var(--text-muted)] hover:text-rose-500 hover:bg-rose-500/10 cursor-pointer transition-colors"
                title="Xoá câu"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>

        {/* DÒNG 2 & 3: English Sentence with Inline Speaker & Vietnamese Translation */}
        <div className="space-y-1">
          <p className="text-[14.5px] sm:text-[15px] font-medium text-[var(--text-main)] leading-relaxed tracking-tight">
            {textSegments.map((seg, idx) =>
              seg.match ? (
                <span
                  key={idx}
                  className="text-amber-500 dark:text-amber-400 font-medium underline decoration-amber-500/40 underline-offset-4 bg-transparent"
                >
                  {seg.text}
                </span>
              ) : (
                <span key={idx}>{seg.text}</span>
              )
            )}
            <span className="whitespace-nowrap">
              <button
                type="button"
                onClick={(e) => handleSpeak(e, card.text, 1.0)}
                className={`inline-flex items-center align-middle ml-1 p-0.5 rounded text-[var(--text-muted)] hover:text-[var(--text-main)] cursor-pointer transition-colors ${
                  isPlayingAudio ? 'text-[var(--accent)] animate-pulse' : ''
                }`}
                title="Phát âm tiếng Anh (TTS)"
              >
                <Volume2 className="w-3.5 h-3.5" />
              </button>
            </span>
          </p>

          {card.translation && (
            <p className="text-[13px] sm:text-[13.5px] text-[var(--text-muted)] leading-relaxed">
              {card.translation}
            </p>
          )}
        </div>

        {/* DÒNG 4, 5, 6: De-boxed Vocabulary Block (Keyphrase, Synonyms & Note) */}
        {(hasKeyPhrase || hasSynonyms || hasExplanation) && (
          <div className="pt-2 mt-1 border-t border-[var(--border-subtle)] space-y-1.5 text-xs">
            {/* 4.1 Keyphrase Row */}
            {hasKeyPhrase && (
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="font-semibold text-amber-500 dark:text-amber-400">
                  {card.keyPhrase}
                </span>
                {card.phraseTranslation && (
                  <>
                    <span className="text-[var(--text-faint)]">→</span>
                    <span className="text-[var(--text-main)] font-medium">
                      {card.phraseTranslation}
                    </span>
                  </>
                )}
                <button
                  type="button"
                  onClick={(e) => handleSpeak(e, card.keyPhrase || '', 1.0)}
                  className="inline-flex items-center p-0.5 rounded text-[var(--text-muted)] hover:text-[var(--text-main)] cursor-pointer"
                  title="Nghe phát âm cụm từ"
                >
                  <Volume2 className="w-3 h-3" />
                </button>
              </div>
            )}

            {/* 4.2 Synonyms Row */}
            {hasSynonyms && (
              <div className="flex items-center gap-1 text-[var(--text-muted)] flex-wrap">
                <span className="text-[var(--text-faint)]">Đồng nghĩa:</span>
                {synonymsList.map((syn, sIdx) => (
                  <React.Fragment key={sIdx}>
                    <button
                      type="button"
                      onClick={(e) => handleSpeak(e, syn, 1.0)}
                      className="text-[var(--text-body)] hover:text-[var(--accent)] hover:underline cursor-pointer transition-colors"
                      title="Click để nghe phát âm"
                    >
                      {syn}
                    </button>
                    {sIdx < synonymsList.length - 1 && (
                      <span className="text-[var(--text-faint)]">,</span>
                    )}
                  </React.Fragment>
                ))}
              </div>
            )}

            {/* 4.3 Explanation / Usage Quote */}
            {hasExplanation && (
              <div className="pl-2 border-l-2 border-[var(--border-default)] text-[var(--text-muted)] italic text-[11.5px] leading-relaxed">
                {card.explanation}
              </div>
            )}
          </div>
        )}
      </div>

      {/* DÒNG 7: Ví dụ minh họa Accordion (Sát đáy thẻ mt-auto pt-2.5) */}
      {hasExamples && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="mt-auto pt-2.5 border-t border-[var(--border-subtle)]"
        >
          <button
            type="button"
            onClick={() => setIsExamplesOpen((prev) => !prev)}
            className="w-full flex items-center justify-between text-xs text-[var(--text-muted)] hover:text-[var(--text-main)] cursor-pointer py-0.5 transition-colors"
          >
            <span className="flex items-center gap-1">
              {isExamplesOpen ? (
                <ChevronDown className="w-3.5 h-3.5" />
              ) : (
                <ChevronRight className="w-3.5 h-3.5" />
              )}
              <span>{isExamplesOpen ? 'Thu gọn ví dụ' : `Xem ${examplesList.length} ví dụ ngữ cảnh`}</span>
            </span>
          </button>

          {isExamplesOpen && (
            <div className="mt-2 space-y-2 pt-1">
              {examplesList.map((ex, exIdx) => (
                <div
                  key={exIdx}
                  className="p-2 rounded-md bg-[var(--bg-muted)]/50 border border-[var(--border-subtle)] space-y-1 text-xs"
                >
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-[10px] font-medium px-1.5 py-0.2 rounded bg-[var(--bg-elevated)] text-[var(--text-faint)] border border-[var(--border-subtle)]">
                      {ex.context || `Ngữ cảnh ${exIdx + 1}`}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => handleSpeak(e, ex.sentence, 1.0)}
                      className="p-0.5 rounded text-[var(--text-muted)] hover:text-[var(--text-main)] cursor-pointer"
                      title="Phát âm ví dụ"
                    >
                      <Volume2 className="w-3 h-3" />
                    </button>
                  </div>
                  <p className="font-medium text-[var(--text-main)] text-[12px] leading-normal">
                    {ex.sentence}
                  </p>
                  {ex.translation && (
                    <p className="text-[11.5px] text-[var(--text-muted)] leading-normal">
                      {ex.translation}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </article>
  );
}
