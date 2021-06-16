import { Forecast } from 'api/forecasts/forecast';
import { Report } from 'api/reports/report';
import { endOfMonth, format, getDate, getYear, startOfMonth } from 'date-fns';
import i18next from 'i18next';
import messages from 'locales/messages';
import { ComputedForecastItem, getComputedForecastItems } from 'utils/computedForecast/getComputedForecastItems';
import { ComputedReportItem, getComputedReportItems } from 'utils/computedReport/getComputedReportItems';
import { FormatOptions, unitLookupKey, ValueFormatter } from 'utils/formatValue';
import { createIntlEnv } from 'utils/localeEnv';
import { SortDirection } from 'utils/sort';

export interface ChartDatum {
  childName?: string;
  date?: string;
  key: string | number;
  name?: string | number;
  show?: boolean;
  tooltip?: string;
  units: string;
  x: string | number;
  y: number;
  y0?: number;
}

// The computed forecast cost
// eslint-disable-next-line no-shadow
export const enum ComputedForecastItemType {
  cost = 'cost',
  infrastructure = 'infrastructure',
  supplementary = 'supplementary',
}

// The computed report cost or usage item
// eslint-disable-next-line no-shadow
export const enum ComputedReportItemType {
  cost = 'cost', // cost.total.value
  infrastructure = 'infrastructure', // infrastructure.total.value
  supplementary = 'supplementary', // supplementary.total.value
  usage = 'usage', // usage.value
}

// The computed report value
// eslint-disable-next-line no-shadow
export const enum ComputedReportItemValueType {
  none = 'none', // A value type is not used in this scenario (e.g., usage.value)
  markup = 'markup', // infrastructure.markup.value
  raw = 'raw', // infrastructure.raw.value
  total = 'total', // // infrastructure.total.value
  usage = 'usage', // infrastructure.usage.value
}

// eslint-disable-next-line no-shadow
export const enum ChartType {
  rolling,
  daily,
  monthly,
}

const intl = createIntlEnv('en');

export function transformForecast(
  forecast: Forecast,
  type: ChartType = ChartType.daily,
  forecastItem: string = 'cost',
  forecastItemValue: string = 'total'
): ChartDatum[] {
  if (!forecast) {
    return [];
  }
  const items = {
    forecast,
    sortKey: 'date',
    sortDirection: SortDirection.desc,
  } as any;
  const computedItems = getComputedForecastItems(items);
  let chartDatums;
  if (type === ChartType.daily || type === ChartType.monthly) {
    chartDatums = computedItems.map(i => createForecastDatum(i[forecastItem][forecastItemValue].value, i));
  } else {
    chartDatums = computedItems.reduce<ChartDatum[]>((acc, d) => {
      const prevValue = acc.length ? acc[acc.length - 1].y : 0;
      return [...acc, createForecastDatum(prevValue + d[forecastItem][forecastItemValue].value, d)];
    }, []);
  }
  return padChartDatums(chartDatums, type);
}

export function transformForecastCone(
  forecast: Forecast,
  type: ChartType = ChartType.daily,
  forecastItem: string = 'cost',
  forecastItemValue: string = 'total'
): ChartDatum[] {
  if (!forecast) {
    return [];
  }
  const items = {
    forecast,
    sortKey: 'date',
    sortDirection: SortDirection.desc,
  } as any;
  const computedItems = getComputedForecastItems(items);
  let chartDatums;
  if (type === ChartType.daily || type === ChartType.monthly) {
    chartDatums = computedItems.map(i =>
      createForecastConeDatum(i[forecastItem].confidence_max.value, i[forecastItem].confidence_min.value, i)
    );
  } else {
    chartDatums = computedItems.reduce<ChartDatum[]>((acc, d) => {
      const prevMaxValue = acc.length ? acc[acc.length - 1].y : d[forecastItem][forecastItemValue].value;
      const prevMinValue = acc.length ? acc[acc.length - 1].y0 : d[forecastItem][forecastItemValue].value;
      return [
        ...acc,
        createForecastConeDatum(
          prevMaxValue + d[forecastItem].confidence_max.value,
          prevMinValue + d[forecastItem].confidence_min.value,
          d
        ),
      ];
    }, []);
  }
  return padChartDatums(chartDatums, type);
}

