import { formatRelativeDate } from './relative-date';

jest.useRealTimers();

describe('formatRelativeDate', () => {
  it('returns "—" for undefined input', () => {
    expect(formatRelativeDate(undefined)).toBe('—');
  });

  it('returns "—" for null input', () => {
    expect(formatRelativeDate(null)).toBe('—');
  });

  it('returns "—" for empty string input', () => {
    expect(formatRelativeDate('')).toBe('—');
  });

  it('formats a date 3 days ago to contain "days ago"', () => {
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
    const result = formatRelativeDate(threeDaysAgo.toISOString());
    expect(result).toContain('days ago');
  });

  it('formats a date 2 months ago to contain "months ago"', () => {
    const twoMonthsAgo = new Date();
    twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);
    const result = formatRelativeDate(twoMonthsAgo.toISOString());
    expect(result).toContain('months ago');
  });
});
