import { Interval, OptimizationType } from 'utils/commonTypes';

import { data } from './data';
import { getDefaultInterval, getOptimizationTypeFromTabKey } from './utils';

const recommendations = data.data[0].recommendations;

describe('getOptimizationTypeFromTabKey', () => {
  test('returns cost for tab key 0', () => {
    expect(getOptimizationTypeFromTabKey(0)).toBe(OptimizationType.cost);
  });

  test('returns performance for tab key 1', () => {
    expect(getOptimizationTypeFromTabKey(1)).toBe(OptimizationType.performance);
  });
});

describe('getDefaultInterval', () => {
  test('defaults to short term when recommendations are unavailable', () => {
    expect(getDefaultInterval(Interval.medium_term, OptimizationType.cost)).toBe(Interval.short_term);
  });

  test('returns requested interval when recommendations exist for the optimization type', () => {
    expect(getDefaultInterval(Interval.medium_term, OptimizationType.cost, recommendations)).toBe(
      Interval.medium_term
    );
    expect(getDefaultInterval(Interval.long_term, OptimizationType.performance, recommendations)).toBe(
      Interval.long_term
    );
  });

  test('falls back to short term when the requested interval has no data for the optimization type', () => {
    const partialRecommendations = {
      recommendation_terms: {
        short_term: recommendations.recommendation_terms.short_term,
      },
    };

    expect(getDefaultInterval(Interval.medium_term, OptimizationType.cost, partialRecommendations)).toBe(
      Interval.short_term
    );
  });
});
