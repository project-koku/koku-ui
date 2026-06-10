import messages from 'locales/messages';

import { validateDescription, validateEndDate, validateName, validateStartDate } from '.';

describe('details/utils', () => {
  describe('validateDescription', () => {
    test('returns null when length is within limit', () => {
      expect(validateDescription('ok')).toBeNull();
      expect(validateDescription('a'.repeat(500))).toBeNull();
    });

    test('returns too-long message when length exceeds 500', () => {
      expect(validateDescription('a'.repeat(501))).toBe(messages.costModelsDescTooLong);
    });
  });

  describe('validateName', () => {
    test('returns required message when empty or whitespace-only', () => {
      expect(validateName('')).toBe(messages.requiredField);
      expect(validateName('   ')).toBe(messages.requiredField);
    });

    test('returns null for non-empty trimmed value within limit', () => {
      expect(validateName('x')).toBeNull();
      expect(validateName('a'.repeat(50))).toBeNull();
    });

    test('returns too-long message when length exceeds 50', () => {
      expect(validateName('a'.repeat(51))).toBe(messages.priceListNameTooLong);
    });
  });

  describe('validateEndDate', () => {
    test('returns error when end is before start', () => {
      const start = new Date('2024-06-01');
      const end = new Date('2024-03-01');
      expect(validateEndDate(end, start)).toBe(messages.validityPeriodEndMonthError);
    });

    test('returns null when end is on or after start', () => {
      const start = new Date('2024-06-01');
      expect(validateEndDate(new Date('2024-06-01'), start)).toBeNull();
      expect(validateEndDate(new Date('2024-12-01'), start)).toBeNull();
    });
  });

  describe('validateStartDate', () => {
    test('returns error when start is after end', () => {
      const end = new Date('2024-06-30');
      const start = new Date('2024-08-01');
      expect(validateStartDate(start, end)).toBe(messages.validityPeriodStartMonthError);
    });

    test('returns null when start is on or before end', () => {
      const end = new Date('2024-06-30');
      expect(validateStartDate(new Date('2024-01-01'), end)).toBeNull();
      expect(validateStartDate(new Date('2024-06-30'), end)).toBeNull();
    });
  });
});
