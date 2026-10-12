import React from 'react';

export function Footer() {
  return (
    <footer className="mt-auto border-t border-[#e3e6ed] dark:border-[#272f3d] bg-white dark:bg-[#141824] py-4 text-xs font-sans text-[#6e7891] dark:text-[#8a94ad] select-none transition-colors duration-150">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Left Brand Note */}
        <div className="flex items-center gap-2">
          <span className="font-bold text-[#141824] dark:text-[#eff2f6]">AF English</span>
          <span>•</span>
          <span>Nền tảng học từ vựng ngữ cảnh trích xuất từ AF Extension</span>
        </div>

        {/* Center Keyboard Shortcuts Reminder */}
        <div className="hidden lg:flex items-center gap-3 text-[11px]">
          <span className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 bg-[#eff2f6] dark:bg-[#1f232e] border border-[#cbd0dd] dark:border-[#272f3d] rounded text-[10px] font-mono">⌘K</kbd>
            <span>Tìm kiếm</span>
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 bg-[#eff2f6] dark:bg-[#1f232e] border border-[#cbd0dd] dark:border-[#272f3d] rounded text-[10px] font-mono">Space</kbd>
            <span>Lật thẻ</span>
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 bg-[#eff2f6] dark:bg-[#1f232e] border border-[#cbd0dd] dark:border-[#272f3d] rounded text-[10px] font-mono">1-4</kbd>
            <span>Đánh giá SRS</span>
          </span>
        </div>

        {/* Right Status */}
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#25b003] inline-block" />
          <span>Neon Postgres Live</span>
        </div>
      </div>
    </footer>
  );
}
