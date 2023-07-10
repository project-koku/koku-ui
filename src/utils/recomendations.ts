import type { Notification, RecommendationItem } from 'api/ros/recommendations';

export const getNotifications = (term: RecommendationItem): Notification[] => {
  if (!hasNotification(term)) {
    return undefined;
  }
  return Object.keys(term.notifications).map(key => term.notifications[key]);
};

export const hasNotification = (term: RecommendationItem) => {
  if (!(term && term.notifications)) {
    return false;
  }
  const keys = Object.keys(term.notifications);
  return keys.length > 0;
};

export const hasRecommendation = (term: RecommendationItem) => {
  if (!term) {
    return false;
  }

  const hasConfigLimitsCpu = hasRecommendationValues(term, 'config', 'limits', 'cpu');
  const hasConfigLimitsMemory = hasRecommendationValues(term, 'config', 'limits', 'memory');
  const hasConfigRequestsCpu = hasRecommendationValues(term, 'config', 'requests', 'cpu');
  const hasConfigRequestsMemory = hasRecommendationValues(term, 'config', 'requests', 'memory');

  return hasConfigLimitsCpu || hasConfigLimitsMemory || hasConfigRequestsCpu || hasConfigRequestsMemory;
};

// Helper to determine if config and variation are empty objects
// Example: key1 = config, key2 = limits, key3 = cpu
export const hasRecommendationValues = (term: RecommendationItem, key1: string, key2: string, key3: string) => {
  let result = false;
  if (term && term[key1] && term[key1][key2] && term[key1][key2][key3]) {
    result = Object.keys(term[key1][key2][key3]).length > 0;
  }
  return result;
};
