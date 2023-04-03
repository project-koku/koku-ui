import axios from 'axios';

import type { PagedResponse } from './api';
import type { Metric } from './metrics';

export interface RateRequest {
  metric: { name: string };
  tiered_rates?: TieredRate[];
  tag_rates?: TagRates;
  cost_type?: string;
  description?: string;
}

export interface TagValue {
  tag_value: string;
  unit: string;
  value: number;
  description: string;
  default: boolean;
}

export interface TagRates {
  tag_key: string;
  tag_values: TagValue[];
}

export interface Rate {
  stateIndex?: any;
  description?: string;
  metric: Metric;
  tiered_rates?: TieredRate[];
  tag_rates?: TagRates;
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
  const fetch = () => axios.get<Rates>(`cost-models/${query}`);

  const insights = (window as any).insights;
  if (insights && insights.chrome && insights.chrome.auth && insights.chrome.auth.getUser) {
    return insights.chrome.auth.getUser().then(() => fetch());
  } else {
    return fetch();
  }
}
