import type { PriceListType } from 'api/priceList';
export const priceListStateKey = 'priceList';

export function getFetchId(priceListType: PriceListType, priceListQueryString?: string) {
  return `${priceListType}--${priceListQueryString}`;
}
