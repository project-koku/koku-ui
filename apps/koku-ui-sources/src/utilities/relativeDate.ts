const DIVISIONS: { amount: number; name: Intl.RelativeTimeFormatUnit }[] = [
  { amount: 60, name: 'seconds' },
  { amount: 60, name: 'minutes' },
  { amount: 24, name: 'hours' },
  { amount: 30, name: 'days' },
  { amount: 12, name: 'months' },
  { amount: Number.POSITIVE_INFINITY, name: 'years' },
];

/**
 * Format an ISO date string as a relative time string (e.g., "3 days ago").
 * Returns '—' for falsy input.
 */
export const formatRelativeDate = (dateStr: string | undefined | null, locale?: string): string => {
  if (!dateStr) {
    return '—';
  }

  const date = new Date(dateStr);
  const now = new Date();
  let diffSec = (date.getTime() - now.getTime()) / 1000;

  const rtf = new Intl.RelativeTimeFormat(locale ?? undefined, { numeric: 'auto' });

  for (const division of DIVISIONS) {
    if (Math.abs(diffSec) < division.amount) {
      const value = Math.round(diffSec);
      return rtf.format(value, division.name);
    }
    diffSec /= division.amount;
  }

  return rtf.format(Math.round(diffSec), 'years');
};
