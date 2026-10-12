import React from 'react';

export function Footer() {
  return (
    <footer className="mt-auto border-t border-[var(--border-default)] py-5 text-xs text-[var(--text-faint)] bg-[var(--bg-page)]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-2.5 text-center sm:text-left">
        <div>
          <span>AF English · Dữ liệu đồng bộ trực tiếp từ Neon Postgres</span>
        </div>
        <div className="flex items-center gap-3">
          <span>Phím tắt: ⌘K tìm kiếm, Space lật thẻ</span>
        </div>
      </div>
    </footer>
  );
}
