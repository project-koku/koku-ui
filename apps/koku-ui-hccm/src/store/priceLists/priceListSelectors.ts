import type { PriceListType } from 'api/priceList';
import type { RootState } from 'store/rootReducer';

import { getFetchId, priceListStateKey } from './priceListCommon';

export const selectPriceListState = (state: RootState) => state[priceListStateKey];

export const selectPriceList = (state: RootState, priceListType: PriceListType, queryString: string) =>
  selectPriceListState(state).byId.get(getFetchId(priceListType, queryString));

export const selectPriceListError = (state: RootState, priceListType: PriceListType, queryString: string) =>
  selectPriceListState(state)?.errors.get(getFetchId(priceListType, queryString));

export const selectPriceListFetchStatus = (state: RootState, priceListType: PriceListType, queryString: string) =>
  selectPriceListState(state)?.status.get(getFetchId(priceListType, queryString));

export const selectPriceListNotification = (state: RootState, priceListType: PriceListType, queryString: string) =>
  selectPriceListState(state)?.notification?.get(getFetchId(priceListType, queryString));
