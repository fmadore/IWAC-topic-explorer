// Shared country color utilities for topic explorer

export const KNOWN_COUNTRY_COLORS: Record<string, string> = {
  Togo: '#ef4444', // red
  'Burkina Faso': '#3b82f6', // blue
  Benin: '#22c55e', // green
  "Côte d'Ivoire": '#f59e0b', // amber
  Niger: '#8b5cf6' // purple
};

export const FALLBACK_COUNTRY_COLORS = ['#06b6d4', '#ec4899', '#84cc16', '#f97316', '#6366f1'];

function hashString(input: string): number {
  // Simple djb2 hash (unsigned 32-bit)
  let hash = 5381;
  for (let i = 0; i < input.length; i++) {
    hash = (hash * 33) ^ input.charCodeAt(i);
  }
  return hash >>> 0;
}

/**
 * Get a stable color for a given country.
 * Known countries use a fixed palette; others are hashed into a fallback palette.
 */
export function getCountryColor(country: string | undefined | null): string {
  const key = (country ?? '').trim();
  if (!key) return FALLBACK_COUNTRY_COLORS[0];
  return KNOWN_COUNTRY_COLORS[key] ?? FALLBACK_COUNTRY_COLORS[hashString(key) % FALLBACK_COUNTRY_COLORS.length];
}

/** Compute an accessible text color (black/white) for a given hex background color. */
export function getTextColorForBg(hex: string): string {
  // Normalize hex like #abc or #aabbcc
  let h = hex.replace('#', '');
  if (h.length === 3) h = h.split('').map((c) => c + c).join('');
  if (h.length !== 6) return '#ffffff';

  const r = parseInt(h.slice(0, 2), 16) / 255;
  const g = parseInt(h.slice(2, 4), 16) / 255;
  const b = parseInt(h.slice(4, 6), 16) / 255;

  const toLinear = (c: number) => (c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));
  const L = 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);

  // Threshold: if background is light, use dark text, else light text
  return L > 0.5 ? '#000000' : '#ffffff';
}
