import axios from 'axios';
import { PagedResponse } from './api';

export interface Rate {
  uuid: string;
  provider_uuid: string;
  metric: string;
  tiered_rate: TieredRate;
}

export interface TieredRate {
  unit: string;
  value: number;
}

export type Rates = PagedResponse<Rate>;

export function fetchRate(uuid = null) {
  const query = uuid ? `?provider_uuid=${uuid}` : '';
  const insights = (window as any).insights;
  if (
    insights &&
    insights.chrome &&
    insights.chrome.auth &&
    insights.chrome.auth.getUser
  ) {
    return insights.chrome.auth.getUser().then(() => {
      return axios.get<Rates>(`costmodels/${query}`);
    });
  } else {
    return axios.get<Rates>(`costmodels/${query}`);
  }
}
