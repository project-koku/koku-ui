import type { PriceListType } from 'api/priceList';
import type { RootState } from 'store/rootReducer';

import { getFetchId, priceListStateKey } from './priceListCommon';

export const selectPriceListState = (state: RootState) => state[priceListStateKey];

export const selectPriceList = (state: RootState, priceListType: PriceListType, priceListQueryString: string) =>
  selectPriceListState(state).byId.get(getFetchId(priceListType, priceListQueryString));

export const selectPriceListFetchStatus = (
  state: RootState,
  priceListType: PriceListType,
  priceListQueryString: string
) => selectPriceListState(state)?.fetchStatus.get(getFetchId(priceListType, priceListQueryString));

export const selectPriceListError = (state: RootState, priceListType: PriceListType, priceListQueryString: string) =>
  selectPriceListState(state)?.errors.get(getFetchId(priceListType, priceListQueryString));

export const selectPriceListUpdateFetchStatus = (state: RootState, priceListType: PriceListType) =>
  selectPriceListState(state)?.fetchStatus.get(getFetchId(priceListType));

export const selectPriceListUpdateNotification = (state: RootState, priceListType: PriceListType) =>
  selectPriceListState(state)?.notification?.get(getFetchId(priceListType));

export const selectPriceListUpdateError = (state: RootState, priceListType: PriceListType) =>
  selectPriceListState(state)?.errors.get(getFetchId(priceListType));
