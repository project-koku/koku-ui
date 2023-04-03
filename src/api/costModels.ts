import axios from 'axios';

import type { PagedResponse } from './api';
import type { Rate, RateRequest } from './rates';

export interface CostModelProvider {
  name: string;
  uuid: string;
}

export interface CostModel {
  created_timestamp?: Date;
  currency?: string;
  description: string;
  distribution: string;
  distributePlatformUnallocated: boolean;
  distributeWorkersUnallocated: boolean;
  markup: { value: string; unit: string };
  name: string;
  rates: Rate[];
  sources?: CostModelProvider[];
  source_type: string;
  updated_timestamp?: Date;
  uuid?: string;
}

export interface CostModelRequest {
  currency?: string;
  description: string;
  distribution: string;
  distributePlatformUnallocated: boolean;
  distributeWorkersUnallocated: boolean;
  markup: { value: string; unit: string };
  name: string;
  rates: RateRequest[];
  source_type: string;
  source_uuids: string[];
}

export type CostModels = PagedResponse<CostModel>;

export function fetchCostModels(query = '') {
  const fetch = () => axios.get<CostModels>(`cost-models/${query && '?'}${query}`);

  const insights = (window as any).insights;
  if (insights && insights.chrome && insights.chrome.auth && insights.chrome.auth.getUser) {
    return insights.chrome.auth.getUser().then(() => fetch());
  } else {
    return fetch();
  }
}

export function fetchCostModel(uuid: string) {
  const fetch = () => axios.get<CostModels>(`cost-models/${uuid}/`);

  const insights = (window as any).insights;
  if (insights && insights.chrome && insights.chrome.auth && insights.chrome.auth.getUser) {
    return insights.chrome.auth.getUser().then(() => fetch());
  } else {
    return fetch();
  }
}

export function addCostModel(request: CostModelRequest) {
  const fetch = () => axios.post(`cost-models/`, request);

  const insights = (window as any).insights;
  if (insights && insights.chrome && insights.chrome.auth && insights.chrome.auth.getUser) {
    return insights.chrome.auth.getUser().then(() => fetch());
  } else {
    return fetch();
  }
}

export function updateCostModel(uuid: string, request: CostModelRequest) {
  const fetch = () => axios.put(`cost-models/${uuid}/`, request);

  const insights = (window as any).insights;
  if (insights && insights.chrome && insights.chrome.auth && insights.chrome.auth.getUser) {
    return insights.chrome.auth.getUser().then(() => fetch());
  } else {
    return fetch();
  }
}

export function deleteCostModel(uuid: string) {
  const fetch = () => axios.delete(`cost-models/${uuid}/`);

  const insights = (window as any).insights;
  if (insights && insights.chrome && insights.chrome.auth && insights.chrome.auth.getUser) {
    return insights.chrome.auth.getUser().then(() => fetch());
  } else {
    return fetch();
  }
}
