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
  Video,
  ExternalLink,
  CheckCircle2,
  Clock,
  Hash,
} from 'lucide-react';
import {
  parseYouTubeTimestamp,
  formatVideoTime,
  splitByPhrase,
} from '@/lib/utils/formatters';
import { speakEnglish } from '@/lib/utils/speech';
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
  const [showExamples, setShowExamples] = useState(false);

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
    speakEnglish(text, () => setIsPlayingAudio(false), rate);
  };

  /* -------------------------------------------------------------
   * COMPACT VIEW: Clean Table / Dense Row
   * ------------------------------------------------------------- */
  if (layoutMode === 'compact') {
    return (
      <article
        className={`phoenix-card px-4 py-3 flex flex-col md:flex-row md:items-center justify-between gap-3 ${
          card.isFavorite
            ? 'border-amber-300 dark:border-amber-900/60'
            : ''
        }`}
      >
        {/* Content Column */}
        <div className="flex-1 min-w-0 space-y-1">
          <div className="flex items-center gap-2 text-xs">
            {card.url ? (
              <a
                href={card.url}
                target="_blank"
                rel="noopener noreferrer"
                title={`Mở video YouTube: ${card.videoTitle}${timeFormatted ? ` (tại ${timeFormatted})` : ''}`}
                className="badge-phoenix badge-phoenix-primary gap-1 shrink-0 hover:underline"
              >
                <Video className="w-3 h-3 text-[#ea580c]" />
                <span>{timeFormatted || 'YouTube'}</span>
              </a>
            ) : (
              <span
                title={card.videoTitle}
                className="badge-phoenix badge-phoenix-secondary shrink-0"
              >
                <Video className="w-3 h-3" />
              </span>
            )}

            {card.keyPhrase && (
              <span className="font-bold text-[#ea580c] dark:text-[#fb923c] truncate">
                {card.keyPhrase}
              </span>
            )}

            {/* Translation Status Indicator Icon */}
            {card.translation ? (
              <span
                title="Đã có bản dịch tiếng Việt"
                className="text-[#25b003] inline-flex items-center cursor-help shrink-0"
              >
                <CheckCircle2 className="w-3.5 h-3.5 stroke-[2.2]" />
              </span>
            ) : (
              <span
                title="Chờ bản dịch tiếng Việt"
                className="text-[#6e7891] dark:text-[#8a94ad] inline-flex items-center cursor-help shrink-0"
              >
                <Clock className="w-3.5 h-3.5 stroke-[2]" />
              </span>
            )}
          </div>

          <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3">
            <p className="text-sm font-medium text-[#141824] dark:text-[#eff2f6] truncate">
              {textSegments.map((seg, idx) =>
                seg.match ? (
                  <mark
                    key={idx}
                    className="bg-[#fff1eb] text-[#9a3412] dark:bg-[#2b170e] dark:text-[#fb923c] font-semibold px-1 py-0.5 rounded mx-0.5"
                  >
                    {seg.text}
                  </mark>
                ) : (
                  <span key={idx}>{seg.text}</span>
                )
              )}
            </p>

            {card.translation && (
              <span className="text-xs text-[#6e7891] dark:text-[#8a94ad] italic truncate shrink-0 max-w-sm">
                &quot;{card.translation}&quot;
              </span>
            )}
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 shrink-0 self-end md:self-center">
          <button
            type="button"
            onClick={(e) => handleSpeak(e, card.text, 1.0)}
            className={`p-1.5 rounded-lg cursor-pointer transition-colors ${
              isPlayingAudio
                ? 'bg-[#ea580c] text-white'
                : 'text-[#ea580c] hover:bg-[#fff1eb] dark:hover:bg-[#2b170e]'
            }`}
            title="Phát âm"
          >
            <Volume2 className={`w-4 h-4 ${isPlayingAudio ? 'animate-pulse' : ''}`} />
          </button>

          <button
            type="button"
            onClick={handleCopyText}
            className="p-1.5 rounded-lg text-[#6e7891] hover:text-[#141824] dark:hover:text-white hover:bg-[#eff2f6] dark:hover:bg-[#1f232e] cursor-pointer transition-colors"
            title="Sao chép"
          >
            {copiedText ? (
              <Check className="w-4 h-4 text-[#25b003]" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </button>

          <button
            type="button"
            onClick={() => onToggleFavorite(card.id, !card.isFavorite)}
            className={`p-1.5 rounded-lg cursor-pointer transition-colors ${
              card.isFavorite
                ? 'text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-950/40'
                : 'text-[#6e7891] hover:text-amber-500 hover:bg-[#eff2f6] dark:hover:bg-[#1f232e]'
            }`}
            title={card.isFavorite ? 'Bỏ yêu thích' : 'Yêu thích'}
          >
            <Star className={`w-4 h-4 ${card.isFavorite ? 'fill-current' : ''}`} />
          </button>

          <button
            type="button"
            onClick={() => onEdit(card)}
            className="p-1.5 rounded-lg text-[#6e7891] hover:text-[#141824] dark:hover:text-white hover:bg-[#eff2f6] dark:hover:bg-[#1f232e] cursor-pointer transition-colors"
            title="Chỉnh sửa"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => {
              if (confirm('Bạn có chắc muốn xoá câu này khỏi hệ thống?')) onDelete(card.id);
            }}
            className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 cursor-pointer transition-colors"
            title="Xoá"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </article>
    );
  }

  /* -------------------------------------------------------------
   * GRID & TAPE VIEW: Human-Crafted Phoenix Card
   * ------------------------------------------------------------- */
  return (
    <article
      className={`phoenix-card p-5 flex flex-col justify-between ${
        card.isFavorite ? 'border-amber-300 dark:border-amber-900/60' : ''
      }`}
    >
      <div className="space-y-3.5">
        {/* Card Header Strip: Video Link (Icon + Tooltip) & Status + Star */}
        <div className="flex items-center justify-between pb-3 border-b border-[#e3e6ed] dark:border-[#272f3d] gap-2">
          <div className="flex items-center gap-2 min-w-0">
            {card.url ? (
              <a
                href={card.url}
                target="_blank"
                rel="noopener noreferrer"
                title={`Mở video YouTube: ${card.videoTitle}${timeFormatted ? ` (tại ${timeFormatted})` : ''}`}
                className="badge-phoenix badge-phoenix-primary gap-1.5 shrink-0 hover:underline"
              >
                <Video className="w-3.5 h-3.5 text-[#ea580c]" />
                {timeFormatted ? <span>{timeFormatted}</span> : <span>YouTube</span>}
                <ExternalLink className="w-2.5 h-2.5 opacity-60" />
              </a>
            ) : (
              <span
                title={card.videoTitle}
                className="badge-phoenix badge-phoenix-secondary gap-1.5 shrink-0 cursor-help"
              >
                <Video className="w-3.5 h-3.5" />
                <span>Video</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {card.translation ? (
              <span
                title="Đã có bản dịch tiếng Việt"
                className="p-1 rounded-md text-[#25b003] hover:bg-[#d9fbd0]/50 dark:hover:bg-[#1d2527] transition-colors cursor-help inline-flex items-center"
              >
                <CheckCircle2 className="w-4 h-4 stroke-[2.2]" />
              </span>
            ) : (
              <span
                title="Chờ bản dịch tiếng Việt"
                className="p-1 rounded-md text-[#6e7891] dark:text-[#8a94ad] hover:bg-[#eff2f6] dark:hover:bg-[#1f232e] transition-colors cursor-help inline-flex items-center"
              >
                <Clock className="w-4 h-4 stroke-[2]" />
              </span>
            )}

            <button
              type="button"
              onClick={() => onToggleFavorite(card.id, !card.isFavorite)}
              className={`p-1.5 rounded-lg cursor-pointer transition-colors ${
                card.isFavorite
                  ? 'text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-950/40'
                  : 'text-[#6e7891] hover:text-amber-500 hover:bg-[#eff2f6] dark:hover:bg-[#1f232e]'
              }`}
              title={card.isFavorite ? 'Bỏ yêu thích' : 'Đánh dấu yêu thích'}
            >
              <Star className={`w-4 h-4 ${card.isFavorite ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>

        {/* Target Key Phrase Prompt Block */}
        {card.keyPhrase && (
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold text-[#ea580c] dark:text-[#fb923c] bg-[#fff1eb] dark:bg-[#2b170e] px-2 py-0.5 rounded">
              {card.keyPhrase}
            </span>
            {card.phraseTranslation && (
              <span className="text-xs text-[#525b75] dark:text-[#9fa6bc] font-medium">
                — {card.phraseTranslation}
              </span>
            )}
          </div>
        )}

        {/* English Subtitle Sentence */}
        <div className="py-0.5">
          <p className="text-base sm:text-lg font-semibold text-[#141824] dark:text-[#eff2f6] leading-relaxed">
            {textSegments.map((seg, idx) =>
              seg.match ? (
                <mark
                  key={idx}
                  className="bg-[#fff1eb] text-[#9a3412] dark:bg-[#2b170e] dark:text-[#fb923c] font-bold px-1.5 py-0.5 rounded mx-0.5 inline-block"
                >
                  {seg.text}
                </mark>
              ) : (
                <span key={idx}>{seg.text}</span>
              )
            )}
          </p>
        </div>

        {/* Audio Action Row */}
        <div className="flex items-center justify-between bg-[#f5f7fa] dark:bg-[#10131d] px-3 py-2 rounded-lg border border-[#e3e6ed] dark:border-[#272f3d]">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={(e) => handleSpeak(e, card.text, 1.0)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md bg-[#ea580c] hover:bg-[#c2410c] text-white shadow-2xs cursor-pointer transition-colors"
              title="Phát âm tốc độ chuẩn"
            >
              <Volume2 className={`w-3.5 h-3.5 ${isPlayingAudio ? 'animate-bounce' : ''}`} />
              <span>{isPlayingAudio ? 'Đang đọc...' : 'Nghe 1.0x'}</span>
            </button>

            <button
              type="button"
              onClick={(e) => handleSpeak(e, card.text, 0.75)}
              className="inline-flex items-center px-2 py-1.5 text-xs font-medium rounded-md bg-white dark:bg-[#141824] hover:bg-[#eff2f6] dark:hover:bg-[#1f232e] text-[#525b75] dark:text-[#9fa6bc] border border-[#cbd0dd] dark:border-[#272f3d] cursor-pointer transition-colors"
              title="Phát âm tốc độ chậm"
            >
              <span>0.75x</span>
            </button>
          </div>

          <button
            type="button"
            onClick={handleCopyText}
            className="p-1.5 rounded-md text-[#6e7891] hover:text-[#141824] dark:hover:text-white hover:bg-white dark:hover:bg-[#141824] border border-transparent hover:border-[#cbd0dd] dark:border-[#272f3d] cursor-pointer transition-colors"
            title="Sao chép câu"
          >
            {copiedText ? (
              <Check className="w-4 h-4 text-[#25b003]" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Vietnamese Translation Callout */}
        {card.translation && (
          <div className="p-3 rounded-lg bg-[#f5f7fa] dark:bg-[#10131d] border-l-3 border-[#ea580c]">
            <span className="block text-[11px] font-bold text-[#6e7891] dark:text-[#8a94ad] uppercase tracking-wider mb-1">
              Bản dịch tiếng Việt
            </span>
            <p className="text-sm font-medium text-[#31374a] dark:text-[#d1d5e0] leading-relaxed">
              &quot;{card.translation}&quot;
            </p>
          </div>
        )}

        {/* Grammar / Context Explanation */}
        {card.explanation && (
          <div className="p-3 rounded-lg bg-[#f8f9fc] dark:bg-[#121622] border border-[#e3e6ed] dark:border-[#272f3d] text-xs text-[#525b75] dark:text-[#9fa6bc] leading-relaxed">
            <span className="font-bold text-[#141824] dark:text-[#eff2f6] mr-1">
              Ghi chú:
            </span>
            <span>{card.explanation}</span>
          </div>
        )}

        {/* Synonyms Chips */}
        {card.synonyms && card.synonyms.length > 0 && (
          <div className="flex items-center gap-1.5 flex-wrap text-xs text-[#6e7891] dark:text-[#8a94ad]">
            <span className="font-semibold">Từ đồng nghĩa:</span>
            {card.synonyms.map((syn, idx) => (
              <button
                key={idx}
                type="button"
                onClick={(e) => handleSpeak(e, syn, 1.0)}
                className="badge-phoenix badge-phoenix-secondary hover:border-[#ea580c] hover:text-[#ea580c] cursor-pointer transition-colors"
                title={`Bấm để nghe từ: ${syn}`}
              >
                {syn}
              </button>
            ))}
          </div>
        )}

        {/* Context Examples Collapsible */}
        {((card.examples && card.examples.length > 0) || card.exampleSentence) && (
          <div className="pt-1">
            <button
              type="button"
              onClick={() => setShowExamples(!showExamples)}
              className="text-xs font-semibold text-[#ea580c] dark:text-[#fb923c] hover:underline inline-flex items-center gap-1 cursor-pointer"
            >
              <span>{showExamples ? 'Ẩn ví dụ thực tế' : 'Xem thêm ví dụ thực tế'}</span>
              {showExamples ? (
                <ChevronUp className="w-3.5 h-3.5" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5" />
              )}
            </button>

            {showExamples && (
              <div className="mt-2 space-y-2 pl-3 border-l-2 border-[#cbd0dd] dark:border-[#272f3d]">
                {card.exampleSentence && (
                  <div>
                    <p className="text-xs font-medium text-[#141824] dark:text-[#eff2f6] leading-relaxed">
                      • {card.exampleSentence}
                    </p>
                    {card.exampleTranslation && (
                      <p className="text-xs text-[#6e7891] dark:text-[#8a94ad] italic pl-2">
                        &quot;{card.exampleTranslation}&quot;
                      </p>
                    )}
                  </div>
                )}
                {card.examples && card.examples.map((ex, idx) => (
                  <div key={idx}>
                    <p className="text-xs font-medium text-[#141824] dark:text-[#eff2f6] leading-relaxed">
                      • {ex.sentence}
                    </p>
                    {ex.translation && (
                      <p className="text-xs text-[#6e7891] dark:text-[#8a94ad] italic pl-2">
                        &quot;{ex.translation}&quot;
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Card Footer: Metadata and Edit / Delete actions */}
      <div className="flex items-center justify-between pt-3.5 mt-4 border-t border-[#e3e6ed] dark:border-[#272f3d]">
        <span
          title={`Mã thẻ: ${card.id}`}
          className="text-[11px] text-[#6e7891] dark:text-[#8a94ad] inline-flex items-center gap-1 cursor-help"
        >
          <Hash className="w-3 h-3 opacity-60" />
          <span>{card.id.slice(0, 8)}</span>
        </span>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onEdit(card)}
            className="p-1.5 rounded-lg text-[#6e7891] hover:text-[#141824] dark:hover:text-white hover:bg-[#eff2f6] dark:hover:bg-[#1f232e] cursor-pointer transition-colors"
            title="Chỉnh sửa câu"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => {
              if (confirm('Bạn có chắc muốn xoá câu này khỏi hệ thống?')) onDelete(card.id);
            }}
            className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 cursor-pointer transition-colors"
            title="Xoá câu"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </article>
  );
}
