import type { MessageDescriptor } from '@formatjs/intl/src/types';
import { intl } from 'components/i18n';
import { endOfMonth, format, startOfMonth } from 'date-fns';
import messages from 'locales/messages';

export const formatDate = (date, isFormatted = true) => {
  return date && isFormatted ? format(date, 'yyyy-MM-dd') : date;
};

export const formatStartEndDate = (startDate, endDate, isFormatted = true) => {
  return {
    end_date: formatDate(endDate, isFormatted),
    start_date: formatDate(startDate, isFormatted),
  };
};

export const getToday = (hrs: number = 0, min: number = 0, sec: number = 0) => {
  const today = new Date();

  today.setHours(hrs);
  today.setMinutes(min);
  today.setSeconds(sec);

  return today;
};

export const getNoDataForDateRangeString = (
  message: MessageDescriptor = messages.noDataForDate,
  offset: number = 1
) => {
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
};

export const getForDateRangeString = (
  value: string | number,
  message: MessageDescriptor = messages.forDate,
  offset = 1
) => {
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
};

export const getSinceDateRangeString = (message: MessageDescriptor = messages.sinceDate) => {
  const endDate = getToday();
  const startDate = getToday();

  startDate.setDate(1);
  const dateRange = intl.formatDateTimeRange(startDate, endDate, {
    day: 'numeric',
    month: 'long',
  });
  return intl.formatMessage(message, { dateRange });
};

export const getTotalCostDateRangeString = (
  value: string | number,
  message: MessageDescriptor = messages.breakdownTotalCostDate
) => {
  const endDate = getToday();
  const startDate = getToday();

  startDate.setDate(1);
  const dateRange = intl.formatDateTimeRange(startDate, endDate, {
    day: 'numeric',
    month: 'long',
  });
  return intl.formatMessage(message, { dateRange, value });
};

export const getMonthDate = (offset: number, isFormatted = true) => {
  const today = getToday();
  if (offset) {
    today.setDate(1); // Required to obtain correct month
    today.setMonth(today.getMonth() - offset);
  }
  return formatStartEndDate(startOfMonth(today), offset ? endOfMonth(today) : today, isFormatted);
};

export const getCurrentMonthDate = (isFormatted = true) => {
  return getMonthDate(0, isFormatted);
};

// Returns offset + 1 days, including today's date. See https://issues.redhat.com/browse/COST-1117
export const getLastDaysDate = (offset: number, isFormatted = true) => {
  const endDate = getToday();
  const startDate = getToday();

  startDate.setDate(startDate.getDate() - offset);

  return formatStartEndDate(startDate, endDate, isFormatted);
};

// Returns 31 days, including today's date
export const getLast30DaysDate = (isFormatted = true) => {
  return getLastDaysDate(30, isFormatted);
};

// Returns 61 days, including today's date
export const getLast60DaysDate = (isFormatted = true) => {
  return getLastDaysDate(60, isFormatted);
};

// Returns 91 days, including today's date
export const getLast90DaysDate = (isFormatted = true) => {
  return getLastDaysDate(90, isFormatted);
};
