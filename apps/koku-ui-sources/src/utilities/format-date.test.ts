import { createIntl, createIntlCache } from 'react-intl';

import { formatDate } from './format-date';

const intl = createIntl({ locale: 'en', defaultLocale: 'en', timeZone: 'America/New_York' }, createIntlCache());

describe('formatDate', () => {
  it('returns an empty string for undefined input', () => {
    expect(formatDate(intl, undefined)).toBe('');
  });

  it('returns an empty string for null input', () => {
    expect(formatDate(intl, null)).toBe('');
  });

  it('returns an empty string for empty string input', () => {
    expect(formatDate(intl, '')).toBe('');
  });

  it('formats an ISO timestamp in UTC', () => {
    const result = formatDate(intl, '2026-01-15T10:00:00Z');
    expect(result).toContain('Jan');
    expect(result).toContain('15');
    expect(result).toContain('2026');
    expect(result).toContain('10:00');
    expect(result).toContain('UTC');
  });

  it('does not convert UTC hours to the system time zone', () => {
    const result = formatDate(intl, '2026-01-15T00:30:00Z');
    expect(result).toContain('00:30');
    expect(result).toContain('UTC');
  });

  it('shows naive Django timestamps as given, without converting or labeling UTC', () => {
    const result = formatDate(intl, '2025-09-01 13:14:56');
    expect(result).toContain('Sep');
    expect(result).toContain('1');
    expect(result).toContain('2025');
    expect(result).toContain('13:14');
    expect(result).not.toContain('17:14');
    expect(result).not.toContain('UTC');
  });

  it('shows timezone-less ISO date-times as given', () => {
    const result = formatDate(intl, '2025-09-01T13:14:56');
    expect(result).toContain('13:14');
    expect(result).not.toContain('UTC');
  });

  it('does not treat a date-only value as a timezone offset', () => {
    expect(formatDate(intl, '2025-09-01')).toBe('');
  });

  it('formats an ISO timestamp with a numeric offset in UTC', () => {
    const result = formatDate(intl, '2026-01-15T10:00:00+00:00');
    expect(result).toContain('10:00');
    expect(result).toContain('UTC');
  });

  it('returns an empty string for trailing data on a naive timestamp', () => {
    expect(formatDate(intl, '2025-09-01 13:14:56 extra')).toBe('');
  });

  it('returns an empty string for an impossible naive calendar date', () => {
    expect(formatDate(intl, '2025-02-30 13:14:56')).toBe('');
  });
});
