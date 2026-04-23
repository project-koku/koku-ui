import { axiosInstance } from 'api';

import type { PagedLinks, PagedMetaData } from './api';

export interface PriceListData {
  created_timestamp?: string;
  currency?: string;
  description?: string;
  effective_end_date?: string;
  effective_start_date?: string;
  enabled?: boolean;
  name?: string;
  rates?: [
    {
      cost_type?: string;
      custom_name?: string;
      description?: string;
      metric?: {
        name?: string;
      };
      rate_id?: string;
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
      tiered_rates: [
        {
          unit?: string;
          usage: {
            unit?: string;
          };
          value?: number;
        },
      ];
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
  data: PriceListData[];
}

export interface PriceListPayload extends PriceListData {
  // TBD...
}

export const enum PriceListType {
  priceList = 'priceList',
  priceListAdd = 'priceListAdd',
  priceListRemove = 'priceListRemove',
  priceListUpdate = 'priceListUpdate',
}

export const PriceListPathsType: Partial<Record<PriceListType, string>> = {
  [PriceListType.priceList]: 'price-lists/',
  [PriceListType.priceListAdd]: 'price-lists/',
  [PriceListType.priceListRemove]: 'price-lists/',
  [PriceListType.priceListUpdate]: 'price-lists/',
};

export function fetchPriceList(priceListType: PriceListType, query?: string) {
  const path = PriceListPathsType[priceListType];
  const queryString = query ? `?${query}` : '';
  return axiosInstance.get<PriceList>(`${path}${queryString}`);
}

export function updatePriceList(priceListType: PriceListType, uuid: string = '', payload?: PriceListPayload) {
  const path = PriceListPathsType[priceListType];

  if (priceListType === PriceListType.priceListAdd) {
    return axiosInstance.post<PriceListPayload>(`${path}`, payload);
  } else if (priceListType === PriceListType.priceListRemove) {
    return axiosInstance.delete<PriceListPayload>(`${path}${uuid}/`);
  } else if (priceListType === PriceListType.priceListUpdate) {
    return axiosInstance.put<PriceListPayload>(`${path}${uuid}/`, payload);
  }
}
