import type { SettingsData } from 'api/settings';
import messages from 'locales/messages';

import {
  datesOverlap,
  findOverlappingRate,
  getEffectiveDate,
  getEffectiveEndDate,
  getEffectiveStartDate,
  parseRateValue,
  validateDescription,
  validateEndDate,
  validateName,
  validateRate,
  validateStartDate,
} from '.';

describe('details/utils', () => {
  describe('getEffectiveDate', () => {
    test('parses a valid date string at local midnight', () => {
      const result = getEffectiveDate('2024-06-15');
      expect(result.getFullYear()).toBe(2024);
      expect(result.getMonth()).toBe(5);
      expect(result.getDate()).toBe(15);
    });

    test('falls back to today when date is empty or invalid', () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      expect(getEffectiveDate('').getTime()).toBe(today.getTime());
      expect(getEffectiveDate('not-a-date').getTime()).toBe(today.getTime());
    });
  });

  describe('getEffectiveEndDate', () => {
    test('returns last day of the given month', () => {
      const result = getEffectiveEndDate(new Date('2024-06-15'));
      expect(result.getFullYear()).toBe(2024);
      expect(result.getMonth()).toBe(5);
      expect(result.getDate()).toBe(30);
    });

    test('falls back to today when date is falsy', () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      expect(getEffectiveEndDate(undefined as any).getTime()).toBe(today.getTime());
    });
  });

  describe('getEffectiveStartDate', () => {
    test('returns first day of the given month', () => {
      const result = getEffectiveStartDate(new Date('2024-06-15'));
      expect(result.getFullYear()).toBe(2024);
      expect(result.getMonth()).toBe(5);
      expect(result.getDate()).toBe(1);
    });

    test('returns undefined when date is falsy', () => {
      expect(getEffectiveStartDate(undefined as any)).toBeUndefined();
    });
  });

  describe('parseRateValue', () => {
    test('parses a numeric rate string', () => {
      expect(parseRateValue('1.25')).toBe(1.25);
    });
  });

  describe('validateRate', () => {
    test('returns required when empty', () => {
      expect(validateRate('')).toBe(messages.requiredField);
    });

    test('returns format error for non-numeric values', () => {
      expect(validateRate('abc')).toBe(messages.priceListNumberRate);
    });

    test('returns positive-number error for negative values', () => {
      expect(validateRate('-1')).toBe(messages.priceListPosNumberRate);
    });

    test('returns too-long error when decimals exceed 10', () => {
      expect(validateRate('1.12345678901')).toBe(messages.costModelsRateTooLong);
    });

    test('returns undefined for a valid rate', () => {
      expect(validateRate('1.25')).toBeUndefined();
    });
  });

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
    const now = new Date();
    const currentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const previousMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    const endOfCurrentMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    const endOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 2, 0);

    test('returns error when start is a past month', () => {
      expect(validateStartDate(previousMonth, endOfNextMonth)).toBe(messages.validityPeriodStartMonthPastError);
    });

    test('returns error when start is after end', () => {
      expect(validateStartDate(nextMonth, endOfCurrentMonth)).toBe(messages.validityPeriodStartMonthError);
    });

    test('returns null when start is current or future month on or before end', () => {
      expect(validateStartDate(currentMonth, endOfNextMonth)).toBeNull();
      expect(validateStartDate(nextMonth, endOfNextMonth)).toBeNull();
    });
  });

  describe('datesOverlap', () => {
    test('returns true when ranges overlap', () => {
      expect(
        datesOverlap(new Date('2024-01-01'), new Date('2024-06-30'), new Date('2024-06-01'), new Date('2024-12-31'))
      ).toBe(true);
    });

    test('returns false when ranges are adjacent but do not overlap', () => {
      expect(
        datesOverlap(new Date('2024-01-01'), new Date('2024-05-31'), new Date('2024-06-01'), new Date('2024-12-31'))
      ).toBe(false);
    });
  });

  describe('findOverlappingRate', () => {
    const settings: SettingsData[] = [
      {
        code: 'USD',
        static_rates: [
          {
            uuid: 'rate-1',
            base_currency: 'USD',
            target_currency: 'EUR',
            start_date: '2024-01-01',
            end_date: '2024-06-30',
          },
          {
            uuid: 'rate-2',
            base_currency: 'USD',
            target_currency: 'AED',
            start_date: '2024-01-01',
            end_date: '2024-12-31',
          },
        ],
      },
      {
        code: 'EUR',
        static_rates: [
          {
            uuid: 'rate-3',
            base_currency: 'EUR',
            target_currency: 'USD',
            start_date: '2024-01-01',
            end_date: '2024-12-31',
          },
        ],
      },
      {
        // Rates nested under AED even when the pair is USD → AED
        code: 'AED',
        static_rates: [
          {
            uuid: 'rate-aed-oct',
            base_currency: 'USD',
            target_currency: 'AED',
            start_date: '2026-10-01',
            end_date: '2026-10-31',
          },
          {
            uuid: 'rate-aed-aug',
            base_currency: 'USD',
            target_currency: 'AED',
            start_date: '2026-08-01',
            end_date: '2026-08-31',
          },
        ],
      },
    ];

    test('returns overlapping rate for the same currency pair under matching code', () => {
      const overlap = findOverlappingRate(
        settings,
        'USD',
        'EUR',
        new Date('2024-06-01'),
        new Date('2024-12-31')
      );
      expect(overlap?.uuid).toBe('rate-1');
    });

    test('returns undefined when ranges do not overlap', () => {
      const overlap = findOverlappingRate(
        settings,
        'USD',
        'EUR',
        new Date('2024-07-01'),
        new Date('2024-12-31')
      );
      expect(overlap).toBeUndefined();
    });

    test('ignores rates for a different target currency', () => {
      const overlap = findOverlappingRate(
        settings,
        'USD',
        'EUR',
        new Date('2024-01-01'),
        new Date('2024-12-31'),
        undefined
      );
      expect(overlap?.uuid).toBe('rate-1');
      expect(overlap?.target_currency).toBe('EUR');
    });

    test('excludes the rate being edited by uuid', () => {
      const overlap = findOverlappingRate(
        settings,
        'USD',
        'EUR',
        new Date('2024-01-01'),
        new Date('2024-06-30'),
        'rate-1'
      );
      expect(overlap).toBeUndefined();
    });

    test('finds rates nested under a different settings code than the base currency', () => {
      const overlap = findOverlappingRate(
        settings,
        'USD',
        'AED',
        new Date('2026-10-01'),
        new Date('2026-11-30')
      );
      expect(overlap?.uuid).toBe('rate-aed-oct');
    });

    test('returns undefined for November when only August and October rates exist', () => {
      const overlap = findOverlappingRate(
        settings,
        'USD',
        'AED',
        new Date('2026-11-01'),
        new Date('2026-11-30')
      );
      expect(overlap).toBeUndefined();
    });
  });
});
