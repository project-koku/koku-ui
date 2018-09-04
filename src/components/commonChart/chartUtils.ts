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

export interface ChartDatum {
  x: string | number;
  y: number;
  key: string | number;
  name?: string | number;
  units: string;
}

export const enum ChartType {
  rolling,
  daily,
  monthly,
}

export function transformReport(
  report: Report,
  type: ChartType = ChartType.daily,
  key: any = 'date'
): ChartDatum[] {
  if (!report) {
    return [];
  }
  const computedItems = getComputedReportItems({
    report,
    idKey: key,
    sortKey: 'id',
    sortDirection: SortDirection.desc,
  });
  if (type === ChartType.daily) {
    return computedItems.map(i => createDatum(i.total, i, key));
  }

  if (type === ChartType.monthly) {
    return computedItems.map(i => createDatum(i.total, i, key));
  }

  return computedItems.reduce<ChartDatum[]>((acc, d) => {
    const prevValue = acc.length ? acc[acc.length - 1].y : 0;
    return [...acc, createDatum(prevValue + d.total, d, key)];
  }, []);
}

export function createDatum(
  value: number,
  computedItem: ComputedReportItem,
  idKey = 'date'
): ChartDatum {
  const xVal = idKey === 'date' ? getDate(computedItem.id) : computedItem.label;
  return {
    x: xVal,
    y: value,
    key: computedItem.id,
    name: computedItem.id,
    units: computedItem.units,
  };
}

export function getDatumDateRange(datums: ChartDatum[]): [Date, Date] {
  if (!datums.length) {
    const today = new Date();
    const firstOfMonth = startOfMonth(today);
    return [firstOfMonth, today];
  }

  const start = new Date(datums[0].key + 'T00:00:00');
  const end = new Date(datums[datums.length - 1].key + 'T00:00:00');
  return [start, end];
}

export function getDateRangeString(datums: ChartDatum[]) {
  const [start, end] = getDatumDateRange(datums);
  const monthName = format(start, 'MMM');
  const startDate = getDate(start);
  const endDate = getDate(end);
  return `${monthName} ${getDate(start)}${
    startDate !== endDate ? ` - ${endDate}` : ''
  }`;
}

export function getTooltipLabel(
  datum: ChartDatum,
  formatValue: ValueFormatter,
  formatOptions?: FormatOptions,
  idKey: any = 'date'
) {
  if (!datum.key) {
    return '';
  }
  if (idKey === 'date') {
    const date = format(datum.key, 'MMM D YYYY');
    return `${date}: ${formatValue(datum.y, datum.units, formatOptions)}`;
  }
  return datum.key.toString();
}
