import axios from 'axios';

import type { PagedResponse } from './api';

export interface Metric {
  name: string;
  source_type: string;
  metric: string;
  label_metric: string;
  label_measurement: string;
  label_measurement_unit: string;
  default_cost_type: string;
}

export interface MetricHash {
  [mtrc: string]: { [msrmnt: string]: Metric };
}

export type Metrics = PagedResponse<Metric>;

export function fetchRateMetrics(source_type = '') {
  const query = source_type ? `&source_type=${source_type}` : '';
  return axios.get<Metrics>(`metrics/?limit=20${query}`);
}
