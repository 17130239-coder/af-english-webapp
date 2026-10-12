import React from 'react';

export function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-200/80 dark:border-slate-800 py-6 text-xs text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
        <div className="flex items-center gap-1.5">
          <span>AF English WebApp</span>
          <span>•</span>
          <span>Đồng bộ thời gian thực với Neon Postgres</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            Thiết kế tối giản & Clean Architecture
          </span>
        </div>
      </div>
    </footer>
  );
}
