import type { MetricHash } from 'api/metrics';
import type { Rate } from 'api/rates';

// Filter rates by name and metric
export const getFilteredRates = (rates: Rate[], filterBy: any): Rate[] => {
  if (!rates) {
    return [];
  }

  const nameFilters = filterBy?.name || [];
  const metricFilters = filterBy?.metrics || [];

  if (nameFilters.length === 0 && metricFilters.length === 0) {
    return rates;
  }

  return rates.filter(rate => {
    const matchesName =
      nameFilters.length === 0 ||
      nameFilters.some(item => rate?.custom_name?.toLowerCase()?.includes(item.toLowerCase()));
    const matchesMetric =
      metricFilters.length === 0 ||
      metricFilters.some(item =>
        rate?.metric?.label_metric?.toLowerCase()?.includes(item.toLowerCase())
      );
    return matchesName && matchesMetric;
  });
};

// Add rate indexes to rates for editing
export const getIndexedRates = (rates: Rate[]): Rate[] => {
  if (!rates) {
    return rates;
  }
  const newRates = rates?.map((rate, index) => {
    return {
      ...rate,
      rateIndex: index,
    };
  });
  return newRates;
};

// Add missing metric and measurement labels
export const getLabeledRates = (rates: Rate[], metricsHashByName: MetricHash): Rate[] => {
  if (!rates) {
    return rates;
  }
  const newRates = rates?.map(rate => {
    const metric = metricsHashByName?.[rate?.metric?.name];

    return {
      ...rate,
      metric: {
        ...(rate?.metric ?? {}),
        label_metric: metric?.label_metric ?? rate?.metric?.label_metric,
        label_measurement: metric?.label_measurement ?? rate?.metric?.label_measurement,
        label_measurement_unit: metric?.label_measurement_unit ?? rate?.metric?.label_measurement_unit,
      },
    } as Rate;
  });
  return newRates;
};

// Paginated rates for table
export const getPaginatedRates = (rates: Rate[], pageNumber: number, perPage: number): Rate[] => {
  const offset = pageNumber * perPage - perPage;
  const end = Math.min(offset + perPage, rates?.length ?? 0);
  return rates?.slice(offset, end) ?? [];
};
