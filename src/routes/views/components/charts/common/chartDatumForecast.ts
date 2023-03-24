import type { Forecast } from 'api/forecasts/forecast';
import { getDate } from 'date-fns';
import type { ComputedForecastItem } from 'utils/computedForecast/getComputedForecastItems';
import { getComputedForecastItems } from 'utils/computedForecast/getComputedForecastItems';
import { SortDirection } from 'utils/sort';

import type { ChartDatum } from './chartDatum';
import { DatumType, isFloat, isInt, padChartDatums } from './chartDatum';

// The computed forecast cost
// eslint-disable-next-line no-shadow
export const enum ComputedForecastItemType {
  cost = 'cost',
  infrastructure = 'infrastructure',
  supplementary = 'supplementary',
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
