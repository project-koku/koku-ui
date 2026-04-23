import type { PriceListType } from 'api/priceList';
import type { RootState } from 'store/rootReducer';

import { getFetchId, priceListStateKey } from './priceListCommon';

export const selectPriceListState = (state: RootState) => state[priceListStateKey];

export const selectPriceList = (state: RootState, priceListType: PriceListType, priceListQueryString: string) =>
  selectPriceListState(state).byId.get(getFetchId(priceListType, priceListQueryString));

export const selectPriceListError = (state: RootState, priceListType: PriceListType, priceListQueryString: string) =>
  selectPriceListState(state)?.errors.get(getFetchId(priceListType, priceListQueryString));

export const selectPriceListStatus = (state: RootState, priceListType: PriceListType, priceListQueryString: string) =>
  selectPriceListState(state)?.status.get(getFetchId(priceListType, priceListQueryString));

export const selectPriceListUpdateError = (state: RootState, priceListType: PriceListType) =>
  selectPriceListState(state)?.errors.get(getFetchId(priceListType));

export const selectPriceListUpdateNotification = (state: RootState, priceListType: PriceListType) =>
  selectPriceListState(state)?.notification?.get(getFetchId(priceListType));

export const selectPriceListUpdateStatus = (state: RootState, priceListType: PriceListType) =>
  selectPriceListState(state)?.status.get(getFetchId(priceListType));