export function transformReport(
  report: Report,
  type: ChartType = ChartType.daily,
  idKey: any = 'date',
  reportItem: string = 'cost',
  reportItemValue: string = 'total' // useful for infrastructure.usage values
): ChartDatum[] {
  if (!report) {
    return [];
  }
  const items = {
    idKey,
    report,
    sortKey: 'id',
    sortDirection: SortDirection.desc,
  } as any;
  const computedItems = getComputedReportItems(items);
  let chartDatums;
  if (type === ChartType.daily || type === ChartType.monthly) {
    chartDatums = computedItems.map(i => {
      const val = i[reportItem][reportItemValue] ? i[reportItem][reportItemValue].value : i[reportItem].value;
      return createReportDatum(val, i, idKey, reportItem, reportItemValue);
    });
  } else {
    chartDatums = computedItems.reduce<ChartDatum[]>((acc, d) => {
      const prevValue = acc.length ? acc[acc.length - 1].y : 0;
      const val = d[reportItem][reportItemValue] ? d[reportItem][reportItemValue].value : d[reportItem].value;
      return [...acc, createReportDatum(prevValue + val, d, idKey, reportItem, reportItemValue)];
    }, []);
  }
  return idKey === 'date' ? padChartDatums(chartDatums, type) : chartDatums;
}

export function createForecastDatum<T extends ComputedForecastItem>(
  value: number,
  computedItem: T,
  forecastItem: string = 'cost',
  forecastItemValue: string = 'total'
): ChartDatum {
  const xVal = getDate(new Date(computedItem.date + 'T00:00:00'));
  const yVal = isFloat(value) ? parseFloat(value.toFixed(2)) : isInt(value) ? value : 0;
  return {
    x: xVal,
    y: value === null ? null : yVal, // For displaying "no data" labels in chart tooltips
    key: computedItem.date,
    units:
      computedItem[forecastItem] && computedItem[forecastItem][forecastItemValue]
        ? computedItem[forecastItem][forecastItemValue].units
        : undefined,
  };
}

export function createForecastConeDatum<T extends ComputedForecastItem>(
  maxValue: number,
  minValue: number,
  computedItem: T,
  forecastItem: string = 'cost',
  forecastItemValue: string = 'total'
): ChartDatum {
  const xVal = getDate(new Date(computedItem.date + 'T00:00:00'));
  const yVal = isFloat(maxValue) ? parseFloat(maxValue.toFixed(2)) : isInt(maxValue) ? maxValue : 0;
  const y0Val = isFloat(minValue) ? parseFloat(minValue.toFixed(2)) : isInt(minValue) ? minValue : 0;
  return {
    x: xVal,
    y: maxValue === null ? null : yVal, // For displaying "no data" labels in chart tooltips
    y0: minValue === null ? null : y0Val,
    key: computedItem.date,
    units:
      computedItem[forecastItem] && computedItem[forecastItem][forecastItemValue]
        ? computedItem[forecastItem][forecastItemValue].units
        : undefined,
  };
}

export function createReportDatum<T extends ComputedReportItem>(
  value: number,
  computedItem: T,
  idKey = 'date',
  reportItem: string = 'cost',
  reportItemValue: string = 'total' // useful for infrastructure.usage values
): ChartDatum {
  const xVal = idKey === 'date' ? getDate(new Date(computedItem.id + 'T00:00:00')) : computedItem.label;
  const yVal = isFloat(value) ? parseFloat(value.toFixed(2)) : isInt(value) ? value : 0;
  return {
    x: xVal,
    y: value === null ? null : yVal, // For displaying "no data" labels in chart tooltips
    key: computedItem.id,
    name: computedItem.label ? computedItem.label : computedItem.id, // legend item label
    units: computedItem[reportItem]
      ? computedItem[reportItem][reportItemValue]
        ? computedItem[reportItem][reportItemValue].units // cost, infrastructure, supplementary
        : computedItem[reportItem].units // capacity, limit, request, usage
      : undefined,
  };
}

