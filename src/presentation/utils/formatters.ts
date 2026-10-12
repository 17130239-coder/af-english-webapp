/**
 * Formatting & Parsing Presentation Utilities
 */

/**
 * Extracts YouTube timestamp in seconds from a URL (e.g. ?t=728s or ?t=728)
 */
export function parseYouTubeTimestamp(url?: string): number | null {
  if (!url) return null;
  try {
    const urlObj = new URL(url);
    const t = urlObj.searchParams.get('t');
    if (!t) return null;

    if (/^\d+s?$/i.test(t)) {
      return parseInt(t.replace(/s/i, ''), 10);
    }

    let totalSeconds = 0;
    const hoursMatch = t.match(/(\d+)h/i);
    const minsMatch = t.match(/(\d+)m/i);
    const secsMatch = t.match(/(\d+)s/i);

    if (hoursMatch) totalSeconds += parseInt(hoursMatch[1], 10) * 3600;
    if (minsMatch) totalSeconds += parseInt(minsMatch[1], 10) * 60;
    if (secsMatch) totalSeconds += parseInt(secsMatch[1], 10);

    return totalSeconds > 0 ? totalSeconds : null;
  } catch {
    return null;
  }
}

/**
 * Formats seconds into human-readable MM:SS or HH:MM:SS
 */
export function formatVideoTime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);

  const pad = (n: number) => String(n).padStart(2, '0');
  if (h > 0) {
    return `${h}:${pad(m)}:${pad(s)}`;
  }
  return `${m}:${pad(s)}`;
}

/**
 * Formats relative timestamp in Vietnamese (e.g. "Vừa xong", "5 phút trước", "Hôm qua")
 */
export function formatRelativeTime(timestamp?: number | string): string {
  if (!timestamp) return '';
  const date = typeof timestamp === 'number' ? new Date(timestamp) : new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSecs < 60) return 'Vừa xong';
  if (diffMins < 60) return `${diffMins} phút trước`;
  if (diffHours < 24) return `${diffHours} giờ trước`;
  if (diffDays === 1) return 'Hôm qua';
  if (diffDays < 7) return `${diffDays} ngày trước`;

  return date.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

/**
 * Splits text into segments around a matched phrase for safe React rendering.
 */
export function splitByPhrase(text: string, phrase?: string): Array<{ text: string; match: boolean }> {
  if (!phrase || !phrase.trim()) {
    return [{ text, match: false }];
  }

  const cleanPhrase = phrase.trim();
  const escaped = cleanPhrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(${escaped})`, 'gi');
  const parts = text.split(regex);

  return parts.map((part) => ({
    text: part,
    match: part.toLowerCase() === cleanPhrase.toLowerCase(),
  }));
}

/**
 * Strips decorative emoji icons from titles (e.g. 📍, 🔴, 🎬)
 */
export function cleanTitle(title?: string): string {
  if (!title) return '';
  return title
    .replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1FA70}-\u{1FAFF}]/gu, '')
    .trim();
}
