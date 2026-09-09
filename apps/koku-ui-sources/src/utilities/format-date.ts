import type { IntlShape } from 'react-intl';

/** True when the string ends with `Z` or a numeric offset after a time component. */
const hasExplicitTimeZone = (value: string): boolean =>
  /\d{2}:\d{2}(?::\d{2}(?:\.\d+)?)?(?:Z|[+-]\d{2}(?::?\d{2})?)$/i.test(value);

const utcFormatOptions: Intl.DateTimeFormatOptions = {
  day: 'numeric',
  hour: 'numeric',
  hourCycle: 'h23',
  minute: 'numeric',
  month: 'short',
  timeZone: 'UTC',
  timeZoneName: 'short',
  year: 'numeric',
};

/**
 * Parse a timezone-less datetime ("2025-09-01 13:14:56") into a Date whose UTC
 * components match the wall-clock in the string. Used only so `intl.formatDate`
 * can pretty-print; formatting with `timeZone: 'UTC'` then keeps those numbers
 * as-is instead of converting from the browser's local zone.
 */
const parseNaiveWallClock = (dateStr: string): Date | null => {
  const match = dateStr.trim().match(/^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2})(?::(\d{2}))?(?:\.\d+)?$/);
  if (!match) {
    return null;
  }
  const [, year, month, day, hour, minute, second = '0'] = match;
  const parsedYear = Number(year);
  const parsedMonth = Number(month) - 1;
  const parsedDay = Number(day);
  const parsedHour = Number(hour);
  const parsedMinute = Number(minute);
  const parsedSecond = Number(second);
  const date = new Date(Date.UTC(parsedYear, parsedMonth, parsedDay, parsedHour, parsedMinute, parsedSecond));
  if (
    date.getUTCFullYear() !== parsedYear ||
    date.getUTCMonth() !== parsedMonth ||
    date.getUTCDate() !== parsedDay ||
    date.getUTCHours() !== parsedHour ||
    date.getUTCMinutes() !== parsedMinute ||
    date.getUTCSeconds() !== parsedSecond
  ) {
    return null;
  }
  return date;
};

/**
 * Format a date-time string.
 *
 * - Values with an explicit zone (`Z` or offset) are shown in UTC.
 * - Naive Koku/Django strings (`YYYY-MM-DD HH:mm:ss`) are shown as given, with
 *   no timezone conversion or UTC label. The API serializes those via
 *   `strftime` and does not include zone information.
 *
 * Returns an empty string for falsy or unparseable input.
 */
export const formatDate = (intl: IntlShape, dateStr: string | undefined | null): string => {
  if (!dateStr) {
    return '';
  }

  const value = dateStr.trim();

  if (hasExplicitTimeZone(value)) {
    return intl.formatDate(value, utcFormatOptions);
  }

  const naiveDate = parseNaiveWallClock(value);
  if (!naiveDate) {
    return '';
  }

  return intl.formatDate(naiveDate, {
    day: 'numeric',
    hour: 'numeric',
    hourCycle: 'h23',
    minute: 'numeric',
    month: 'short',
    timeZone: 'UTC',
    year: 'numeric',
  });
};
