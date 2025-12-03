import type { MessageDescriptor } from '@formatjs/intl/src/types';
import { intl } from '@koku-ui/i18n/i18n';
import messages from '@koku-ui/i18n/locales/messages';
import { endOfMonth, format, startOfMonth } from 'date-fns';

export const formatDate = (date, isFormatted = true) => {
  return date && isFormatted ? format(date, 'yyyy-MM-dd') : date;
};

export const formatStartEndDate = (startDate, endDate, isFormatted = true) => {
  return {
    end_date: formatDate(endDate, isFormatted),
    start_date: formatDate(startDate, isFormatted),
  };
};

export const getToday = (hrs: number = 0, min: number = 0, sec: number = 0, ms: number = 0) => {
  const today = new Date();

  today.setHours(hrs);
  today.setMinutes(min);
  today.setSeconds(sec);
  today.setMilliseconds(ms);

  return today;
};

export const getNoDataForDateRangeString = (
  message: MessageDescriptor = messages.noDataForDate,
  offset: number = 0,
  isEndOfMonth = false
) => {
  const endDate = getToday();
  const startDate = getToday();

  startDate.setDate(1);

  if (offset) {
    startDate.setMonth(startDate.getMonth() - offset);
    if (isEndOfMonth) {
      endDate.setMonth(endDate.getMonth() - offset + 1, 0);
    } else {
      endDate.setMonth(endDate.getMonth() - offset);
    }
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
  offset = 0,
  isEndOfMonth = false
) => {
  const endDate = getToday();
  const startDate = getToday();

  startDate.setDate(1);

  if (offset) {
    startDate.setMonth(startDate.getMonth() - offset);
    if (isEndOfMonth) {
      endDate.setMonth(endDate.getMonth() - offset + 1, 0);
    } else {
      endDate.setMonth(endDate.getMonth() - offset);
    }
  }
  const dateRange = intl.formatDateTimeRange(startDate, endDate, {
    day: 'numeric',
    month: 'long',
  });
  return intl.formatMessage(message, { dateRange, value });
};

export const getSinceDateRangeString = (
  message: MessageDescriptor = messages.sinceDate,
  offset = 0,
  isEndOfMonth = false
) => {
  const endDate = getToday();
  const startDate = getToday();

  startDate.setDate(1);

  if (offset) {
    startDate.setMonth(startDate.getMonth() - offset);
    if (isEndOfMonth) {
      endDate.setMonth(endDate.getMonth() - offset + 1, 0);
    } else {
      endDate.setMonth(endDate.getMonth() - offset);
    }
  }
  const dateRange = intl.formatDateTimeRange(startDate, endDate, {
    day: 'numeric',
    month: 'long',
  });
  return intl.formatMessage(message, { dateRange });
};

export const getTotalCostDateRangeString = (
  value: string | number,
  message: MessageDescriptor = messages.breakdownTotalCostDate,
  offset = 0,
  isEndOfMonth = false
) => {
  const endDate = getToday();
  const startDate = getToday();

  startDate.setDate(1);

  if (offset) {
    startDate.setMonth(startDate.getMonth() - offset);
    if (isEndOfMonth) {
      endDate.setMonth(endDate.getMonth() - offset + 1, 0);
    } else {
      endDate.setMonth(endDate.getMonth() - offset);
    }
  }
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

export const getTimeFromNow = (lastDate: string) => {
  const WEEK_IN_MILLIS = 6.048e8;
  const DAY_IN_MILLIS = 8.64e7;
  const HOUR_IN_MILLIS = 3.6e6;
  const MIN_IN_MILLIS = 6e4;
  const SEC_IN_MILLIS = 1e3;

  const getUTCTime = date => date.getTime() - date.getTimezoneOffset() * 60000;
  const currentUTCTime = getUTCTime(new Date());
  const lastUTCTime = lastDate ? getUTCTime(new Date(lastDate)) : currentUTCTime;
  const diff = currentUTCTime - lastUTCTime;

  if (Math.abs(diff) > WEEK_IN_MILLIS) {
    return intl.formatRelativeTime(Math.trunc(-(diff / WEEK_IN_MILLIS)), 'week');
  } else if (Math.abs(diff) > DAY_IN_MILLIS) {
    return intl.formatRelativeTime(Math.trunc(-(diff / DAY_IN_MILLIS)), 'day');
  } else if (Math.abs(diff) > HOUR_IN_MILLIS) {
    return intl.formatRelativeTime(Math.trunc(-(diff % DAY_IN_MILLIS) / HOUR_IN_MILLIS), 'hour');
  } else if (Math.abs(diff) > MIN_IN_MILLIS) {
    return intl.formatRelativeTime(Math.trunc(-(diff % HOUR_IN_MILLIS) / MIN_IN_MILLIS), 'minute');
  } else {
    return intl.formatRelativeTime(Math.trunc(-(diff % MIN_IN_MILLIS) / SEC_IN_MILLIS), 'second');
  }
};
