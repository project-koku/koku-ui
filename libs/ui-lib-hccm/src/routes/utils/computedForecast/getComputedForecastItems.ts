import type { Forecast, ForecastData } from '@koku-ui/api/forecasts/forecast';

import { sort, SortDirection } from '../sort';

export interface ComputedForecastValue {
  units?: string;
  value?: number | string;
}

export interface ComputedForecastItemValue {
  confidence_max?: ComputedForecastValue;
  confidence_min?: ComputedForecastValue;
  rsquared?: ComputedForecastValue;
  pvalues?: ComputedForecastValue;
  total?: ComputedForecastValue;
}

export interface ComputedForecastItem {
  cost?: ComputedForecastItemValue;
  date?: string;
  infrastructure?: ComputedForecastItemValue;
  supplementary?: ComputedForecastItemValue;
}

export interface ComputedForecastItemsParams<F extends Forecast> {
  forecast: F;
  sortKey?: keyof ComputedForecastItem;
  sortDirection?: SortDirection;
}

export function getComputedForecastItems<F extends Forecast>({
  forecast,
  sortDirection = SortDirection.asc,
  sortKey = 'date',
}: ComputedForecastItemsParams<F>) {
  return sort(
    getUnsortedComputedForecastItems<F>({
      forecast,
      sortDirection,
      sortKey,
    }),
    {
      key: sortKey,
      direction: sortDirection,
    }
  );
}

function getCostData(val, key, item?: any) {
  return {
    confidence_max: {
      value: item
        ? item[key].confidence_max.value
        : 0 + val[key] && val[key].confidence_max
          ? val[key].confidence_max.value
          : 0,
      units: val[key] && val[key].confidence_max ? val[key].confidence_max.units : 'USD',
    },
    confidence_min: {
      value: item
        ? item[key].confidence_min.value
        : 0 + val[key] && val[key].confidence_min
          ? val[key].confidence_min.value
          : 0,
      units: val[key] && val[key].confidence_min ? val[key].confidence_min.units : 'USD',
    },
    pvalues: {
      value: val[key] && val[key].pvalues ? Number(val[key].pvalues.value) : 0,
      units: val[key] && val[key].pvalues ? val[key].pvalues.units : null,
    },
    rsquared: {
      value: val[key] && val[key].rsquared ? Number(val[key].rsquared.value) : 0,
      units: val[key] && val[key].rsquared ? val[key].rsquared.units : null,
    },
    total: {
      value: item ? item[key].total.value : 0 + val[key] && val[key].total ? val[key].total.value : 0,
      units: val[key] && val[key].total ? val[key].total.units : 'USD',
    },
  };
}

export function getUnsortedComputedForecastItems<F extends Forecast>({
  forecast,
}: ComputedForecastItemsParams<F>): ComputedForecastItem[] {
  if (!forecast) {
    return [];
  }

  const itemMap: Map<string | number, ComputedForecastItem> = new Map();

  const visitDataPoint = (dataPoint: ForecastData) => {
    if (dataPoint && dataPoint.values) {
      dataPoint.values.forEach((val: any) => {
        const date = val.date;

        const item = itemMap.get(date);
        if (item) {
          // This code block is typically entered with filter[resolution]=monthly
          itemMap.set(date, {
            ...item,
            date,
            cost: getCostData(val, 'cost', item),
            infrastructure: getCostData(val, 'infrastructure', item),
            supplementary: getCostData(val, 'supplementary', item),
          });
        } else {
          // This code block is typically entered with filter[resolution]=daily
          itemMap.set(date, {
            date,
            cost: getCostData(val, 'cost'),
            infrastructure: getCostData(val, 'infrastructure'),
            supplementary: getCostData(val, 'supplementary'),
          });
        }
      });
    }
    for (const key in dataPoint) {
      if (dataPoint[key] instanceof Array) {
        return dataPoint[key].forEach(visitDataPoint);
      }
    }
  };
  if (forecast && forecast.data) {
    forecast.data.forEach(visitDataPoint);
  }
  return Array.from(itemMap.values());
}
