import type { MessageDescriptor } from '@formatjs/intl/src/types';
import { intl } from 'components/i18n';
import { endOfMonth, format, startOfMonth } from 'date-fns';
import messages from 'locales/messages';

export function getToday(hrs: number = 0, min: number = 0, sec: number = 0) {
  const today = new Date();

  today.setHours(hrs);
  today.setMinutes(min);
  today.setSeconds(sec);

  return today;
}

export function getNoDataForDateRangeString(message: MessageDescriptor = messages.noDataForDate, offset: number = 1) {
  const endDate = getToday();
  const startDate = getToday();

  startDate.setDate(1);

  if (offset) {
    startDate.setMonth(startDate.getMonth() - offset);
    endDate.setMonth(endDate.getMonth() - offset);
  }
  const dateRange = intl.formatDateTimeRange(startDate, endDate, {
    day: 'numeric',
    month: 'long',
  });
  return intl.formatMessage(message, { dateRange });
}

export function getForDateRangeString(
  value: string | number,
  message: MessageDescriptor = messages.forDate,
  offset = 1
) {
  const endDate = getToday();
  const startDate = getToday();

  startDate.setDate(1);

  if (offset) {
    startDate.setMonth(startDate.getMonth() - offset);
    endDate.setMonth(endDate.getMonth() - offset);
  }
  const dateRange = intl.formatDateTimeRange(startDate, endDate, {
    day: 'numeric',
    month: 'long',
  });
  return intl.formatMessage(message, { dateRange, value });
}

export function getSinceDateRangeString(message: MessageDescriptor = messages.sinceDate) {
  const endDate = getToday();
  const startDate = getToday();

  startDate.setDate(1);
  const dateRange = intl.formatDateTimeRange(startDate, endDate, {
    day: 'numeric',
    month: 'long',
  });
  return intl.formatMessage(message, { dateRange });
}

export function getTotalCostDateRangeString(
  value: string | number,
  message: MessageDescriptor = messages.breakdownTotalCostDate
) {
  const endDate = getToday();
  const startDate = getToday();

  startDate.setDate(1);
  const dateRange = intl.formatDateTimeRange(startDate, endDate, {
    day: 'numeric',
    month: 'long',
  });
  return intl.formatMessage(message, { dateRange, value });
}

export function getMonthDate(offset: number) {
  const today = getToday();
  if (offset) {
    today.setDate(1); // Required to obtain correct month
    today.setMonth(today.getMonth() - offset);
  }
  const start_date = format(startOfMonth(today), 'yyyy-MM-dd');
  const end_date = format(offset ? endOfMonth(today) : today, 'yyyy-MM-dd');

  return { start_date, end_date };
}

export function getCurrentMonthDate() {
  return getMonthDate(0);
}

// Returns offset + 1 days, including today's date. See https://issues.redhat.com/browse/COST-1117
export function getLastDaysDate(offset: number) {
  const endDate = new Date();
  const startDate = new Date();

  startDate.setDate(startDate.getDate() - offset);

  return {
    end_date: format(endDate, 'yyyy-MM-dd'),
    start_date: format(startDate, 'yyyy-MM-dd'),
  };
}

// Returns 31 days, including today's date
export function getLast30DaysDate() {
  return getLastDaysDate(30);
}

// Returns 61 days, including today's date
export function getLast60DaysDate() {
  return getLastDaysDate(60);
}

// Returns 91 days, including today's date
export function getLast90DaysDate() {
  return getLastDaysDate(90);
}
