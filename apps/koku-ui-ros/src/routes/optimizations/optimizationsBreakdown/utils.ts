import type { Recommendations } from 'api/ros/recommendations';
import { Interval, OptimizationType } from 'utils/commonTypes';
import { hasNotifications } from 'utils/notifications';
import { hasRecommendation } from 'utils/recomendations';

export const getOptimizationTypeFromTabKey = (activeTabKey: number): OptimizationType => {
  return activeTabKey === 1 ? OptimizationType.performance : OptimizationType.cost;
};

export const getDefaultInterval = (
  value: Interval,
  optimizationType: OptimizationType,
  recommendations?: Recommendations
): Interval => {
  let result = Interval.short_term;
  const terms = recommendations?.recommendation_terms;

  if (!terms) {
    return result;
  }

  switch (value) {
    case Interval.short_term:
      if (
        hasRecommendation(terms?.short_term?.recommendation_engines?.[optimizationType]?.config) ||
        hasNotifications(recommendations, Interval.short_term, optimizationType)
      ) {
        result = Interval.short_term;
      }
      break;
    case Interval.medium_term:
      if (
        hasRecommendation(terms?.medium_term?.recommendation_engines?.[optimizationType]?.config) ||
        hasNotifications(recommendations, Interval.medium_term, optimizationType)
      ) {
        result = Interval.medium_term;
      }
      break;
    case Interval.long_term:
      if (
        hasRecommendation(terms?.long_term?.recommendation_engines?.[optimizationType]?.config) ||
        hasNotifications(recommendations, Interval.long_term, optimizationType)
      ) {
        result = Interval.long_term;
      }
      break;
  }

  return result;
};
