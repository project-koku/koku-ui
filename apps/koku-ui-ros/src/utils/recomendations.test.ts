import { Interval } from './commonTypes';
import { getRecommendationTerm, hasRecommendation, hasRecommendationValues } from './recomendations';

const values = {
  limits: {
    cpu: { amount: 1 },
    memory: {},
  },
  requests: {
    cpu: {},
    memory: { amount: 2 },
  },
};

describe('utils/recomendations', () => {
  test('getRecommendationTerm returns the matching interval', () => {
    const recommendations = {
      recommendation_terms: {
        short_term: { duration_in_hours: 24 },
        medium_term: { duration_in_hours: 168 },
        long_term: { duration_in_hours: 360 },
      },
    };

    expect(getRecommendationTerm(undefined as any, Interval.short_term)).toBeUndefined();
    expect(getRecommendationTerm(recommendations as any, Interval.short_term)).toEqual({ duration_in_hours: 24 });
    expect(getRecommendationTerm(recommendations as any, Interval.medium_term)).toEqual({ duration_in_hours: 168 });
    expect(getRecommendationTerm(recommendations as any, Interval.long_term)).toEqual({ duration_in_hours: 360 });
    expect(getRecommendationTerm(recommendations as any, 'unknown' as Interval)).toBeUndefined();
  });

  test('hasRecommendationValues checks nested keys', () => {
    expect(hasRecommendationValues(undefined as any, 'limits', 'cpu')).toBe(false);
    expect(hasRecommendationValues(values as any, 'limits', 'cpu')).toBe(true);
    expect(hasRecommendationValues(values as any, 'limits', 'memory')).toBe(false);
    expect(hasRecommendationValues(values as any, 'requests', 'memory')).toBe(true);
  });

  test('hasRecommendation is true when any config exists', () => {
    expect(hasRecommendation(undefined as any)).toBe(false);
    expect(hasRecommendation(values as any)).toBe(true);
    expect(
      hasRecommendation({
        limits: { cpu: {}, memory: {} },
        requests: { cpu: {}, memory: {} },
      } as any)
    ).toBe(false);
  });
});
