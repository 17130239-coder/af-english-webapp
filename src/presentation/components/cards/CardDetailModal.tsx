'use client';

import React, { useState } from 'react';
import { Modal } from '@/presentation/components/ui/Modal';
import { Input } from '@/presentation/components/ui/Input';
import { Button } from '@/presentation/components/ui/Button';
import { SubtitleCard } from '@/core/entities/card.entity';
import { UpdateCardDTO } from '@/core/dtos/card.dto';
import { useToast } from '@/presentation/components/ui/Toast';

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
      title="Chỉnh sửa câu"
      description="Cập nhật câu tiếng Anh, nghĩa hoặc giải thích"
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4 font-sans select-none">
        <div>
          <label className="block text-xs font-medium text-[var(--text-body)] mb-1.5">
            Câu tiếng Anh
          </label>
          <textarea
            value={formData.text || ''}
            onChange={(e) => handleChange('text', e.target.value)}
            rows={3}
            className="w-full px-3 py-2 text-sm bg-[var(--bg-card)] border border-[var(--border-default)] rounded-xl text-[var(--text-main)] placeholder-[var(--text-faint)] focus:outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] transition-colors"
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="Cụm từ trọng tâm"
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
          <label className="block text-xs font-medium text-[var(--text-body)] mb-1.5">
            Bản dịch tiếng Việt
          </label>
          <textarea
            value={formData.translation || ''}
            onChange={(e) => handleChange('translation', e.target.value)}
            rows={2}
            className="w-full px-3 py-2 text-sm bg-[var(--bg-card)] border border-[var(--border-default)] rounded-xl text-[var(--text-main)] placeholder-[var(--text-faint)] focus:outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] transition-colors"
          />
        </div>

        <Input
          label="Giải thích ngữ pháp & ngữ cảnh"
          value={formData.explanation || ''}
          onChange={(e) => handleChange('explanation', e.target.value)}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="Nguồn video"
            value={formData.videoTitle || ''}
            onChange={(e) => handleChange('videoTitle', e.target.value)}
          />
          <Input
            label="Đường link URL"
            value={formData.url || ''}
            onChange={(e) => handleChange('url', e.target.value)}
          />
        </div>

        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[var(--border-subtle)]">
          <Button type="button" variant="ghost" size="sm" onClick={onClose} disabled={isSubmitting}>
            Hủy
          </Button>
          <Button type="submit" variant="primary" size="sm" isLoading={isSubmitting}>
            Lưu thay đổi
          </Button>
        </div>
      </form>
    </Modal>
  );
}
