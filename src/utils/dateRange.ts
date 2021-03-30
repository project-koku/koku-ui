import { endOfMonth, format, getDate, getMonth, startOfMonth } from 'date-fns';
import i18next from 'i18next';

export function getNoDataForDateRangeString(key: string = 'no_data_for_date', offset: number = 1) {
  const today = new Date();
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
  today.setMonth(today.getMonth() - offset);
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
