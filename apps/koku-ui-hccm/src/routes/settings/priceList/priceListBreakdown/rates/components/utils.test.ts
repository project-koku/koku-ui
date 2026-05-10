import type { MetricHash } from 'api/metrics';
import type { Rate, TagValue } from 'api/rates';
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
  validateTagValue,
} from './utils';

describe('rates/utils', () => {
  describe('getDefaultCostType', () => {
    test('returns empty when metric is unknown', () => {
      const hash: MetricHash = { cpu: {} };
      expect(getDefaultCostType(hash as any, 'missing')).toBe('');
    });

    test('returns empty when metric has no nested keys', () => {
      const hash: MetricHash = { cpu: {} };
      expect(getDefaultCostType(hash as any, 'cpu')).toBe('');
    });

    test('returns default_cost_type from first nested metric entry', () => {
      const hash: MetricHash = {
        cpu: {
          m1: { default_cost_type: 'Infrastructure' } as any,
        },
      };
      expect(getDefaultCostType(hash, 'cpu')).toBe('Infrastructure');
    });
  });

  describe('hasTagValuesErrors', () => {
    test('returns true when any row has field errors', () => {
      expect(hasTagValuesErrors([{}, { tag_value: messages.requiredField }])).toBe(true);
    });

    test('returns false when rows are clean', () => {
      expect(hasTagValuesErrors([{}, {}])).toBe(false);
    });
  });

  describe('hasDirtyTagValues', () => {
    test('returns true when lengths differ', () => {
      expect(hasDirtyTagValues([{ tag_value: 'a' }], [])).toBe(true);
    });

    test('returns true when a row differs from baseline', () => {
      const a: TagValue = { default: false, description: '', tag_value: 'k', unit: 'USD', value: 1 };
      const b: TagValue = { ...a, value: 2 };
      expect(hasDirtyTagValues([b], [a])).toBe(true);
    });

    test('returns false when identical', () => {
      const row: TagValue = { default: false, description: '', tag_value: 'k', unit: 'USD', value: 1 };
      expect(hasDirtyTagValues([row], [{ ...row }])).toBe(false);
    });
  });

  describe('hasDuplicateTagRates', () => {
    test('detects identical tag-rate identity tuples', () => {
      const row = {
        costType: 'Infra',
        measurement: 'm',
        metric: 'cpu',
        tagKey: 'env',
      };
      expect(hasDuplicateTagRates(row, row)).toBe(true);
      expect(hasDuplicateTagRates(row, { ...row, tagKey: 'other' })).toBe(false);
    });
  });

  describe('hasInvalidTagValues', () => {
    test('finds rows missing tag_value, value, or non-positive rate', () => {
      expect(hasInvalidTagValues([{ tag_value: '', unit: 'USD', value: 1 } as TagValue])).toBeTruthy();
      expect(hasInvalidTagValues([{ tag_value: 'k', unit: 'USD', value: 0 } as TagValue])).toBeTruthy();
      expect(
        hasInvalidTagValues([{ tag_value: 'k', unit: 'USD', value: 1 } as TagValue])
      ).toBeUndefined();
    });
  });

  describe('validateDescription', () => {
    test('returns too-long message past 500 chars', () => {
      expect(validateDescription('x'.repeat(501))).toBe(messages.costModelsDescTooLong);
      expect(validateDescription('ok')).toBeNull();
    });
  });

  describe('validateName', () => {
    const rates = [{ custom_name: 'Taken' } as Rate];

    test('required, length, duplicate', () => {
      expect(validateName('', rates)).toBe(messages.requiredField);
      expect(validateName('   ', rates)).toBe(messages.requiredField);
      expect(validateName('x'.repeat(501), rates)).toBe(messages.costModelsDescTooLong);
      expect(validateName('Taken', rates)).toBe(messages.priceListDuplicateName);
      expect(validateName('Unique', rates)).toBeNull();
    });
  });

  describe('validateRate', () => {
    test('covers empty, invalid currency format, negative, decimals', () => {
      expect(validateRate('')).toBe(messages.requiredField);
      expect(validateRate('abc')).toBe(messages.priceListNumberRate);
      expect(validateRate('-1')).toBe(messages.priceListPosNumberRate);
      expect(validateRate('1.' + '2'.repeat(11))).toBe(messages.costModelsRateTooLong);
      expect(validateRate('12.34')).toBeUndefined();
    });
  });

  describe('validateTagKey', () => {
    test('required, length, pattern, gpu bypass', () => {
      expect(validateTagKey('')).toBe(messages.requiredField);
      expect(validateTagKey('x'.repeat(101))).toBe(messages.costModelsInfoTooLong);
      expect(validateTagKey('bad-key')).toBe(messages.costModelsUnsupportedTagChars);
      expect(validateTagKey('bad-key', true)).toBeNull();
      expect(validateTagKey('valid_key', false)).toBeNull();
    });
  });

  describe('validateTagKeyDuplicate', () => {
    test('returns duplicate message when another rate matches tuple', () => {
      const metricsHashByName: MetricHash = {
        cpu_core: { label_metric: 'CPU', metric: 'cpu_core' } as any,
      };
      const priceListRates = [
        {
          cost_type: 'Infra',
          metric: { name: 'cpu_core' },
          tag_rates: { tag_key: 'env' },
        },
      ] as Rate[];

      const err = validateTagKeyDuplicate(
        {
          costType: 'Infra',
          measurement: 'cpu_core',
          metric: 'CPU',
          tagKey: 'env',
        },
        priceListRates,
        metricsHashByName
      );
      expect(err).toBe(messages.priceListDuplicateTag);
    });

    test('returns null when no duplicate', () => {
      expect(
        validateTagKeyDuplicate(
          { costType: 'X', measurement: 'm', metric: 'M', tagKey: 'k' },
          [],
          {}
        )
      ).toBeNull();
    });
  });

  describe('validateTagValue', () => {
    test('detects duplicate tag_value at another index', () => {
      const rows: TagValue[] = [
        { tag_value: 'a', unit: 'USD', value: 1 } as TagValue,
        { tag_value: 'b', unit: 'USD', value: 2 } as TagValue,
      ];
      expect(validateTagValue('b', rows, 0)).toBe(messages.priceListDuplicateValue);
      expect(validateTagValue('a', rows, 0)).toBeNull();
    });
  });
});
