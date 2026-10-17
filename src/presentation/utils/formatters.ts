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
    let t = urlObj.searchParams.get('t') || urlObj.searchParams.get('start');
    if (!t && urlObj.hash) {
      const hashMatch = urlObj.hash.match(/[#&?](?:t|start)=([^&]+)/i);
      if (hashMatch) t = hashMatch[1];
    }
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
 * Normalizes any trailing spaces before punctuation (e.g. "right there ." -> "right there.")
 */
export function splitByPhrase(text: string, phrase?: string): Array<{ text: string; match: boolean }> {
  if (!text) return [];
  // Normalize whitespace before punctuation marks: e.g. "right there ." -> "right there."
  const normalized = text.replace(/\s+([.,!?;:])/g, '$1');

  if (!phrase || !phrase.trim()) {
    return [{ text: normalized, match: false }];
  }

  const cleanPhrase = phrase.trim();
  const escaped = cleanPhrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const exactRegex = new RegExp(`(${escaped})`, 'gi');

  if (exactRegex.test(normalized)) {
    const parts = normalized.split(exactRegex);
    return parts.map((part) => ({
      text: part,
      match: part.toLowerCase() === cleanPhrase.toLowerCase(),
    }));
  }

  // Fallback for phrases with hyphens (e.g. "self-sustainable" vs "self- sustainable")
  // or placeholders (e.g. "something", "someone", "sth", "sb", "one's")
  const hasPlaceholders = /\b(someone|something|somebody|sth|sb|one's|anything|anybody)\b/i.test(cleanPhrase);
  const hasHyphen = cleanPhrase.includes('-');

  if (hasPlaceholders || hasHyphen) {
    let flexiblePattern = escaped;
    if (hasHyphen) {
      flexiblePattern = flexiblePattern.replace(/\\-/g, '-?\\s*');
    }
    if (hasPlaceholders) {
      flexiblePattern = flexiblePattern.replace(
        /\\b(?:someone|something|somebody|sth|sb|anything|anybody)\\b/gi,
        '[a-zA-Z0-9_\'\x27\\-]+(?:\\s+[a-zA-Z0-9_\'\x27\\-]+){0,2}'
      );
      flexiblePattern = flexiblePattern.replace(
        /\\bone\\'s\\b/gi,
        '(?:my|your|his|her|its|our|their|[a-zA-Z0-9_\'\x27\\-]+)'
      );
    }

    try {
      const flexRegex = new RegExp(`(${flexiblePattern})`, 'gi');
      if (flexRegex.test(normalized)) {
        const parts = normalized.split(flexRegex);
        return parts.map((part) => ({
          text: part,
          match: flexRegex.test(part),
        }));
      }
    } catch {
      // Fallback to literal
    }
  }

  return [{ text: normalized, match: false }];
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
