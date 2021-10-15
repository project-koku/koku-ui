import axios from 'axios';

import { PagedResponse } from './api';

export interface CostTypeData {
  code?: string;
  description?: string;
  name?: string;
}

export interface CostType extends PagedResponse<CostTypeData, CostTypeData> {}

export function fetchCostType() {
  const insights = (window as any).insights;
  if (insights && insights.chrome && insights.chrome.auth && insights.chrome.auth.getUser) {
    return insights.chrome.auth.getUser().then(() => {
      return axios.get<CostType>(`cost_type/`);
    });
  } else {
    return axios.get<CostType>(`cost_type/`);
  }
}
