'use client';

import React, { useState } from 'react';
import { Modal } from '@/presentation/components/ui/Modal';
import { Input } from '@/presentation/components/ui/Input';
import { Button } from '@/presentation/components/ui/Button';
import { CreateCardDTO } from '@/core/dtos/card.dto';
import { useToast } from '@/presentation/components/ui/Toast';

interface AddCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (dto: CreateCardDTO) => Promise<void>;
}

export function AddCardModal({ isOpen, onClose, onSubmit }: AddCardModalProps) {
  const { showToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<CreateCardDTO>({
    text: '',
    keyPhrase: '',
    phraseTranslation: '',
    translation: '',
    explanation: '',
    videoTitle: 'Thêm thủ công',
    url: '',
    isFavorite: false,
  });

  const handleChange = (field: keyof CreateCardDTO, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.text.trim()) {
      showToast('Vui lòng nhập câu tiếng Anh', 'error');
      return;
    }

    try {
      setIsSubmitting(true);
      await onSubmit(formData);
      setFormData({
        text: '',
        keyPhrase: '',
        phraseTranslation: '',
        translation: '',
        explanation: '',
        videoTitle: 'Thêm thủ công',
        url: '',
        isFavorite: false,
      });
      onClose();
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Lỗi khi lưu câu mới', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Thêm câu mới"
      description="Lưu câu tiếng Anh kèm cụm từ và bản dịch"
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4 font-sans select-none">
        <div>
          <label className="block text-xs font-medium text-[var(--text-body)] mb-1.5">
            Câu tiếng Anh <span className="text-rose-500">*</span>
          </label>
          <textarea
            value={formData.text}
            onChange={(e) => handleChange('text', e.target.value)}
            rows={3}
            placeholder="Ví dụ: It is essential to get the hang of active recall early on..."
            className="w-full px-3 py-2 text-sm bg-[var(--bg-card)] border border-[var(--border-default)] rounded-xl text-[var(--text-main)] placeholder-[var(--text-faint)] focus:outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] transition-colors"
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="Cụm từ trọng tâm"
            value={formData.keyPhrase || ''}
            onChange={(e) => handleChange('keyPhrase', e.target.value)}
            placeholder="Ví dụ: get the hang of"
          />
          <Input
            label="Nghĩa của cụm từ"
            value={formData.phraseTranslation || ''}
            onChange={(e) => handleChange('phraseTranslation', e.target.value)}
            placeholder="Ví dụ: nắm bắt được cách làm"
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
            placeholder="Ví dụ: Điều cốt yếu là phải nắm bắt được phương pháp gợi nhớ..."
            className="w-full px-3 py-2 text-sm bg-[var(--bg-card)] border border-[var(--border-default)] rounded-xl text-[var(--text-main)] placeholder-[var(--text-faint)] focus:outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] transition-colors"
          />
        </div>

        <Input
          label="Ghi chú ngữ pháp & ngữ cảnh"
          value={formData.explanation || ''}
          onChange={(e) => handleChange('explanation', e.target.value)}
          placeholder="Ví dụ: Thường dùng khi học kỹ năng mới"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="Nguồn video"
            value={formData.videoTitle || ''}
            onChange={(e) => handleChange('videoTitle', e.target.value)}
            placeholder="Ví dụ: TED Talk"
          />
          <Input
            label="Đường link URL (nếu có)"
            value={formData.url || ''}
            onChange={(e) => handleChange('url', e.target.value)}
            placeholder="https://youtube.com/..."
          />
        </div>

        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[var(--border-subtle)]">
          <Button
            type="button"
            variant="ghost"
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
            Lưu câu
          </Button>
        </div>
      </form>
    </Modal>
  );
}
