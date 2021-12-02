import axios from 'axios';

import { PagedResponse } from './api';

export interface CostTypeData {
  code?: string;
  description?: string;
  name?: string;
}

export interface CostTypeMeta {
  count?: string;
  ['cost-type']?: string;
}

export interface CostType extends PagedResponse<CostTypeData, CostTypeMeta> {}

export function fetchCostType() {
  const insights = (window as any).insights;
  if (insights && insights.chrome && insights.chrome.auth && insights.chrome.auth.getUser) {
    return insights.chrome.auth.getUser().then(() => {
      return axios.get<CostType>(`cost-type/`);
    });
  } else {
    return axios.get<CostType>(`cost-type/`);
  }
}
