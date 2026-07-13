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
  const terms = recommendations?.recommendation_terms;
  if (!terms) {
    return Interval.short_term;
  }

  const hasData = (val: Interval) =>
    hasRecommendation(terms?.[val]?.recommendation_engines?.[optimizationType]?.config) ||
    hasNotifications(recommendations, val, optimizationType);

  if (value && hasData(value)) {
    return value;
  }
  if (hasData(Interval.short_term)) {
    return Interval.short_term;
  }
  if (hasData(Interval.medium_term)) {
    return Interval.medium_term;
  }
  if (hasData(Interval.long_term)) {
    return Interval.long_term;
  }
  return Interval.short_term;
};
