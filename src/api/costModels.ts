import axios from 'axios';
import { PagedResponse } from './api';
import { Rate } from './rates';

export interface CostModel {
  uuid: string;
  provider_uuids: string[];
  name: string;
  description: string;
  updated_timestamp: Date;
  rates: Rate[];
}

export type CostModels = PagedResponse<CostModel>;

export function fetchCostModels(query = '') {
  const insights = (window as any).insights;
  if (
    insights &&
    insights.chrome &&
    insights.chrome.auth &&
    insights.chrome.auth.getUser
  ) {
    return insights.chrome.auth.getUser().then(() => {
      return axios.get<CostModels>(`costmodels/${query && '?'}${query}`);
    });
  } else {
    return axios.get<CostModels>(`costmodels/${query}`);
  }
}
