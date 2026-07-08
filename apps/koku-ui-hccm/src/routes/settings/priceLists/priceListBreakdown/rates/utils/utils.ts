import type { AssignedCostModel } from 'api/priceList';
import type { Rate } from 'api/rates';
import { intl } from 'components/i18n';
import messages from 'locales/messages';

export const getCostTypeLabel = m => {
  if (!m) {
    return '';
  }
  // Match message descriptor or default to API string
  const label = intl.formatMessage(messages.costTypeValues, {
    value: m.toLowerCase().replace('-', '_'),
    count: 1,
  });
  return label ? label : m;
};

// Filter cost models by name
export const getFilteredCostModels = (costModels: AssignedCostModel[], filterBy: any): AssignedCostModel[] => {
  if (!costModels) {
    return [];
  }

  const nameFilters = filterBy?.name || [];

  if (nameFilters.length === 0) {
    return costModels;
  }

  return costModels.filter(costModel => {
    const matchesName =
      nameFilters.length === 0 ||
      nameFilters.some(item => costModel?.name?.toLowerCase()?.includes(item.toLowerCase()));
    return matchesName;
  });
};

// Filter rates by cost type, measurement, metric, and name
export const getFilteredRates = (rates: Rate[], filterBy: any): Rate[] => {
  if (!rates) {
    return [];
  }

  const costTypeFilters = filterBy?.cost_type || [];
  const measurementFilters = filterBy?.measurement || [];
  const metricFilters = filterBy?.metric_type || [];
  const nameFilters = filterBy?.name || [];

  if (
    costTypeFilters.length === 0 &&
    measurementFilters.length === 0 &&
    metricFilters.length === 0 &&
    nameFilters.length === 0
  ) {
    return rates;
  }

  return rates.filter(rate => {
    const matchesName =
      nameFilters.length === 0 ||
      nameFilters.some(item => rate?.custom_name?.toLowerCase()?.includes(item.toLowerCase()));
    const matchesCostType =
      costTypeFilters.length === 0 ||
      costTypeFilters.some(item => rate?.cost_type?.toLowerCase() === item.toLowerCase());
    const matchesMeasurement =
      measurementFilters.length === 0 ||
      measurementFilters.some(item => rate?.metric?.label_measurement?.toLowerCase() === item.toLowerCase());
    const matchesMetric =
      metricFilters.length === 0 ||
      metricFilters.some(item => rate?.metric?.label_metric?.toLowerCase() === item.toLowerCase());
    return matchesCostType && matchesMeasurement && matchesMetric && matchesName;
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

export const getMeasurementLabel = m => {
  if (!m) {
    return '';
  }
  // Match message descriptor or default to API string
  const label = intl.formatMessage(messages.measurementValues, {
    value: m.toLowerCase().replace('-', '_'),
    count: 1,
  });
  return label ? label : m;
};

export const getMetricLabel = m => {
  // Match message descriptor or default to API string
  const value = m.replace(/ /g, '_').toLowerCase();
  const label = intl.formatMessage(messages.metricValues, { value });
  return label ? label : m;
};

// Paginated rates for table
export const getPaginatedRates = (rates: Rate[], page: number, perPage: number): Rate[] => {
  const offset = Math.max(0, (page - 1) * perPage);
  const end = Math.min(offset + perPage, rates?.length ?? 0);
  return rates?.slice(offset, end) ?? [];
};

type SortDirection = 'asc' | 'desc';

interface RatesOrderBy {
  cost_type?: SortDirection;
  measurement?: SortDirection;
  metric_type?: SortDirection;
  name?: SortDirection;
}

const getRateSortValue = (rate: Rate, sortKey: string): string => {
  switch (sortKey) {
    case 'name':
      return rate?.custom_name ?? '';
    case 'metric_type':
      return rate?.metric?.label_metric ?? '';
    case 'measurement':
      return rate?.metric?.label_measurement ?? '';
    case 'cost_type':
      return rate?.cost_type ?? '';
    default:
      return '';
  }
};

// Sort rates by name, metric, measurement, or cost type
export const getSortedRates = (rates: Rate[], orderBy: RatesOrderBy): Rate[] => {
  if (!rates) {
    return [];
  }

  const sortKey = Object.keys(orderBy ?? {}).find(key => orderBy[key] === 'asc' || orderBy[key] === 'desc');

  if (!sortKey) {
    return rates;
  }

  const direction = orderBy[sortKey] === 'desc' ? -1 : 1;
  const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' });

  return [...rates].sort(
    (a, b) => direction * collator.compare(getRateSortValue(a, sortKey), getRateSortValue(b, sortKey))
  );
};
