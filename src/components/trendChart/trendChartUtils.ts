import { Report } from 'api/reports';
import format from 'date-fns/format';
import getDate from 'date-fns/get_date';
import startOfMonth from 'date-fns/start_of_month';
import { FormatOptions, ValueFormatter } from 'utils/formatValue';
import {
  ComputedReportItem,
  getComputedReportItems,
} from 'utils/getComputedReportItems';
import { SortDirection } from 'utils/sort';

export interface TrendChartDatum {
  x: number;
  y: number;
  date: string | number;
  units: string;
}

export const enum TrendChartType {
  rolling,
  daily,
}

export function transformReport(
  report: Report,
  type: TrendChartType = TrendChartType.daily
): TrendChartDatum[] {
  if (!report) {
    return [];
  }

  const computedItems = getComputedReportItems({
    report,
    idKey: 'date',
    sortKey: 'id',
    sortDirection: SortDirection.desc,
  });

  if (type === TrendChartType.daily) {
    return computedItems.map(i => createDatum(i.total, i));
  }

  return computedItems.reduce<TrendChartDatum[]>((acc, d) => {
    const prevValue = acc.length ? acc[acc.length - 1].y : 0;
    return [...acc, createDatum(prevValue + d.total, d)];
  }, []);
}

export function createDatum(
  value: number,
  computedItem: ComputedReportItem
): TrendChartDatum {
  return {
    x: getDate(computedItem.id),
    y: value,
    date: computedItem.id,
    units: computedItem.units,
  };
}

export function getDatumDateRange(datums: TrendChartDatum[]): [Date, Date] {
  if (!datums.length) {
    const today = new Date();
    const firstOfMonth = startOfMonth(today);
    return [firstOfMonth, today];
  }

  const start = new Date(datums[0].date + 'T00:00:00');
  const end = new Date(datums[datums.length - 1].date + 'T00:00:00');
  return [start, end];
}

export function getDateRangeString(datums: TrendChartDatum[]) {
  const [start, end] = getDatumDateRange(datums);
  const monthName = format(start, 'MMM');
  const startDate = getDate(start);
  const endDate = getDate(end);
  return `${monthName} ${getDate(start)}${
    startDate !== endDate ? ` - ${endDate}` : ''
  }`;
}

export function getTooltipLabel(
  datum: TrendChartDatum,
  formatValue: ValueFormatter,
  formatOptions?: FormatOptions
) {
  if (!datum.date) {
    return '';
  }
  const date = format(datum.date, 'MMM D YYYY');
  return `${date}: ${formatValue(datum.y, datum.units, formatOptions)}`;
}
