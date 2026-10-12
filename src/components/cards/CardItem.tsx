'use client';

import React, { useState } from 'react';
import { SubtitleCard } from '@/types/card';
import {
  Volume2,
  Copy,
  Check,
  Star,
  ChevronDown,
  ChevronUp,
  Edit2,
  Trash2,
  Sparkles,
  Clock,
  Video,
  Play,
  Lightbulb,
} from 'lucide-react';
import {
  parseYouTubeTimestamp,
  formatVideoTime,
  formatRelativeTime,
  splitByPhrase,
} from '@/lib/utils/formatters';
import { speakEnglish } from '@/lib/utils/speech';
import { useToast } from '@/components/ui/Toast';

interface CardItemProps {
  card: SubtitleCard;
  onToggleFavorite: (id: string, isFav: boolean) => void;
  onEdit: (card: SubtitleCard) => void;
  onDelete: (id: string) => void;
}

export function CardItem({
  card,
  onToggleFavorite,
  onEdit,
  onDelete,
}: CardItemProps) {
  const { showToast } = useToast();
  const [copiedText, setCopiedText] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
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
      showToast('Đã sao chép câu tiếng Anh vào clipboard', 'success');
      setTimeout(() => setCopiedText(false), 1800);
    } catch {
      showToast('Không thể sao chép văn bản', 'error');
    }
  };

  const handleCopyLink = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!card.url) return;
    try {
      await navigator.clipboard.writeText(card.url);
      setCopiedLink(true);
      showToast('Đã sao chép đường link YouTube', 'success');
      setTimeout(() => setCopiedLink(false), 1800);
    } catch {
      showToast('Không thể sao chép liên kết', 'error');
    }
  };

  const handleSpeak = (e: React.MouseEvent, text: string) => {
    e.stopPropagation();
    setIsPlayingAudio(true);
    speakEnglish(text, () => setIsPlayingAudio(false));
  };

  return (
    <div
      className={`group relative flex flex-col justify-between bg-white dark:bg-slate-900 border rounded-xl p-4 sm:p-5 transition-all hover:shadow-md ${
        card.isFavorite
          ? 'border-amber-300/80 dark:border-amber-900/60 shadow-2xs'
          : 'border-slate-200/90 dark:border-slate-800 shadow-2xs'
      }`}
    >
      <div>
        {/* Header: Source video + timestamp + favorite */}
        <div className="flex items-start justify-between gap-2 mb-3 pb-3 border-b border-slate-100 dark:border-slate-800/80">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <span className="p-1 rounded-md bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400 shrink-0">
              <Video className="w-3.5 h-3.5" />
            </span>

            {card.url ? (
              <a
                href={card.url}
                target="_blank"
                rel="noopener noreferrer"
                title={card.videoTitle}
                className="text-xs font-medium text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white truncate transition-colors"
              >
                {card.videoTitle}
              </a>
            ) : (
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400 truncate">
                {card.videoTitle}
              </span>
            )}

            {timeFormatted && (
              <a
                href={card.url}
                target="_blank"
                rel="noopener noreferrer"
                title={`Mở video tại ${timeFormatted} (${ytSeconds}s)`}
                className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded transition-colors shrink-0"
              >
                <Play className="w-2.5 h-2.5 fill-current" />
                <span>{timeFormatted}</span>
              </a>
            )}

            {card.url && (
              <button
                type="button"
                onClick={handleCopyLink}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5 rounded transition-colors"
                title="Sao chép link video"
              >
                {copiedLink ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
              </button>
            )}
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <span className="text-[11px] text-slate-400 dark:text-slate-500">
              {formatRelativeTime(card.timestamp)}
            </span>

            <button
              type="button"
              onClick={() => onToggleFavorite(card.id, !card.isFavorite)}
              className={`p-1 rounded-md transition-colors cursor-pointer ${
                card.isFavorite
                  ? 'text-yellow-500 hover:text-yellow-600'
                  : 'text-slate-300 hover:text-slate-500 dark:text-slate-600 dark:hover:text-slate-400'
              }`}
              title={card.isFavorite ? 'Bỏ yêu thích' : 'Thêm vào yêu thích'}
            >
              <Star className={`w-4 h-4 ${card.isFavorite ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>

        {/* English Sentence */}
        <div className="mb-3">
          <div className="flex items-start justify-between gap-2">
            <p className="text-base font-semibold text-slate-900 dark:text-slate-50 leading-relaxed">
              {textSegments.map((seg, idx) =>
                seg.match ? (
                  <mark
                    key={idx}
                    className="bg-amber-100 text-amber-900 dark:bg-amber-950/70 dark:text-amber-200 px-1 py-0.5 rounded font-bold"
                  >
                    {seg.text}
                  </mark>
                ) : (
                  <span key={idx}>{seg.text}</span>
                )
              )}
            </p>

            {/* Listen & Copy Sentence */}
            <div className="flex items-center gap-1 shrink-0 mt-0.5">
              <button
                type="button"
                onClick={(e) => handleSpeak(e, card.text)}
                className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                  isPlayingAudio
                    ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/60 dark:text-indigo-300 animate-pulse'
                    : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
                title="Nghe phát âm câu tiếng Anh"
              >
                <Volume2 className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={handleCopyText}
                className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors cursor-pointer"
                title="Sao chép câu"
              >
                {copiedText ? (
                  <Check className="w-4 h-4 text-emerald-500" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Key Phrase Highlight Pill (If available) */}
        {card.keyPhrase && (
          <div className="flex items-center flex-wrap gap-2 mb-3 px-2.5 py-1.5 bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50 rounded-lg text-xs">
            <span className="font-semibold text-indigo-900 dark:text-indigo-300">
              {card.keyPhrase}
            </span>
            {card.phraseTranslation && (
              <>
                <span className="text-indigo-400">→</span>
                <span className="text-indigo-700 dark:text-indigo-300 font-medium">
                  {card.phraseTranslation}
                </span>
              </>
            )}
            <button
              type="button"
              onClick={(e) => handleSpeak(e, card.keyPhrase!)}
              className="ml-auto text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-200 p-0.5 rounded cursor-pointer"
              title="Phát âm cụm từ"
            >
              <Volume2 className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Vietnamese Full Translation */}
        {card.translation ? (
          <div className="mb-3 text-sm text-slate-600 dark:text-slate-300 font-normal leading-normal">
            <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mr-2">
              VI
            </span>
            {card.translation}
          </div>
        ) : (
          <div className="mb-3 text-xs text-amber-600 dark:text-amber-400 italic">
            Chưa có bản dịch AI cho câu này
          </div>
        )}

        {/* Synonyms Chips */}
        {card.synonyms && card.synonyms.length > 0 && (
          <div className="flex items-center flex-wrap gap-1.5 mb-3">
            <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500">
              Đồng nghĩa:
            </span>
            {card.synonyms.map((syn, idx) => (
              <button
                key={idx}
                type="button"
                onClick={(e) => handleSpeak(e, syn)}
                className="px-2 py-0.5 text-xs bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-md transition-colors cursor-pointer"
                title={`Bấm để nghe phát âm "${syn}"`}
              >
                {syn}
              </button>
            ))}
          </div>
        )}

        {/* Grammar / Context Explanation */}
        {card.explanation && (
          <div className="mb-3 flex items-start gap-2 p-2.5 text-xs bg-slate-50 dark:bg-slate-800/50 border-l-2 border-indigo-400 dark:border-indigo-500 rounded-r-md text-slate-600 dark:text-slate-300">
            <Lightbulb className="w-3.5 h-3.5 text-indigo-500 shrink-0 mt-0.5" />
            <p className="leading-relaxed">{card.explanation}</p>
          </div>
        )}

        {/* Contextual Examples Toggle & List */}
        {card.examples && card.examples.length > 0 && (
          <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800/80">
            <button
              type="button"
              onClick={() => setShowExamples(!showExamples)}
              className="flex items-center justify-between w-full text-xs font-medium text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 py-1 transition-colors cursor-pointer"
            >
              <span>Ví dụ minh họa ({card.examples.length} ngữ cảnh)</span>
              {showExamples ? (
                <ChevronUp className="w-3.5 h-3.5" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5" />
              )}
            </button>

            {showExamples && (
              <div className="mt-2 space-y-2 text-xs">
                {card.examples.map((ex, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 bg-slate-50 dark:bg-slate-800/40 rounded-lg space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      {ex.context && (
                        <span className="text-[10px] font-semibold px-1.5 py-0.5 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded">
                          {ex.context}
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={(e) => handleSpeak(e, ex.sentence)}
                        className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 p-0.5 rounded cursor-pointer"
                        title="Nghe ví dụ"
                      >
                        <Volume2 className="w-3 h-3" />
                      </button>
                    </div>
                    <p className="font-medium text-slate-800 dark:text-slate-200">
                      {ex.sentence}
                    </p>
                    {ex.translation && (
                      <p className="text-slate-500 dark:text-slate-400">
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

      {/* Footer Actions */}
      <div className="flex items-center justify-between gap-2 mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 text-xs">
        <div className="flex items-center gap-1.5">
          {card.translation ? (
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
              <Sparkles className="w-3 h-3" />
              <span>Đã dịch</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-600 dark:text-amber-400">
              <Clock className="w-3 h-3" />
              <span>Chờ dịch</span>
            </span>
          )}
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onEdit(card)}
            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors cursor-pointer"
            title="Chỉnh sửa câu này"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => {
              if (confirm('Bạn có chắc chắn muốn xóa thẻ này?')) {
                onDelete(card.id);
              }
            }}
            className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-md transition-colors cursor-pointer"
            title="Xóa thẻ"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
