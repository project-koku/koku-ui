import type { AssignedCostModel } from 'api/priceList';
import type { Rate } from 'api/rates';

import {
  getFilteredCostModels,
  getFilteredRates,
  getIndexedRates,
  getPaginatedRates,
  getSortedRates,
} from './utils';

jest.mock('components/i18n', () => ({
  __esModule: true,
  intl: { formatMessage: (m: { id?: string }) => m?.id || 'msg' },
}));

describe('priceListBreakdown/rates/utils', () => {
  const rateA: Rate = {
    custom_name: 'Alpha CPU',
    metric: { name: 'cpu_core_request', label_metric: 'CPU_Request' },
  } as Rate;

  const rateB: Rate = {
    custom_name: 'Beta Memory',
    metric: { name: 'memory_gb_usage_per_hour', label_metric: 'Memory' },
  } as Rate;

  describe('getFilteredCostModels', () => {
    const costModelA: AssignedCostModel = { name: 'Alpha model', uuid: 'cm-a' };
    const costModelB: AssignedCostModel = { name: 'Beta model', uuid: 'cm-b' };

    test('returns same array when no filters', () => {
      const costModels = [costModelA, costModelB];
      expect(getFilteredCostModels(costModels, {})).toBe(costModels);
    });

    test('filters by name (substring, case-insensitive)', () => {
      const out = getFilteredCostModels([costModelA, costModelB], { name: ['alpha'] });
      expect(out).toHaveLength(1);
      expect(out[0].name).toBe('Alpha model');
    });

    test('handles missing cost models', () => {
      expect(getFilteredCostModels(undefined as unknown as AssignedCostModel[], { name: ['x'] })).toEqual([]);
    });
  });

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

    test('filters by metric label (case-insensitive exact match)', () => {
      const out = getFilteredRates([rateA, rateB], { metric_type: ['memory'] });
      expect(out).toHaveLength(1);
      expect(out[0].custom_name).toBe('Beta Memory');
    });

    test('filters by both name and metric', () => {
      const out = getFilteredRates([rateA, rateB], { name: ['beta'], metric_type: ['memory'] });
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

  describe('getSortedRates', () => {
    test('returns same array when no sort key is active', () => {
      const rates = [rateB, rateA];
      expect(getSortedRates(rates, {})).toBe(rates);
    });

    test('sorts by name ascending', () => {
      const out = getSortedRates([rateB, rateA], { name: 'asc' });
      expect(out.map(rate => rate.custom_name)).toEqual(['Alpha CPU', 'Beta Memory']);
    });

    test('sorts by name descending', () => {
      const out = getSortedRates([rateA, rateB], { name: 'desc' });
      expect(out.map(rate => rate.custom_name)).toEqual(['Beta Memory', 'Alpha CPU']);
    });

    test('sorts numerically so Rate 2 comes before Rate 10', () => {
      const rate2 = { custom_name: 'Rate 2' } as Rate;
      const rate10 = { custom_name: 'Rate 10' } as Rate;
      const out = getSortedRates([rate10, rate2], { name: 'asc' });
      expect(out.map(rate => rate.custom_name)).toEqual(['Rate 2', 'Rate 10']);
    });

    test('handles empty rates', () => {
      expect(getSortedRates([], { name: 'asc' })).toEqual([]);
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
