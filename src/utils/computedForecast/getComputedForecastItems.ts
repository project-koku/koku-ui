import { Forecast, ForecastData } from 'api/forecasts/forecast';
import { sort, SortDirection } from 'utils/sort';

export interface ComputedForecastItem {
  confidence_max?: number;
  confidence_min?: number;
  date?: string;
  id?: string;
  rsquared?: number;
  pvalues?: number;
  value?: number;
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

export function getUnsortedComputedForecastItems<F extends Forecast>({ forecast }: ComputedForecastItemsParams<F>) {
  if (!forecast) {
    return [];
  }

  const itemMap: Map<string | number, ComputedForecastItem> = new Map();

  const visitDataPoint = (dataPoint: ForecastData) => {
    if (dataPoint) {
      const confidence_max = dataPoint.confidence_max;
      const confidence_min = dataPoint.confidence_min;
      const date = dataPoint.date;
      const id = dataPoint.date;
      const rsquared = Number(dataPoint.rsquared);
      const pvalues = Number(dataPoint.pvalues);
      const value = dataPoint.value;

      const item = itemMap.get(id);
      if (item) {
        itemMap.set(id, {
          ...item,
          confidence_max: item.confidence_max + confidence_max,
          confidence_min: item.confidence_min + confidence_min,
          date,
          id,
          rsquared,
          pvalues,
          value: item.value + value,
        });
      } else {
        itemMap.set(id, {
          confidence_max,
          confidence_min,
          date,
          id,
          rsquared,
          pvalues,
          value,
        });
      }
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
