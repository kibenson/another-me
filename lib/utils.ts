export function cn(...inputs: (string | undefined | null | false)[]): string {
  return inputs.filter(Boolean).join(' ').trim();
}

export function formatDate(date: Date | string, locale = 'en'): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString(locale === 'zh' ? 'zh-CN' : 'en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function formatSimilarity(similarity: number): string {
  return `${Math.round(similarity * 100)}%`;
}

export const RECORDS_REQUIRED_FOR_MATCH = 20;
export const DAILY_RECORD_LIMIT = 5;
export const DAILY_REQUEST_LIMIT = 3;
