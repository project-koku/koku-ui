import { endOfMonth, format, getDate, getMonth, startOfMonth } from 'date-fns';
import i18next from 'i18next';

export function getNoDataForDateRangeString(key: string = 'no_data_for_date', offset: number = 1) {
  const today = new Date();
  today.setHours(0);
  today.setMinutes(0);
  today.setSeconds(0);

  if (offset) {
    today.setMonth(today.getMonth() - offset);
  }

  const month = getMonth(today);
  const endDate = format(today, 'd');
  const startDate = format(startOfMonth(today), 'd');

  return i18next.t(key, {
    count: getDate(today),
    endDate,
    month,
    startDate,
  });
}

export function getForDateRangeString(value: string | number, key: string = 'for_date', offset: number = 1) {
  const today = new Date();
  today.setHours(0);
  today.setMinutes(0);
  today.setSeconds(0);

  if (offset) {
    today.setMonth(today.getMonth() - offset);
  }

  const month = getMonth(today);
  const endDate = format(today, 'd');
  const startDate = format(startOfMonth(today), 'd');

  return i18next.t(key, {
    count: getDate(today),
    endDate,
    month,
    startDate,
    value,
  });
}

export function getSinceDateRangeString(key: string = 'since_date') {
  const today = new Date();
  today.setHours(0);
  today.setMinutes(0);
  today.setSeconds(0);

  const month = getMonth(today);
  const endDate = format(today, 'd');
  const startDate = format(startOfMonth(today), 'd');

  return i18next.t(key, {
    count: getDate(today),
    endDate,
    month,
    startDate,
  });
}

export function getMonthDate(offset: number) {
  const today = new Date();
  today.setHours(0);
  today.setMinutes(0);
  today.setSeconds(0);

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

export function getPreviousMonthDate() {
  return getMonthDate(1);
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
