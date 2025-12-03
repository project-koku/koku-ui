import type { Forecast } from '@koku-ui/api/forecasts/forecast';
import type { Report } from '@koku-ui/api/reports/report';
import { getDate } from 'date-fns';
import { cloneDeep } from 'lodash';

import type { ComputedForecastItem } from '../../../utils/computedForecast/getComputedForecastItems';
import { getComputedForecastItems } from '../../../utils/computedForecast/getComputedForecastItems';
import { SortDirection } from '../../../utils/sort';
import type { ChartDatum } from './chartDatum';
import { DatumType, isFloat, isInt, padChartDatums } from './chartDatum';

// The computed forecast cost
export const enum ComputedForecastItemType {
  cost = 'cost',
  infrastructure = 'infrastructure',
  supplementary = 'supplementary',
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

export function getComputedForecast(
  forecast: Forecast,
  report: Report,
  computedForecastItem: string = 'cost',
  datumType: DatumType = DatumType.cumulative
) {
  const newForecast = cloneDeep(forecast);

  if (newForecast) {
    newForecast.data = []; // Keep meta, but clear data array
  }

  if (forecast && report?.data) {
    const total =
      report?.meta?.total && report.meta.total[computedForecastItem]
        ? report.meta.total[computedForecastItem].total.value
        : 0;
    const units =
      report?.meta?.total && report.meta.total[computedForecastItem]
        ? report.meta.total[computedForecastItem].total.units
        : 'USD';

    // Find last currentData date with values
    const reportedValues = report.data.filter(val => val.values.length);
    const lastReported = reportedValues[reportedValues.length - 1]
      ? reportedValues[reportedValues.length - 1].date
      : undefined;

    // Remove overlapping forecast dates, if any
    if (forecast && forecast.data && forecast.data.length > 0) {
      const lastReportedDate = new Date(lastReported);
      const lastReportedMonth = lastReportedDate.getMonth() + 1;
      for (const item of forecast.data) {
        const forecastDate = new Date(item.date);
        const forecastMonth = forecastDate.getMonth() + 1;

        // Ensure month match. AWS forecast may begin with "2020-12-04", but ends on "2021-01-01"
        if (forecastDate > lastReportedDate && lastReportedMonth === forecastMonth) {
          newForecast.data.push(item);
        }
      }

      // For cumulative data, forecast values should begin at last reported total with zero confidence values
      if (datumType === DatumType.cumulative) {
        const firstReported =
          forecast.data[0].values && forecast.data[0].values.length > 0 ? forecast.data[0].values[0].date : undefined;

        const date = getNumberOfDays(lastReported, firstReported) === 1 ? lastReported : firstReported;

        newForecast.data.unshift({
          date,
          values: [
            {
              date,
              cost: {
                confidence_max: {
                  value: 0,
                },
                confidence_min: {
                  value: 0,
                },
                total: {
                  value: total,
                  units,
                },
              },
              infrastructure: {
                confidence_max: {
                  value: 0,
                },
                confidence_min: {
                  value: 0,
                },
                total: {
                  value: total,
                  units,
                },
              },
              supplementary: {
                confidence_max: {
                  value: 0,
                },
                confidence_min: {
                  value: 0,
                },
                total: {
                  value: total,
                  units,
                },
              },
            },
          ],
        });
      }
    }
  }
  return newForecast;
}

export function getNumberOfDays(start: string, end: string) {
  const date1 = new Date(start);
  const date2 = new Date(end);

  // One day in milliseconds
  const oneDay = 1000 * 60 * 60 * 24;

  // Calculating the time difference between two dates
  const diffInTime = date2.getTime() - date1.getTime();

  // Calculating the no. of days between two dates
  const diffInDays = Math.round(diffInTime / oneDay);

  return diffInDays;
}

export function transformForecast(
  forecast: Forecast,
  datumType,
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
  if (datumType === DatumType.cumulative) {
    chartDatums = computedItems.reduce<ChartDatum[]>((acc, d) => {
      const prevValue = acc.length ? acc[acc.length - 1].y : 0;
      return [...acc, createForecastDatum(prevValue + d[forecastItem][forecastItemValue].value, d)];
    }, []);
  } else {
    chartDatums = computedItems.map(i => createForecastDatum(i[forecastItem][forecastItemValue].value, i));
  }
  return padChartDatums(chartDatums, datumType);
}

export function transformForecastCone(
  forecast: Forecast,
  datumType,
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
  if (datumType === DatumType.cumulative) {
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
  } else {
    chartDatums = computedItems.map(i =>
      createForecastConeDatum(i[forecastItem].confidence_max.value, i[forecastItem].confidence_min.value, i)
    );
  }
  return padChartDatums(chartDatums, datumType);
}
