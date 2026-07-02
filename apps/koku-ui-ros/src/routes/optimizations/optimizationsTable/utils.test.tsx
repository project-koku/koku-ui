import { getConfiguration, getLinkState } from './utils';
import { data } from '../optimizationsBreakdown/data';

const recommendationEngine = data.data[0].recommendations.recommendation_terms.short_term.recommendation_engines.cost;

describe('getConfiguration', () => {
  test('returns formatted and raw request values', () => {
    const formatted = getConfiguration(recommendationEngine, true, false);
    const raw = getConfiguration(recommendationEngine, false, false);

    expect(formatted?.cpuRequestConfig).toContain('5');
    expect(formatted?.cpuRequestVariation).toContain('-0.17');
    expect(raw?.cpuRequestConfig).toBe(5);
    expect(raw?.cpuRequestVariation).toBe(-0.17000000000000015);
  });

  test('returns undefined when values are missing', () => {
    expect(getConfiguration(undefined, true, false)).toBeUndefined();
  });
});

describe('getLinkState', () => {
  const queryStateName = 'optimizationsDetailsState';

  test('merges location, link, and query state', () => {
    const result = getLinkState({
      breadcrumbPath: '/optimizations/details',
      linkState: {
        existing: true,
        [queryStateName]: {
          breadcrumbPath: '/old-path',
        },
      },
      location: {
        state: {
          fromPage: 'details',
        },
      } as any,
      query: {
        interval: 'medium_term',
        optimizationType: 'performance',
      },
      queryStateName,
    });

    expect(result).toEqual({
      existing: true,
      fromPage: 'details',
      [queryStateName]: {
        breadcrumbPath: '/optimizations/details',
        interval: 'medium_term',
        optimizationType: 'performance',
      },
    });
  });
});
