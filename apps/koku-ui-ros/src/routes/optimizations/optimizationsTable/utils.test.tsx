import { Interval, OptimizationType } from 'utils/commonTypes';

import { data } from '../optimizationsBreakdown/data';
import { getConfiguration, getCurrentConfiguration, getLinkState, getRequestProps } from './utils';

const recommendations = data.data[0].recommendations;
const recommendationEngine = recommendations.recommendation_terms.short_term.recommendation_engines.cost;

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

  test('formats percent units', () => {
    const percentEngine = {
      config: { requests: { cpu: { amount: 12, format: 'percent' }, memory: { amount: -3, format: 'percent' } } },
      variation: { requests: { cpu: { amount: 0, format: 'percent' }, memory: { amount: Number.NaN } } },
    };
    expect(getConfiguration(percentEngine as any, true, false)?.cpuRequestConfig).toContain('12');
    expect(getConfiguration(percentEngine as any, false, false)?.cpuRequestConfig).toBe(12);
  });
});

describe('getCurrentConfiguration', () => {
  test('returns formatted current request values', () => {
    expect(getCurrentConfiguration(recommendations, true, false)?.cpuRequestCurrent).toContain('1.1');
    expect(getCurrentConfiguration(undefined, true, false)).toBeUndefined();
  });
});

describe('getRequestProps', () => {
  test('returns warning and trend values for a recommendation', () => {
    const props = getRequestProps(recommendations, Interval.short_term, OptimizationType.cost);
    expect(props.cpuRequestCurrent).toBeTruthy();
    expect(props.memoryRequestVariation).toBeTruthy();
  });

  test('returns warnings when values are missing', () => {
    const props = getRequestProps(undefined, Interval.short_term, OptimizationType.cost);
    expect(props.cpuRequestCurrent).toBeTruthy();
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
