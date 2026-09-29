import { axiosInstance } from 'api';

import type { PagedLinks, PagedMetaData } from './api';

export interface PagedMetaDataExt extends PagedMetaData {
  limit?: number;
  offset?: number;
}

export interface CurrencyData {
  code?: string;
  name?: string;
  symbol?: string;
  description?: string;
}

export interface Currency {
  meta: PagedMetaDataExt;
  links?: PagedLinks;
  data: CurrencyData[];
}

export const enum CurrencyType {
  currency = 'currency',
}

export const CurrencyTypePaths: Partial<Record<CurrencyType, string>> = {
  [CurrencyType.currency]: 'currency/',
};

export function fetchCurrency(currencyType: CurrencyType, query: string) {
  const path = CurrencyTypePaths[currencyType];
  const queryString = query ? `?${query}` : '';
  return axiosInstance.get<Currency>(`${path}${queryString}`);
}
