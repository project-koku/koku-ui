import { createIntl, createIntlCache } from 'react-intl';

import { formatDate } from './format-date';

const intl = createIntl({ locale: 'en', defaultLocale: 'en' }, createIntlCache());

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
});
