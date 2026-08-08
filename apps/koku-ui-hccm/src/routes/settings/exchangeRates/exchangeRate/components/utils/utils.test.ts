import type { SettingsData } from 'api/settings';
import messages from 'locales/messages';

import {
  datesOverlap,
  findOverlappingRate,
  validateDescription,
  validateEndDate,
  validateName,
  validateStartDate,
} from '.';

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
