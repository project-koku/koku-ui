import { axiosInstance } from 'api';

import type { PagedLinks, PagedMetaData } from './api';

export interface PriceListData {
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
  priceListDuplicate = 'priceListDuplicate',
  priceListRemove = 'priceListRemove',
  priceListUpdate = 'priceListUpdate',
}

export const PriceListPathsType: Partial<Record<PriceListType, string>> = {
  [PriceListType.priceList]: 'price-lists/',
  [PriceListType.priceListAdd]: 'price-lists/',
  [PriceListType.priceListDuplicate]: 'price-lists/',
  [PriceListType.priceListRemove]: 'price-lists/',
  [PriceListType.priceListUpdate]: 'price-lists/',
};

export function fetchPriceList(priceListType: PriceListType, query?: string) {
  const path = PriceListPathsType[priceListType];
  const queryString = query ? `?${query}` : '';
  return axiosInstance.get<PriceList>(`${path}${queryString}`);
}

export function updatePriceList(priceListType: PriceListType, uuid?: string, payload?: PriceListPayload) {
  const path = PriceListPathsType[priceListType];
  const prefix = uuid ? `${uuid}/` : '';
  const suffix = priceListType === PriceListType.priceListDuplicate ? 'duplicate/' : '';
  const params = `${prefix}${suffix}`;

  let method;
  switch (priceListType) {
    case PriceListType.priceListRemove:
      method = 'delete';
      break;
    case PriceListType.priceListUpdate:
      method = 'put';
      break;
    case PriceListType.priceListAdd:
    case PriceListType.priceListDuplicate:
    default:
      method = 'post';
  }
  return axiosInstance[method]<PriceListPayload>(`${path}${params}`, payload);
}
