import type { Rate } from 'api/rates';

import { getFilteredRates, getIndexedRates, getLabeledRates, getPaginatedRates } from './utils';

describe('priceListBreakdown/rates/utils', () => {
  const rateA: Rate = {
    custom_name: 'Alpha CPU',
    metric: { name: 'cpu_core_request', label_metric: 'CPU_Request' },
  } as Rate;

  const rateB: Rate = {
    custom_name: 'Beta Memory',
    metric: { name: 'memory_gb_usage_per_hour', label_metric: 'Memory' },
  } as Rate;

  describe('getFilteredRates', () => {
    test('returns same array when no filters', () => {
      const rates = [rateA, rateB];
      expect(getFilteredRates(rates, {})).toBe(rates);
      expect(getFilteredRates(rates, undefined)).toBe(rates);
    });

    test('filters by name (substring, case-insensitive)', () => {
      const out = getFilteredRates([rateA, rateB], { name: ['alpha'] });
      expect(out).toHaveLength(1);
      expect(out[0].custom_name).toBe('Alpha CPU');
    });

    test('filters by metric label (substring, case-insensitive)', () => {
      const out = getFilteredRates([rateA, rateB], { metrics: ['memory'] });
      expect(out).toHaveLength(1);
      expect(out[0].custom_name).toBe('Beta Memory');
    });

    test('filters by both name and metric', () => {
      const out = getFilteredRates([rateA, rateB], { name: ['beta'], metrics: ['memory'] });
      expect(out).toHaveLength(1);
      expect(out[0]).toBe(rateB);
    });

    test('handles empty rates', () => {
      expect(getFilteredRates([], { name: ['x'] })).toEqual([]);
    });
  });

  describe('getIndexedRates', () => {
    test('returns undefined when rates is undefined', () => {
      expect(getIndexedRates(undefined as unknown as Rate[])).toBeUndefined();
    });

    test('adds rateIndex in order', () => {
      const out = getIndexedRates([rateA, rateB]);
      expect(out[0].rateIndex).toBe(0);
      expect(out[1].rateIndex).toBe(1);
    });
  });

  describe('getLabeledRates', () => {
    test('returns undefined when rates is undefined', () => {
      expect(getLabeledRates(undefined as unknown as Rate[], {})).toBeUndefined();
    });

    test('merges labels from metrics hash by metric name', () => {
      const hash = {
        cpu_core_request: {
          label_metric: 'CPU_Request',
          label_measurement: 'Core-hour',
          label_measurement_unit: 'hrs',
        },
      } as any;
      const out = getLabeledRates([rateA], hash);
      expect(out[0].metric?.label_measurement).toBe('Core-hour');
    });

    test('preserves rate when metric not in hash', () => {
      const out = getLabeledRates([rateA], {});
      expect(out[0].metric?.name).toBe('cpu_core_request');
    });
  });

  describe('getPaginatedRates', () => {
    test('returns empty array when rates undefined', () => {
      expect(getPaginatedRates(undefined as unknown as Rate[], 1, 10)).toEqual([]);
    });

    test('page 1 returns first perPage items', () => {
      const rates = [rateA, rateB, rateA];
      expect(getPaginatedRates(rates, 1, 2)).toEqual([rateA, rateB]);
    });

    test('page 2 returns remainder', () => {
      const rates = [rateA, rateB, rateA];
      expect(getPaginatedRates(rates, 2, 2)).toEqual([rateA]);
    });

    test('does not overrun end of list', () => {
      expect(getPaginatedRates([rateA], 2, 10)).toEqual([]);
    });
  });
});
