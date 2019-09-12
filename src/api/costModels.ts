import axios from 'axios';
import { PagedResponse } from './api';
import { Rate, RateRequest } from './rates';

export interface CostModelProvider {
  name: string;
  uuid: string;
}

export interface CostModel {
  uuid: string;
  name: string;
  description: string;
  providers: CostModelProvider[];
  source_type: string;
  markup?: string;
  rates: Rate[];
  created_timestamp: Date;
  updated_timestamp: Date;
}

export interface CostModelRequest {
  name: string;
  source_type: string;
  description: string;
  provider_uuids: string[];
  rates: RateRequest[];
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
  }
  return axios.get<CostModels>(`costmodels/${query && '?'}${query}`);
}

export function addCostModel(request: CostModelRequest) {
  const insights = (window as any).insights;
  if (
    insights &&
    insights.chrome &&
    insights.chrome.auth &&
    insights.chrome.auth.getUser
  ) {
    return insights.chrome.auth.getUser().then(() => {
      return axios.post('costmodels/', request);
    });
  } else {
    return axios.post('costmodels/', request);
  }
}

export function updateCostModel(uuid: string, request: CostModelRequest) {
  const insights = (window as any).insights;
  if (
    insights &&
    insights.chrome &&
    insights.chrome.auth &&
    insights.chrome.auth.getUser
  ) {
    return insights.chrome.auth.getUser().then(() => {
      return axios.put(`costmodels/${uuid}/`, request);
    });
  }
  return axios.put(`costmodels/${uuid}/`, request);
}
