import axios from 'axios';
import { PagedResponse } from './api';

export interface Metric {
  source_type: string;
  metric: string;
  label_metric: string;
  label_measurement: string;
  label_measurement_unit: string;
}

export interface MetricHash {
  [mtrc: string]: { [msrmnt: string]: Metric };
}

export type Metrics = PagedResponse<Metric>;

export function fetchRateMetrics(source_type = '') {
  const query = Boolean(source_type) ? `?source_type=${source_type}` : '';
  const insights = (window as any).insights;
  if (
    insights &&
    insights.chrome &&
    insights.chrome.auth &&
    insights.chrome.auth.getUser
  ) {
    return insights.chrome.auth.getUser().then(() => {
      return axios.get<Metrics>(`metrics/${query}`);
    });
  }
  return axios.get<Metrics>(`metrics/${query}`);
}
