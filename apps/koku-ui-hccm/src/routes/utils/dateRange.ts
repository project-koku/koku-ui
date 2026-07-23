import type { Query } from 'api/queries/query';
import { endOfMonth } from 'date-fns';
import { formatStartEndDate, getCurrentMonthDate } from 'utils/dates';

// The date range drop down has the options below (if today is Jan 18th…)
export const enum DateRangeType {
  currentMonthToDate = 'current_month_to_date', // Current month (Jan 1 - Jan 18)
  custom = 'custom', // Any date range within the data retention period, but no more than 62 days total by default for best API performance
  previousMonth = 'previous_month', // Previous and current month (Dec 1 - Dec 31)
  maximum = 'maximum', // Max data retention period in months
  lastTwoMonths = 'last_two_months', // Last 2 months
  lastThreeMonths = 'last_three_months', // Last 3 months
  lastSixMonths = 'last_six_months', // Last 6 months
  lastTwelveMonths = 'last_twelve_months', // Last 12 months
}

export const getDateRangeById = (value: string) => {
  switch (value) {
    case 'current_month_to_date':
      return DateRangeType.currentMonthToDate;
    case 'custom':
      return DateRangeType.custom;
    case 'previous_month':
      return DateRangeType.previousMonth;
    case 'last_two_months':
      return DateRangeType.lastTwoMonths;
    case 'last_three_months':
      return DateRangeType.lastThreeMonths;
    case 'last_six_months':
      return DateRangeType.lastSixMonths;
    case 'last_twelve_months':
      return DateRangeType.lastTwelveMonths;
    case 'maximum':
      return DateRangeType.maximum;
  }
};

export const getDateRange = (dateRangeType: DateRangeType, dataRetentionMonths: number = 3, isFormatted = true) => {
  const maxMonths = dataRetentionMonths ? dataRetentionMonths - 1 : 3;
  const endDate = new Date();
  const startDate = new Date();
  let dateRange;

  switch (dateRangeType) {
    case DateRangeType.previousMonth:
      endDate.setDate(1); // Required to obtain correct month
      startDate.setDate(1); // Required to obtain correct month
      endDate.setMonth(endDate.getMonth() - 1);
      startDate.setMonth(startDate.getMonth() - 1);
      dateRange = formatStartEndDate(startDate, endOfMonth(endDate), isFormatted);
      break;
    case DateRangeType.lastTwoMonths:
      startDate.setDate(1); // Required to obtain correct month
      startDate.setMonth(startDate.getMonth() - 1); // Includes current month
      dateRange = formatStartEndDate(startDate, endDate, isFormatted);
      break;
    case DateRangeType.lastThreeMonths:
      startDate.setDate(1); // Required to obtain correct month
      startDate.setMonth(startDate.getMonth() - 2); // Includes current month
      dateRange = formatStartEndDate(startDate, endDate, isFormatted);
      break;
    case DateRangeType.lastSixMonths:
      startDate.setDate(1); // Required to obtain correct month
      startDate.setMonth(startDate.getMonth() - 5); // Includes current month
      dateRange = formatStartEndDate(startDate, endDate, isFormatted);
      break;
    case DateRangeType.lastTwelveMonths:
      startDate.setDate(1); // Required to obtain correct month
      startDate.setMonth(startDate.getMonth() - 11); // Includes current month
      dateRange = formatStartEndDate(startDate, endDate, isFormatted);
      break;
    case DateRangeType.maximum:
      startDate.setDate(1); // Required to obtain correct month
      startDate.setMonth(startDate.getMonth() - maxMonths); // Includes current month
      dateRange = formatStartEndDate(startDate, endDate, isFormatted);
      break;
    case DateRangeType.currentMonthToDate:
    default:
      dateRange = getCurrentMonthDate(isFormatted);
      break;
  }
  return dateRange;
};

export const getCurrentDateRangeType = (timeScopeValue: number) => {
  return timeScopeValue === -2 ? DateRangeType.previousMonth : DateRangeType.currentMonthToDate;
};

export const getDateRangeTypeDefault = (queryFromRoute: Query, defaultToPreviousMonth: boolean): DateRangeType => {
  if (queryFromRoute.dateRangeType) {
    return queryFromRoute.dateRangeType;
  }
  return defaultToPreviousMonth ? DateRangeType.previousMonth : DateRangeType.currentMonthToDate;
};

export const getDateRangeFromQuery = (
  queryFromRoute: Query,
  dataRetentionMonths: number = 3,
  defaultToPreviousMonth: boolean = false
) => {
  const dateRangeType = getDateRangeTypeDefault(queryFromRoute, defaultToPreviousMonth);
  const dateRange =
    dateRangeType === DateRangeType.custom
      ? { start_date: queryFromRoute.start_date, end_date: queryFromRoute.end_date }
      : getDateRange(dateRangeType, dataRetentionMonths);
  return {
    dateRangeType,
    end_date: dateRange.end_date,
    start_date: dateRange.start_date,
  };
};
