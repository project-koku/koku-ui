import messages from 'locales/messages';

import {
  getDefaultCostType,
  hasDirtyTagValues,
  hasDuplicateTagRates,
  hasInvalidTagValues,
  hasTagValuesErrors,
  validateDescription,
  validateName,
  validateRate,
  validateTagKey,
  validateTagKeyDuplicate,
} from './utils';

describe('editRate utils', () => {
  const metricsHash: any = {
    CPU: {
      cpu_core: {
        default_cost_type: 'Infrastructure',
      },
    },
  };

  describe('getDefaultCostType', () => {
    test('returns default cost type for first measurement when metric exists', () => {
      expect(getDefaultCostType(metricsHash, 'CPU')).toBe('Infrastructure');
    });

    test('returns empty string when metric key is missing', () => {
      expect(getDefaultCostType(metricsHash, 'Unknown')).toBe('');
    });

    test('returns empty string when metric has no measurements', () => {
      expect(getDefaultCostType({ CPU: {} } as any, 'CPU')).toBe('');
    });
  });

  describe('hasTagValuesErrors', () => {
    test('true when any row has tag_value, value, or description error', () => {
      expect(hasTagValuesErrors([{}, { tag_value: messages.requiredField }])).toBe(true);
      expect(hasTagValuesErrors([{ value: messages.requiredField }])).toBe(true);
      expect(hasTagValuesErrors([{ description: messages.costModelsDescTooLong }])).toBe(true);
    });

    test('false when rows are clean', () => {
      expect(hasTagValuesErrors([{}, {}])).toBe(false);
      expect(hasTagValuesErrors([])).toBe(false);
    });
  });

  describe('hasDirtyTagValues', () => {
    const row = (overrides = {}) => ({
      default: false,
      description: '',
      tag_value: 'a',
      unit: 'USD',
      value: 1,
      ...overrides,
    });

    test('true when lengths differ', () => {
      expect(hasDirtyTagValues([row()], [])).toBe(true);
      expect(hasDirtyTagValues(undefined, [row()])).toBe(true);
    });

    test('true when any field differs from baseline', () => {
      expect(hasDirtyTagValues([row({ tag_value: 'b' })], [row()])).toBe(true);
      expect(hasDirtyTagValues([row({ value: 2 })], [row()])).toBe(true);
      expect(hasDirtyTagValues([row({ default: true })], [row()])).toBe(true);
    });

    test('false when rows match', () => {
      const a = [row()];
      expect(hasDirtyTagValues(a, a)).toBe(false);
    });
  });

  describe('hasDuplicateTagRates', () => {
    test('true only when metric, measurement, cost type, and tag key match', () => {
      expect(
        hasDuplicateTagRates(
          { metric: 'm', measurement: 'ms', costType: 'c', tagKey: 't' },
          { metric: 'm', measurement: 'ms', costType: 'c', tagKey: 't' }
        )
      ).toBe(true);
      expect(
        hasDuplicateTagRates(
          { metric: 'm', measurement: 'ms', costType: 'c', tagKey: 't' },
          { metric: 'x', measurement: 'ms', costType: 'c', tagKey: 't' }
        )
      ).toBe(false);
    });
  });

  describe('hasInvalidTagValues', () => {
    test('finds first row missing tag_value, value, or non-positive rate', () => {
      expect(hasInvalidTagValues([{ tag_value: 'a', value: 1 } as any])).toBeUndefined();
      expect(hasInvalidTagValues([{ tag_value: '', value: 1 } as any])).toBeTruthy();
      expect(hasInvalidTagValues([{ tag_value: 'a', value: 0 } as any])).toBeTruthy();
    });
  });

  describe('validateDescription / validateName', () => {
    test('description returns too-long message when over 500 chars', () => {
      expect(validateDescription('a'.repeat(501))).toBe(messages.costModelsDescTooLong);
      expect(validateDescription('ok')).toBeNull();
    });

    test('name returns too-long message when over 500 chars', () => {
      expect(validateName('a'.repeat(501))).toBe(messages.costModelsDescTooLong);
      expect(validateName('ok')).toBeNull();
    });
  });

  describe('validateRate', () => {
    test('covers empty, invalid format, negative, too many decimals, valid', () => {
      expect(validateRate('')).toBe(messages.requiredField);
      expect(validateRate('x')).toBe(messages.priceListNumberRate);
      expect(validateRate('-1')).toBe(messages.priceListPosNumberRate);
      expect(validateRate('1.' + '1'.repeat(11))).toBe(messages.costModelsRateTooLong);
      expect(validateRate('1.23')).toBeUndefined();
    });
  });

  describe('validateTagKey', () => {
    test('required, too long, invalid chars, GPU skip pattern, valid', () => {
      expect(validateTagKey('')).toBe(messages.requiredField);
      expect(validateTagKey('a'.repeat(101))).toBe(messages.costModelsInfoTooLong);
      expect(validateTagKey('9bad')).toBe(messages.costModelsUnsupportedTagChars);
      expect(validateTagKey('9bad', true)).toBeNull();
      expect(validateTagKey('ok_key')).toBeNull();
    });
  });

  describe('validateTagKeyDuplicate', () => {
    const rate = {
      costType: 'Infra',
      measurement: 'cpu_core',
      metric: 'CPU',
      tagKey: 'dup',
    };

    test('returns duplicate message when another rate matches', () => {
      const priceListRates: any[] = [
        {
          cost_type: 'Infra',
          metric: { name: 'cpu_core' },
          tag_rates: { tag_key: 'dup' },
        },
      ];
      const byName: any = { cpu_core: { label_metric: 'CPU' } };
      expect(validateTagKeyDuplicate(rate, priceListRates, byName)).toBe(messages.priceListDuplicate);
    });

    test('returns null when no duplicate', () => {
      expect(validateTagKeyDuplicate(rate, [], {})).toBeNull();
    });
  });
});