// Fill in missing data with previous value to represent cumulative daily cost
export function fillChartDatums(datums: ChartDatum[], type: ChartType = ChartType.daily): ChartDatum[] {
  const result = [];
  if (!datums || datums.length === 0) {
    return result;
  }
  const firstDate = new Date(datums[0].key + 'T00:00:00');
  const lastDate = new Date(datums[datums.length - 1].key + 'T00:00:00');

  const padDate = startOfMonth(firstDate);
  let prevChartDatum;
  for (let i = padDate.getDate(); i <= endOfMonth(lastDate).getDate(); i++) {
    padDate.setDate(i);
    const id = format(padDate, 'yyyy-MM-dd');
    const chartDatum = datums.find(val => val.key === id);
    if (chartDatum) {
      result.push(chartDatum);
    } else if (prevChartDatum) {
      result.push({
        ...prevChartDatum,
        key: id,
        x: getDate(new Date(id + 'T00:00:00')),
      });
    }
    if (chartDatum) {
      // Note: We want to identify missing data, but charts won't extrapolate (connect data points) if we return null here
      // for missing daily values. For example, if there is only data for the first and last day of the month, charts would
      // typically draw a line between two points by default. However, showing "no data" is more obvious there was a problem.
      if (type === ChartType.daily) {
        prevChartDatum = {
          key: id,
          x: getDate(new Date(id + 'T00:00:00')),
          y: null,
        };
      } else {
        prevChartDatum = chartDatum;
      }
    }
  }
  return result;
}

// This pads chart datums with null datum objects, representing missing data at the beginning and end of the
// data series. The remaining data is left as is to allow for extrapolation. This allows us to display a "no data"
// message in the tooltip, which helps distinguish between zero values and when there is no data available.
export function padChartDatums(datums: ChartDatum[], type: ChartType = ChartType.daily): ChartDatum[] {
  const result = [];
  if (!datums || datums.length === 0) {
    return result;
  }
  const firstDate = new Date(datums[0].key + 'T00:00:00');
  const lastDate = new Date(datums[datums.length - 1].key + 'T00:00:00');

  // Pad start for missing data
  let padDate = startOfMonth(firstDate);
  for (let i = padDate.getDate(); i < firstDate.getDate(); i++) {
    padDate.setDate(i);
    const id = format(padDate, 'yyyy-MM-dd');
    result.push(createReportDatum(null, { id }, 'date', null));
  }

  // Fill middle with existing data
  result.push(...datums);

  // Pad end for missing data
  padDate = new Date(lastDate);
  for (let i = padDate.getDate() + 1; i <= endOfMonth(lastDate).getDate(); i++) {
    padDate.setDate(i);
    const id = format(padDate, 'yyyy-MM-dd');
    result.push(createReportDatum(null, { id }, 'date', null));
  }
  return fillChartDatums(result, type);
}

export function getDatumDateRange(datums: ChartDatum[], offset: number = 0): [Date, Date] {
  if (!(datums && datums.length)) {
    const today = new Date();

    // If datums is empty, obtain the month based on offset (e.g., to show previous month in chart legends)
    if (offset) {
      today.setMonth(today.getMonth() - offset);
    }
    const firstOfMonth = startOfMonth(today);
    return [firstOfMonth, today];
  }

  // Find the first populated (non-null) day
  let firstDay = 0;
  for (let i = firstDay; i < datums.length; i++) {
    if (datums[i].y && datums[i].y !== null) {
      firstDay = i;
      break;
    }
  }

  // Find the last populated (non-null) day
  let lastDay = datums.length - 1;
  for (let i = lastDay; i >= 0; i--) {
    if (datums[i].y && datums[i].y !== null) {
      lastDay = i;
      break;
    }
  }

  const start = new Date(datums[firstDay].key + 'T00:00:00');
  const end = new Date(datums[lastDay].key + 'T00:00:00');
  return [start, end];
}

export function getDateRange(
  datums: ChartDatum[],
  firstOfMonth: boolean = true,
  lastOfMonth: boolean = false,
  offset: number = 0
): [Date, Date] {
  const [start, end] = getDatumDateRange(datums, offset);

  // Show the date range we are trying to cover (i.e., days 1-30/31)
  if (firstOfMonth && start.setDate) {
    start.setDate(1);
  }
  if (lastOfMonth && start.setDate) {
    const lastDate = endOfMonth(start).getDate();
    end.setDate(lastDate);
  }
  return [start, end];
}

export function getDateRangeString(
  datums: ChartDatum[],
  firstOfMonth: boolean = false,
  lastOfMonth: boolean = false,
  offset: number = 0
) {
  const [start, end] = getDateRange(datums, firstOfMonth, lastOfMonth, offset);

  const count = getDate(end);
  const endDate = format(end, 'dd');
  // const month = Number(format(start, 'M')) - 1;
  // const month_abbr = Number(format(start, 'MMM')) - 1;
  const month_abbr = Number(intl.formatDate(start, { month: 'short' })) - 1;
  const startDate = format(start, 'dd');
  const year = getYear(end);

  // if (i18next && i18next.t) {
  //   return i18next.t(`chart.date_range`, {
  //     count,
  //     endDate,
  //     month,
  //     startDate,
  //     year,
  //   });
  // }
  // // Federated modules may not have access to the i18next package
  // if (count > 1) {
  //   return `${startDate}-${endDate} ${month_abbr} ${year}`;
  // }
  // return `${startDate} ${month_abbr} ${year}`;
  return intl.formatMessage(messages.ChartDateRange, { count, startDate, endDate, month_abbr, year });
}

