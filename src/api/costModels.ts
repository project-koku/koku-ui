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
  sources: CostModelProvider[];
  source_type: string;
  markup: { value: string; unit: string };
  rates: Rate[];
  created_timestamp: Date;
  updated_timestamp: Date;
}

export interface CostModelRequest {
  name: string;
  source_type: string;
  description: string;
  source_uuids: string[];
  rates: RateRequest[];
  markup: { value: string; unit: string };
}

export type CostModels = PagedResponse<CostModel>;

export function fetchCostModels(query = '') {
  return axios.get<CostModels>(`cost-models/${query && '?'}${query}`);
}

export function addCostModel(request: CostModelRequest) {
  return axios.post('cost-models/', request);
}

export function updateCostModel(uuid: string, request: CostModelRequest) {
  return axios.put(`cost-models/${uuid}/`, request);
}

export function deleteCostModel(uuid: string) {
  return axios.delete(`cost-models/${uuid}/`);
}
