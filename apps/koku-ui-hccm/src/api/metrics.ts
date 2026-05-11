import { axiosInstance } from 'api';

import type { PagedResponse } from './api';

export interface Metric {
  default_cost_type?: string;
  label_measurement?: string;
  label_measurement_unit?: string;
  label_metric?: string;
  metric?: string;
  name?: string;
  source_type?: string;
}

/**
 * Built by `metrics()` as nested maps (label_metric → metric id → row).
 * Built by `metricsByName()` as a flat map (metric id → merged metric row).
 * Call sites that assume nesting (e.g. `getDefaultCostType`) must use the `metrics()` shape only.
 */
export type MetricHash = Record<string, { [msrmnt: string]: Metric } | Metric>;

export type Metrics = PagedResponse<Metric>;

export function fetchRateMetrics(source_type = '') {
  const query = source_type ? `&source_type=${source_type}` : '';
  return axiosInstance.get<Metrics>(`metrics/?limit=1000${query}`);
}
