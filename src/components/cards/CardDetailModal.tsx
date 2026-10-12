'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { SubtitleCard, UpdateCardDTO } from '@/types/card';
import { useToast } from '@/components/ui/Toast';

interface CardDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  card: SubtitleCard | null;
  onUpdate: (id: string, dto: UpdateCardDTO) => Promise<void>;
}

export function CardDetailModal({
  isOpen,
  onClose,
  card,
  onUpdate,
}: CardDetailModalProps) {
  const { showToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<UpdateCardDTO>(() => ({
    text: card?.text || '',
    keyPhrase: card?.keyPhrase || '',
    phraseTranslation: card?.phraseTranslation || '',
    translation: card?.translation || '',
    explanation: card?.explanation || '',
    videoTitle: card?.videoTitle || '',
    url: card?.url || '',
    isFavorite: card?.isFavorite || false,
  }));

  if (!card) return null;

  const handleChange = (field: keyof UpdateCardDTO, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.text?.trim()) {
      showToast('Câu tiếng Anh không được để trống', 'error');
      return;
    }

    try {
      setIsSubmitting(true);
      await onUpdate(card.id, formData);
      showToast('Đã cập nhật câu thành công', 'success');
      onClose();
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Lỗi khi cập nhật', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Chỉnh sửa từ vựng"
      description={`Cập nhật nội dung câu và ghi chú (ID: ${card.id.slice(0, 8)})`}
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4 font-sans select-none">
        <div>
          <label className="block text-xs font-semibold text-[#525b75] dark:text-[#9fa6bc] mb-1.5">
            Câu tiếng Anh (English Sentence) <span className="text-rose-500">*</span>
          </label>
          <textarea
            value={formData.text || ''}
            onChange={(e) => handleChange('text', e.target.value)}
            rows={3}
            className="w-full px-3 py-2 text-sm bg-white dark:bg-[#141824] border border-[#cbd0dd] dark:border-[#373e53] rounded-lg text-[#141824] dark:text-[#eff2f6] placeholder-[#9fa6bc] focus:outline-none focus:border-[#ea580c] focus:ring-2 focus:ring-[#ea580c]/20 transition-colors"
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <Input
            label="Từ khoá / Cụm từ trọng tâm"
            value={formData.keyPhrase || ''}
            onChange={(e) => handleChange('keyPhrase', e.target.value)}
          />
          <Input
            label="Nghĩa của cụm từ"
            value={formData.phraseTranslation || ''}
            onChange={(e) => handleChange('phraseTranslation', e.target.value)}
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#525b75] dark:text-[#9fa6bc] mb-1.5">
            Bản dịch cả câu (Vietnamese Translation)
          </label>
          <textarea
            value={formData.translation || ''}
            onChange={(e) => handleChange('translation', e.target.value)}
            rows={2}
            className="w-full px-3 py-2 text-sm bg-white dark:bg-[#141824] border border-[#cbd0dd] dark:border-[#373e53] rounded-lg text-[#141824] dark:text-[#eff2f6] placeholder-[#9fa6bc] focus:outline-none focus:border-[#ea580c] focus:ring-2 focus:ring-[#ea580c]/20 transition-colors"
          />
        </div>

        <Input
          label="Ghi chú ngữ pháp & giải thích"
          value={formData.explanation || ''}
          onChange={(e) => handleChange('explanation', e.target.value)}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <Input
            label="Tiêu đề video YouTube"
            value={formData.videoTitle || ''}
            onChange={(e) => handleChange('videoTitle', e.target.value)}
          />
          <Input
            label="Link video YouTube"
            value={formData.url || ''}
            onChange={(e) => handleChange('url', e.target.value)}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#e3e6ed] dark:border-[#272f3d]">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
          >
            Huỷ bỏ
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="sm"
            isLoading={isSubmitting}
          >
            Cập nhật thay đổi
          </Button>
        </div>
      </form>
    </Modal>
  );
}
