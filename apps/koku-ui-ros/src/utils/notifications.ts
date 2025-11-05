import type { Notification, RecommendationEngine, Recommendations, RecommendationTerm } from 'api/ros/recommendations';
import { Interval, OptimizationType } from 'utils/commonTypes';

// Filter notifications (e.g., optimized notices) that should not be associated with a warning icon
//
// Notification codes
// https://github.com/kruize/autotune/blob/master/design/NotificationCodes.md#detailed-codes
//
// ROS OCP-Kruize notifications to pass through to users
// https://docs.google.com/document/d/1oNB-RIb35biFpH7PLEZTJxqhceyipSv18td6-PfeOWs/edit
export const filterNotifications = (notifications: Notification[]) => {
  return notifications?.filter(notification => {
    switch (notification.code) {
      case 323004: // CPU_REQUESTS_OPTIMISED
      case 323005: // CPU_LIMITS_OPTIMISED
      case 324003: // MEMORY_REQUESTS_OPTIMISED
      case 324004: // MEMORY_LIMITS_OPTIMISED
        return false;
    }
    return true;
  });
};

export const filterDuplicateNotifications = (notifications: Notification[]) => {
  const newNotifications = [];
  if (!notifications) {
    return newNotifications;
  }
  notifications.map(notification => {
    if (!newNotifications.find(val => val.code === notification.code)) {
      newNotifications.push(notification);
    }
  });
  return newNotifications;
};

// Returns notifications for the given interval, including any parent notifications
export const getNotifications = (
  recommendations: Recommendations,
  interval: Interval,
  optimizationType: OptimizationType,
  isFilterDups = true
) => {
  const term = recommendations?.recommendation_terms?.[interval];
  const notifications = [
    ...getRecommendationNotifications(recommendations?.notifications),
    ...getRecommendationTermNotifications(term),
    ...getRecommendationEngineNotifications(term?.recommendation_engines?.[optimizationType]),
  ];
  return isFilterDups ? filterDuplicateNotifications(notifications) : notifications;
};

// Recommendations notifications
//
// data: [
//   {
//     recommendations: {
//       notifications: {}, <<<
export const getRecommendationNotifications = (recommendations: Recommendations): Notification[] => {
  if (!recommendations?.notifications) {
    return [];
  }
  return Object.keys(recommendations.notifications).map(key => recommendations.notifications[key]);
};

// Recommendations term notifications
//
// data: [
//   {
//     recommendations: {
//       recommendation_terms: {
//         short_term: {
//           notifications: {}, <<<
export const getRecommendationTermNotifications = (term: RecommendationTerm): Notification[] => {
  if (!term?.notifications) {
    return [];
  }
  return Object.keys(term.notifications).map(key => term.notifications[key]);
};

// Recommendations engine notifications
//
// data: [
//   {
//     recommendations: {
//       notifications: {
//       recommendation_terms: {
//         short_term: {
//           recommendation_engines: {
//             cost: {
//               notifications: {}, <<<
//             },
//             performance: {
//               notifications: {}, <<<
//             },
export const getRecommendationEngineNotifications = (engine: RecommendationEngine): Notification[] => {
  if (!engine?.notifications) {
    return [];
  }
  return Object.keys(engine?.notifications).map(key => engine.notifications[key]);
};

// Returns notifications for given interval
export const hasNotifications = (
  recommendations: Recommendations,
  interval: Interval,
  optimizationType: OptimizationType
) => {
  return getNotifications(recommendations, interval, optimizationType).length > 0;
};

// Returns true if there are notifications at any interval, unless filtering (e.g., to omit optimized notices)
export const hasNotificationsWarning = (recommendations: Recommendations, isFilterNotifications = false) => {
  if (!recommendations) {
    return false;
  }
  const notifications = filterDuplicateNotifications([
    ...getNotifications(recommendations, Interval.short_term, OptimizationType.cost, false),
    ...getNotifications(recommendations, Interval.short_term, OptimizationType.performance, false),
    ...getNotifications(recommendations, Interval.medium_term, OptimizationType.cost, false),
    ...getNotifications(recommendations, Interval.medium_term, OptimizationType.performance, false),
    ...getNotifications(recommendations, Interval.long_term, OptimizationType.cost, false),
    ...getNotifications(recommendations, Interval.long_term, OptimizationType.performance, false),
  ]);
  const filteredNotifications = isFilterNotifications ? filterNotifications(notifications) : notifications;
  return filteredNotifications.length > 0;
};

export const isIntervalOptimized = (
  recommendations: Recommendations,
  interval: Interval,
  optimizationType: OptimizationType
) => {
  let cpuLimitsOptimised = false;
  let cpuRequestsOptimised = false;
  let memoryRequestsOptimised = false;
  let memoryLimitsOptimised = false;

  const notifications = getNotifications(recommendations, interval, optimizationType);
  notifications.forEach(notification => {
    switch (notification.code) {
      case 323005:
        cpuLimitsOptimised = true;
        break;
      case 323004:
        cpuRequestsOptimised = true;
        break;
      case 324003:
        memoryRequestsOptimised = true;
        break;
      case 324004:
        memoryLimitsOptimised = true;
        break;
    }
  });
  return cpuLimitsOptimised && cpuRequestsOptimised && memoryRequestsOptimised && memoryLimitsOptimised;
};
