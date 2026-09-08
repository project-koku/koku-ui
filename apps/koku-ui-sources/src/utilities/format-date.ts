import type { IntlShape } from 'react-intl';

/**
 * Format an ISO date string as a UTC date-time (e.g., "Jan 15, 2026, 10:00 UTC").
 * Returns an empty string for falsy input.
 */
export const formatDate = (intl: IntlShape, dateStr: string | undefined | null): string => {
  if (!dateStr) {
    return '';
  }

  return intl.formatDate(dateStr, {
    day: 'numeric',
    hour: 'numeric',
    hourCycle: 'h23',
    minute: 'numeric',
    month: 'short',
    timeZone: 'UTC',
    timeZoneName: 'short',
    year: 'numeric',
  });
};
