import { axiosInstance } from 'api';

import type { PagedLinks, PagedMetaData } from './api';
import type { Rate } from './rates';

export interface DataRetentionData {
  assigned_cost_model_count?: number;
  assigned_cost_models?: [
    {
      uuid?: string;
      name?: string;
      priority?: number;
    },
  ];
  created_timestamp?: string;
  currency?: string;
  description?: string;
  effective_end_date?: string;
  effective_start_date?: string;
  enabled?: boolean;
  name?: string;
  rates?: Rate[];
  updated_timestamp?: string;
  uuid?: string;
  version?: number;
}

export interface PagedMetaDataExt extends PagedMetaData {
  limit?: number;
  offset?: number;
}

export interface DataRetention {
  meta: PagedMetaDataExt;
  links?: PagedLinks;
  data: DataRetentionData[];
}

export interface DataRetentionPayload extends DataRetentionData {
  // TBD...
}

export const enum DataRetentionType {
  dataRetention = 'dataRetention',
  dataRetentionUpdate = 'dataRetentionUpdate',
}

export const DataRetentionPathsType: Partial<Record<DataRetentionType, string>> = {
  [DataRetentionType.dataRetention]: 'price-lists/',
  [DataRetentionType.dataRetentionUpdate]: 'price-lists/',
};

export function fetchDataRetention(dataRetentionType: DataRetentionType, uuid?: string, query?: string) {
  const path = DataRetentionPathsType[dataRetentionType];
  const prefix = uuid ? `${uuid}/` : '';
  const queryString = query ? `?${query}` : '';
  return axiosInstance.get<DataRetention>(`${path}${prefix}${queryString}`);
}

export function updateDataRetention(
  dataRetentionType: DataRetentionType,
  uuid?: string,
  payload?: DataRetentionPayload
) {
  const path = DataRetentionPathsType[dataRetentionType];
  const params = uuid ? `${uuid}/` : '';

  let method;
  switch (dataRetentionType) {
    case DataRetentionType.dataRetentionUpdate:
      method = 'put';
      break;
    default:
      method = 'post';
  }
  return axiosInstance[method]<DataRetentionPayload>(`${path}${params}`, payload);
}
