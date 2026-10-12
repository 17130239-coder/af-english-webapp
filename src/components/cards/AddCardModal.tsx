'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { CreateCardDTO } from '@/types/card';
import { useToast } from '@/components/ui/Toast';

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
      showToast('Đã thêm từ vựng mới thành công', 'success');
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
      title="Thêm từ vựng mới"
      description="Lưu câu tiếng Anh kèm từ khoá, bản dịch và video tham khảo"
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4 font-sans select-none">
        <div>
          <label className="block text-xs font-semibold text-[#6b7280] dark:text-[#9ca3af] mb-1.5">
            Câu tiếng Anh (English Sentence) <span className="text-rose-500">*</span>
          </label>
          <textarea
            value={formData.text}
            onChange={(e) => handleChange('text', e.target.value)}
            rows={3}
            placeholder="Ví dụ: It is essential to get the hang of active recall early on..."
            className="w-full px-3 py-2 text-sm bg-white dark:bg-[#1c1d23] border border-[#e2e5ec] dark:border-[#2f313c] rounded-lg text-[#1b1e28] dark:text-[#f4f5f8] placeholder-[#9ca3af] focus:outline-none focus:border-[#f97316] focus:ring-2 focus:ring-[#f97316]/20 transition-colors"
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <Input
            label="Từ khoá / Cụm từ trọng tâm"
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
          <label className="block text-xs font-semibold text-[#6b7280] dark:text-[#9ca3af] mb-1.5">
            Bản dịch cả câu (Vietnamese Translation)
          </label>
          <textarea
            value={formData.translation || ''}
            onChange={(e) => handleChange('translation', e.target.value)}
            rows={2}
            placeholder="Ví dụ: Điều cốt yếu là phải nắm bắt được phương pháp gợi nhớ chủ động ngay từ sớm..."
            className="w-full px-3 py-2 text-sm bg-white dark:bg-[#1c1d23] border border-[#e2e5ec] dark:border-[#2f313c] rounded-lg text-[#1b1e28] dark:text-[#f4f5f8] placeholder-[#9ca3af] focus:outline-none focus:border-[#f97316] focus:ring-2 focus:ring-[#f97316]/20 transition-colors"
          />
        </div>

        <Input
          label="Ghi chú ngữ pháp & ngữ cảnh"
          value={formData.explanation || ''}
          onChange={(e) => handleChange('explanation', e.target.value)}
          placeholder="Ví dụ: Cụm từ thường dùng trong ngữ cảnh học tập kỹ năng mới"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <Input
            label="Tiêu đề video YouTube"
            value={formData.videoTitle || ''}
            onChange={(e) => handleChange('videoTitle', e.target.value)}
            placeholder="Ví dụ: TED Talk: How to learn faster"
          />
          <Input
            label="Link video YouTube (kèm timestamp)"
            value={formData.url || ''}
            onChange={(e) => handleChange('url', e.target.value)}
            placeholder="https://youtu.be/...&t=84"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#e5e7ee] dark:border-[#2a2c35]">
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
            Lưu từ vựng
          </Button>
        </div>
      </form>
    </Modal>
  );
}
