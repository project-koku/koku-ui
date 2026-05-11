import type { MetricHash } from 'api/metrics';
import type { Rate } from 'api/rates';

// Filter rates by name and metric
export const getFilteredRates = (rates: Rate[], filterBy): Rate[] => {
  const hasNameFilter = filterBy?.name?.length > 0;
  const hasMetricFilter = filterBy?.metrics?.length > 0;

  if (!hasNameFilter && !hasMetricFilter) {
    return rates;
  }

  const newRates = [];
  rates?.map(rate => {
    if (hasNameFilter && !hasMetricFilter) {
      filterBy?.name?.map(name => {
        if (rate?.custom_name?.toLowerCase()?.includes(name?.toLowerCase())) {
          newRates.push(rate);
        }
      });
    } else if (!hasNameFilter && hasMetricFilter) {
      filterBy?.metrics?.map(metric => {
        if (rate?.metric?.label_metric?.toLowerCase()?.includes(metric?.toLowerCase())) {
          newRates.push(rate);
        }
      });
    } else if (hasNameFilter && hasMetricFilter) {
      filterBy?.name?.map(name => {
        if (rate?.custom_name?.toLowerCase()?.includes(name?.toLowerCase())) {
          filterBy?.metrics?.filter(metric => {
            if (rate?.metric?.label_metric?.toLowerCase()?.includes(metric?.toLowerCase())) {
              newRates.push(rate);
            }
          });
        }
      });
    } else {
      newRates.push(rate);
    }
  });
  return newRates;
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
        label_metric: metric?.label_metric ?? undefined,
        label_measurement: metric?.label_measurement ?? undefined,
        label_measurement_unit: metric?.label_measurement_unit ?? undefined,
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
