import { Forecast, ForecastData, ForecastValue } from 'api/forecasts/forecast';
import { sort, SortDirection } from 'utils/sort';

export interface ComputedForecastItem {
  confidence_max?: number;
  confidence_min?: number;
  date?: string;
  rsquared?: number;
  pvalues?: number;
  total?: number;
  units?: string;
}

export interface ComputedForecastItemsParams<F extends Forecast, T extends ForecastValue> {
  forecast: F;
  idKey: keyof T;
  sortKey?: keyof ComputedForecastItem;
  sortDirection?: SortDirection;
}

export function getComputedForecastItems<F extends Forecast, T extends ForecastValue>({
  forecast,
  idKey,
  sortDirection = SortDirection.asc,
  sortKey = 'date',
}: ComputedForecastItemsParams<F, T>) {
  return sort(
    getUnsortedComputedForecastItems<F, T>({
      forecast,
      idKey,
      sortDirection,
      sortKey,
    }),
    {
      key: sortKey,
      direction: sortDirection,
    }
  );
}

export function getUnsortedComputedForecastItems<F extends Forecast, T extends ForecastValue>({
  forecast,
  idKey,
}: ComputedForecastItemsParams<F, T>) {
  if (!forecast) {
    return [];
  }

  const itemMap: Map<string | number, ComputedForecastItem> = new Map();

  const visitDataPoint = (dataPoint: ForecastData) => {
    if (dataPoint && dataPoint.values) {
      dataPoint.values.forEach((val: any) => {
        const _val = val[idKey];
        const date = val.date;

        const confidence_max = _val.confidence_max ? _val.confidence_max.value : 0;
        const confidence_min = _val.confidence_min ? _val.confidence_min.value : 0;
        const rsquared = _val.rsquared ? Number(_val.rsquared.value) : undefined;
        const pvalues = _val.pvalues ? Number(_val.pvalues.value) : undefined;
        const total = _val.total ? _val.total.value : 0;
        const units = _val.total ? _val.total.units : 'USD';

        const item = itemMap.get(date);
        if (item) {
          itemMap.set(date, {
            ...item,
            confidence_max: item.confidence_max + confidence_max,
            confidence_min: item.confidence_min + confidence_min,
            date,
            rsquared,
            pvalues,
            total: item.total + total,
            units,
          });
        } else {
          itemMap.set(date, {
            confidence_max,
            confidence_min,
            date,
            rsquared,
            pvalues,
            total,
            units,
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
