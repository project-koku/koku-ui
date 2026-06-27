import { Interval, OptimizationType } from 'utils/commonTypes';

import {
  filterDuplicateNotifications,
  filterNotifications,
  getNotifications,
  getRecommendationEngineNotifications,
  hasNotifications,
  hasNotificationsWarning,
  isIntervalOptimized,
} from './notifications';
import { data } from '../routes/optimizations/optimizationsBreakdown/data';

const recommendations = data.data[0].recommendations;

describe('filterNotifications', () => {
  test('filters optimized notification codes', () => {
    const notifications = [
      { code: 323004 },
      { code: 111101 },
      { code: 323005 },
      { code: 324003 },
      { code: 324004 },
    ];

    expect(filterNotifications(notifications)).toEqual([{ code: 111101 }]);
  });
});

describe('filterDuplicateNotifications', () => {
  test('removes duplicate notification codes', () => {
    const notifications = [{ code: 1 }, { code: 2 }, { code: 1 }];
    expect(filterDuplicateNotifications(notifications)).toEqual([{ code: 1 }, { code: 2 }]);
  });

  test('returns empty array when notifications are missing', () => {
    expect(filterDuplicateNotifications(undefined)).toEqual([]);
  });
});

describe('getRecommendationEngineNotifications', () => {
  test('returns notifications from engine', () => {
    const engine = recommendations.recommendation_terms.medium_term.recommendation_engines.performance;
    const notifications = getRecommendationEngineNotifications(engine);

    expect(notifications.length).toBeGreaterThan(0);
    expect(notifications[0].code).toBeDefined();
  });

  test('returns empty array when engine has no notifications', () => {
    expect(getRecommendationEngineNotifications(undefined)).toEqual([]);
  });
});

describe('getNotifications', () => {
  test('returns engine notifications for interval and optimization type', () => {
    const notifications = getNotifications(recommendations, Interval.medium_term, OptimizationType.performance);

    expect(notifications.length).toBeGreaterThan(0);
  });

  test('returns unfiltered notifications when isFilterDups is false', () => {
    const withDups = getNotifications(recommendations, Interval.medium_term, OptimizationType.performance, false);
    const withoutDups = getNotifications(recommendations, Interval.medium_term, OptimizationType.performance, true);

    expect(withDups.length).toBeGreaterThanOrEqual(withoutDups.length);
  });
});

describe('hasNotifications', () => {
  test('returns true when notifications exist', () => {
    expect(hasNotifications(recommendations, Interval.medium_term, OptimizationType.performance)).toBe(true);
  });

  test('returns false when no notifications exist', () => {
    expect(hasNotifications(undefined, Interval.short_term, OptimizationType.cost)).toBe(false);
  });
});

describe('hasNotificationsWarning', () => {
  test('returns true when recommendations have notifications', () => {
    expect(hasNotificationsWarning(recommendations)).toBe(true);
  });

  test('returns false when recommendations are missing', () => {
    expect(hasNotificationsWarning(undefined)).toBe(false);
  });

  test('filters optimized notifications when requested', () => {
    const optimizedRecommendations = {
      recommendation_terms: {
        short_term: {
          recommendation_engines: {
            cost: {
              notifications: {
                '323004': { code: 323004 },
                '323005': { code: 323005 },
                '324003': { code: 324003 },
                '324004': { code: 324004 },
              },
            },
            performance: {},
          },
        },
      },
    };

    expect(hasNotificationsWarning(optimizedRecommendations, false)).toBe(true);
    expect(hasNotificationsWarning(optimizedRecommendations, true)).toBe(false);
  });
});

describe('isIntervalOptimized', () => {
  test('returns true when all optimized codes are present', () => {
    expect(isIntervalOptimized(recommendations, Interval.medium_term, OptimizationType.performance)).toBe(true);
  });

  test('returns false when optimized codes are missing', () => {
    expect(isIntervalOptimized(recommendations, Interval.short_term, OptimizationType.cost)).toBe(false);
  });
});
