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
      showToast('Đã thêm thẻ mới thành công', 'success');
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
      showToast(err instanceof Error ? err.message : 'Lỗi khi thêm thẻ', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Thêm thẻ từ vựng mới"
      description="Nhập từ hoặc câu tiếng Anh bạn muốn học vào hệ thống"
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Câu hoặc từ tiếng Anh <span className="text-red-500">*</span>
          </label>
          <textarea
            value={formData.text}
            onChange={(e) => handleChange('text', e.target.value)}
            rows={3}
            placeholder="Ví dụ: Let's go get some coffee..."
            className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400/40"
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="Cụm từ trọng tâm (Key phrase)"
            value={formData.keyPhrase || ''}
            onChange={(e) => handleChange('keyPhrase', e.target.value)}
            placeholder="Ví dụ: go get something"
          />
          <Input
            label="Nghĩa của cụm từ"
            value={formData.phraseTranslation || ''}
            onChange={(e) => handleChange('phraseTranslation', e.target.value)}
            placeholder="Ví dụ: đi mua hoặc lấy cái gì"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Bản dịch tiếng Việt
          </label>
          <textarea
            value={formData.translation || ''}
            onChange={(e) => handleChange('translation', e.target.value)}
            rows={2}
            placeholder="Bản dịch của toàn bộ câu..."
            className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400/40"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Ghi chú / Giải thích ngữ pháp
          </label>
          <textarea
            value={formData.explanation || ''}
            onChange={(e) => handleChange('explanation', e.target.value)}
            rows={2}
            placeholder="Giải thích ngữ cảnh dùng hoặc cấu trúc ngữ pháp..."
            className="w-full px-3 py-2 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400/40"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="Nguồn video / Tiêu đề"
            value={formData.videoTitle || ''}
            onChange={(e) => handleChange('videoTitle', e.target.value)}
            placeholder="YouTube Video"
          />
          <Input
            label="Đường link URL (nếu có)"
            value={formData.url || ''}
            onChange={(e) => handleChange('url', e.target.value)}
            placeholder="https://youtube.com/..."
          />
        </div>

        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100 dark:border-slate-800">
          <Button type="button" variant="ghost" size="sm" onClick={onClose} disabled={isSubmitting}>
            Hủy bỏ
          </Button>
          <Button type="submit" variant="primary" size="sm" isLoading={isSubmitting}>
            Thêm thẻ
          </Button>
        </div>
      </form>
    </Modal>
  );
}
