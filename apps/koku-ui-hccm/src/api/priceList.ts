import { axiosInstance } from 'api';

import type { PagedLinks, PagedMetaData } from './api';

export interface PriceListData {
  created_timestamp?: string;
  currency?: string;
  description?: string;
  effective_end_date?: string;
  effective_start_date?: string;
  enable?: boolean;
  name?: string;
  rates?: [
    {
      cost_type?: string;
      description?: string;
      metric?: {
        name?: string;
      };
      tag_rates?: {
        tag_key?: string;
        tag_values?: [
          {
            default?: boolean;
            description?: string;
            tag_value?: string;
            unit?: string;
            value?: number;
          },
        ];
      };
    },
  ];
  updated_timestamp?: string;
  uuid?: string;
  version?: number;
}

export interface PagedMetaDataExt extends PagedMetaData {
  limit?: number;
  offset?: number;
}

export interface PriceList {
  meta: PagedMetaDataExt;
  links?: PagedLinks;
  data: PriceListData;
}

export interface PriceListPayload {
  // TBD...
}

export const enum PriceListType {
  priceList = 'priceList',
  priceListAdd = 'priceListAdd',
  priceListRemove = 'priceListRemove',
}

export const PriceListTypePaths: Partial<Record<PriceListType, string>> = {
  [PriceListType.priceList]: 'priceList/',
  [PriceListType.priceListAdd]: 'priceList/add/',
  [PriceListType.priceListRemove]: 'priceList/remove/',
};

export function fetchPriceList(settingsType: PriceListType, query: string) {
  const path = PriceListTypePaths[settingsType];
  const queryString = query ? `?${query}` : '';
  return axiosInstance.get<PriceList>(`${path}${queryString}`);
}

export function updatePriceList(settingsType: PriceListType, payload: PriceListPayload) {
  const path = PriceListTypePaths[settingsType];
  return axiosInstance.put(`${path}`, payload);
}
