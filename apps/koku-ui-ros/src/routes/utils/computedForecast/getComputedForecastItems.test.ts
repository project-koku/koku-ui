import { getComputedForecastItems, getUnsortedComputedForecastItems } from './getComputedForecastItems';

const value = {
  cost: {
    total: { value: 10, units: 'USD' },
    confidence_max: { value: 12, units: 'USD' },
    confidence_min: { value: 8, units: 'USD' },
    pvalues: { value: '0.1', units: null },
    rsquared: { value: '0.9', units: null },
  },
  infrastructure: {
    total: { value: 4, units: 'USD' },
    confidence_max: { value: 5, units: 'USD' },
    confidence_min: { value: 3, units: 'USD' },
  },
  supplementary: {
    total: { value: 6, units: 'USD' },
    confidence_max: { value: 7, units: 'USD' },
    confidence_min: { value: 5, units: 'USD' },
  },
};

describe('getComputedForecastItems', () => {
  test('returns an empty list without a forecast', () => {
    expect(getUnsortedComputedForecastItems({ forecast: undefined as any })).toEqual([]);
  });

  test('computes and merges forecast items by date', () => {
    const forecast = {
      data: [
        {
          values: [
            { date: '2024-01-01', ...value },
            { date: '2024-01-01', ...value },
            { date: '2024-01-02', ...value },
          ],
        },
      ],
    };

    const items = getComputedForecastItems({ forecast: forecast as any });
    expect(items).toHaveLength(2);
    expect(items[0].date).toBeDefined();
    expect(items[0].cost.total.value).toBeGreaterThan(0);
  });
});