export function getMonthRangeString(
  datums: ChartDatum[],
  // key: string = 'chart.month_legend_label',
  offset: number = 0
): [string, string] {
  const [start, end] = getDateRange(datums, true, false, offset);

  // const startMonth = Number(format(start, 'MMM')) - 1;
  // const endMonth = Number(format(end, 'M')) - 1;
  // if (i18next && i18next.t) {
  //   return [
  //     i18next.t(key, {
  //       month: startMonth,
  //     }),
  //     i18next.t(key, {
  //       month: endMonth,
  //     }),
  //   ];
  // }
  // Federated modules may not have access to the i18next package

  const startMonth = Number(intl.formatDate(start, { month: 'short' })) - 1;
  const endMonth = Number(intl.formatDate(end, { month: 'short' })) - 1;

  return [`EN ${startMonth}`, `${endMonth}`];
}

export function getMaxValue(datums: ChartDatum[]) {
  let max = 0;
  if (datums && datums.length) {
    datums.forEach(datum => {
      if (datum.y > max) {
        max = datum.y;
      }
    });
  }
  return max;
}

export function getMaxMinValues(datums: ChartDatum[]) {
  let max = -1;
  let min = -1;
  if (datums && datums.length) {
    datums.forEach(datum => {
      const maxY = datum.y0 !== undefined ? Math.max(datum.y, datum.y0) : datum.y;
      const minY = datum.y0 !== undefined ? Math.min(datum.y, datum.y0) : datum.y;
      if (maxY > max) {
        max = maxY;
      }
      if ((min === -1 || minY < min) && minY !== null) {
        min = minY;
      }
    });
  }
  return { max, min };
}

export function getTooltipContent(formatValue) {
  return function labelFormatter(value: number, unit: string = null, options: FormatOptions = {}) {
    const lookup = unitLookupKey(unit);
    switch (lookup) {
      case 'core-hours':
      case 'hour':
      case 'hrs':
      case 'gb':
      case 'gb-hours':
      case 'gb-mo':
      case 'gibibyte month':
      case 'vm-hours':
        return intl.formatMessage(messages.UnitTooltips, { unit: lookup, value: 'PEANUT' });

      // return i18next.t(`unit_tooltips.${lookup}`, {
      //   value: `${formatValue(value, unit, options)}`,
      // });
      default:
        return `${formatValue(value, unit, options)}`;
    }
  };
}

export function getTooltipLabel(
  datum: ChartDatum,
  formatValue: ValueFormatter,
  formatOptions?: FormatOptions,
  idKey: any = 'date',
  units?: string
) {
  if (!datum.key) {
    return '';
  }
  if (idKey === 'date') {
    const date = format(new Date(datum.key), 'dd MMM yyyy');
    return `${date} ${formatValue(datum.y, units ? units : datum.units, formatOptions)}`;
  }
  return datum.key.toString();
}

export function getCostRangeString(
  datums: ChartDatum[],
  key: string = 'chart.cost_legend_label',
  firstOfMonth: boolean = false,
  lastOfMonth: boolean = false,
  offset: number = 0
) {
  if (!(datums && datums.length)) {
    return i18next.t(`${key}_no_data`);
  }
  const [start, end] = getDateRange(datums, firstOfMonth, lastOfMonth, offset);

  return i18next.t(key, {
    count: getDate(end),
    endDate: format(end, 'd'),
    month: Number(format(start, 'M')) - 1,
    startDate: format(start, 'd'),
    year: getYear(end),
  });
}

export function getUsageRangeString(
  datums: ChartDatum[],
  key: string = 'chart.usage_legend_label',
  firstOfMonth: boolean = false,
  lastOfMonth: boolean = false,
  offset: number = 0
) {
  return getCostRangeString(datums, key, firstOfMonth, lastOfMonth, offset);
}

// Returns true if non negative integer
export function isInt(n) {
  const result = Number(n) === n && n % 1 === 0;
  return result && n >= 0;
}

// Returns true if non negative float
export function isFloat(n) {
  const result = Number(n) === n && n % 1 !== 0;
  return result && n >= 0;
}
