'use client';

import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
}

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  maxWidth = 'lg',
}: ModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const maxWidthStyles = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '3xl': 'max-w-3xl',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-xs select-none">
      <div
        className="fixed inset-0"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        className={`relative w-full ${maxWidthStyles[maxWidth]} bg-white dark:bg-[#141824] border border-[#e3e6ed] dark:border-[#272f3d] rounded-xl text-[#141824] dark:text-[#eff2f6] shadow-xl overflow-hidden z-10 font-sans transition-all duration-150`}
        role="dialog"
        aria-modal="true"
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#e3e6ed] dark:border-[#272f3d] bg-white dark:bg-[#141824]">
          <div className="min-w-0 pr-3">
            <h2 className="text-base sm:text-lg font-bold text-[#141824] dark:text-[#eff2f6] truncate">
              {title}
            </h2>
            {description && (
              <p className="text-xs text-[#6e7891] dark:text-[#8a94ad] truncate mt-0.5">
                {description}
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#6e7891] hover:text-[#141824] dark:text-[#8a94ad] dark:hover:text-[#eff2f6] hover:bg-[#eff2f6] dark:hover:bg-[#1f232e] cursor-pointer transition-colors"
            title="Đóng (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 max-h-[85vh] overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
