import formatDate from 'date-fns/format';
import getDate from 'date-fns/get_date';
import getMonth from 'date-fns/get_month';
import startOfMonth from 'date-fns/start_of_month';
import i18next from 'i18next';

export function getNoDataForDateRangeString(key: string = 'no_data_for_date', offset: number = 1) {
  const today = new Date();
  if (offset) {
    today.setMonth(today.getMonth() - offset);
  }

  const month = getMonth(today);
  const endDate = formatDate(today, 'D');
  const startDate = formatDate(startOfMonth(today), 'D');

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
  const endDate = formatDate(today, 'D');
  const startDate = formatDate(startOfMonth(today), 'D');

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
  const endDate = formatDate(today, 'D');
  const startDate = formatDate(startOfMonth(today), 'D');

  return i18next.t(key, {
    count: getDate(today),
    endDate,
    month,
    startDate,
  });
}
