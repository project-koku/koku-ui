import type { Query } from 'api/queries/query';
import { endOfMonth, format } from 'date-fns';
import { getCurrentMonthDate, getLast30DaysDate, getLast60DaysDate, getLast90DaysDate } from 'utils/dates';

// The date range drop down has the options below (if today is Jan 18th…)
// eslint-disable-next-line no-shadow
export const enum DateRangeType {
  currentMonthToDate = 'current_month_to_date', // Current month (Jan 1 - Jan 18)
  previousMonth = 'previous_month', // Previous and current month (Dec 1 - Dec 31)
  previousMonthToDate = 'previous_month_to_date', // Previous and current month (Dec 1 - Jan 18)
  lastNinetyDays = 'last_ninety_days', // Last 90 days
  lastSixtyDays = 'last_sixty_days', // Last 60 days (Nov 18 - Jan 17)
  lastThirtyDays = 'last_thirty_days', // Last 30 days (Dec 18 - Jan 17)
}

export const getDateRange = (dateRangeType: DateRangeType) => {
  const endDate = new Date();
  const startDate = new Date();
  let dateRange;

  switch (dateRangeType) {
    case DateRangeType.previousMonth:
      endDate.setDate(1); // Required to obtain correct month
      startDate.setDate(1); // Required to obtain correct month
      endDate.setMonth(endDate.getMonth() - 1);
      startDate.setMonth(startDate.getMonth() - 1);

      dateRange = {
        end_date: format(endOfMonth(endDate), 'yyyy-MM-dd'),
        start_date: format(startDate, 'yyyy-MM-dd'),
      };
      break;
    case DateRangeType.previousMonthToDate:
      startDate.setDate(1); // Required to obtain correct month
      startDate.setMonth(startDate.getMonth() - 1); // Note: Must include previous and current month

      dateRange = {
        end_date: format(endDate, 'yyyy-MM-dd'),
        start_date: format(startDate, 'yyyy-MM-dd'),
      };
      break;
    case DateRangeType.lastNinetyDays:
      dateRange = getLast90DaysDate();
      break;
    case DateRangeType.lastSixtyDays:
      dateRange = getLast60DaysDate();
      break;
    case DateRangeType.lastThirtyDays:
      dateRange = getLast30DaysDate();
      break;
    case DateRangeType.currentMonthToDate:
    default:
      dateRange = getCurrentMonthDate();
      break;
  }
  return dateRange;
};

export const getDateRangeDefault = (queryFromRoute: Query) => {
  return queryFromRoute.dateRange || DateRangeType.currentMonthToDate;
};
