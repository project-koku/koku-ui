import axios from 'axios';
import { PagedResponse } from './api';

export interface RateRequest {
  metric: { name: string };
  tiered_rates: TieredRate[];
}

export interface Rate {
  metric: Metric;
  tiered_rates: TieredRate[];
}

interface Metric {
  name: string;
  label_metric: string;
  label_measurement: string;
  label_measurement_unit: string;
}

interface TieredRate {
  unit: string;
  value: number;
  usage: {
    usage_start?: string;
    usage_end?: string;
    unit: string;
  };
}

export type Rates = PagedResponse<Rate>;

export function fetchRate(uuid = null) {
  const query = uuid ? `?provider_uuid=${uuid}` : '';
  return axios.get<Rates>(`costmodels/${query}`);
}
