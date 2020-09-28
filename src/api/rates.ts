import axios from 'axios';

import { PagedResponse } from './api';
import { Metric } from './metrics';

export interface RateRequest {
  metric: { name: string };
  tiered_rates: TieredRate[];
  cost_type?: string;
}

export interface Rate {
  metric: Metric;
  tiered_rates: TieredRate[];
  cost_type: string;
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
  const query = uuid ? `?source_uuid=${uuid}` : '';
  return axios.get<Rates>(`cost-models/${query}`);
}
