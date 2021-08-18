import { MessageDescriptor } from '@formatjs/intl/src/types';
import { createIntlEnv, getDateFnsLocale } from 'components/i18n/localeEnv';
import { endOfMonth, format, getDate, getMonth, getYear, startOfMonth } from 'date-fns';
import messages from 'locales/messages';

function getToday(hrs: number = 0, min: number = 0, sec: number = 0) {
  const today = new Date();
  today.setHours(hrs);
  today.setMinutes(min);
  today.setSeconds(sec);

  return today;
}

// returns localized abbreviated month name (MMM format)
export function getAbbreviatedMonth(year, month) {
  return getLocalizedMonth(year, month, true);
}

// returns localized month name
export function getLocalizedMonth(year, month, abbreviate: boolean = false) {
  const pattern = abbreviate ? 'MMM' : 'MMMM';
  const monthName = format(new Date(year, month), pattern, { locale: getDateFnsLocale() });

  return monthName;
}

export function getNoDataForDateRangeString(key: MessageDescriptor = messages.NoDataForDate, offset: number = 1) {
  const intl = createIntlEnv();
  const today = getToday();

  if (offset) {
    today.setMonth(today.getMonth() - offset);
  }

  const month = getAbbreviatedMonth(getYear(today), getMonth(today));
  const endDate = format(today, 'd');
  const startDate = format(startOfMonth(today), 'd');

  return intl.formatMessage(key, { count: getDate(today), startDate, endDate, month });
}

export function getForDateRangeString(
  value: string | number,
  message: MessageDescriptor = messages.ForDate,
  offset: number = 1
) {
  const intl = createIntlEnv();
  const today = getToday();

  if (offset) {
    today.setMonth(today.getMonth() - offset);
  }

  const month = getLocalizedMonth(getYear(today), getMonth(today));
  const endDate = format(today, 'd');
  const startDate = format(startOfMonth(today), 'd');

  return intl.formatMessage(message, {
    groupByValue: intl.formatMessage(messages.GroupByValues, { value, count: 2 }),
    count: getDate(today),
    startDate,
    endDate,
    month,
    offset,
  });
}

export function getSinceDateRangeString(key: MessageDescriptor = messages.SinceDate) {
  const intl = createIntlEnv();
  const today = getToday();
  const month = getLocalizedMonth(getYear(today), getMonth(today), false);
  const endDate = format(today, 'd');
  const startDate = format(startOfMonth(today), 'd');

  return intl.formatMessage(key, { count: getDate(today), startDate, endDate, month });
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
