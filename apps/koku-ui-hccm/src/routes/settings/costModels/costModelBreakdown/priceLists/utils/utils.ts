import type { PriceList } from 'api/priceList';
import { type PriceListData, PriceListType } from 'api/priceList';
import { getQuery } from 'api/queries/query';
import type { AxiosError } from 'axios';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AnyAction } from 'redux';
import type { ThunkDispatch } from 'redux-thunk';
import type { RootState } from 'store';
import { FetchStatus } from 'store/common';
import { priceListActions, priceListSelectors } from 'store/priceLists';

// Filter price lists by name
export const getFilteredPriceLists = (pricelists: PriceListData[], filterBy: any): PriceListData[] => {
  if (!pricelists) {
    return [];
  }

  const nameFilters = filterBy?.name || [];

  if (nameFilters.length === 0) {
    return pricelists;
  }

  return pricelists.filter(priceList => {
    return (
      nameFilters.length === 0 || nameFilters.some(item => priceList?.name?.toLowerCase()?.includes(item.toLowerCase()))
    );
  });
};

// Paginated price lists for table
export const getPaginatedPriceLists = (
  pricelists: PriceListData[],
  pageNumber: number,
  perPage: number
): PriceListData[] => {
  const offset = pageNumber * perPage - perPage;
  const end = Math.min(offset + perPage, pricelists?.length ?? 0);
  return pricelists?.slice(offset, end) ?? [];
};

export const useFetchPriceLists = (): {
  priceList: PriceList;
  priceListError: AxiosError;
  priceListFetchStatus: FetchStatus;
} => {
  const dispatch: ThunkDispatch<RootState, any, AnyAction> = useDispatch();

  const priceListQuery = {
    limit: 1000,
  };
  const priceListQueryString = getQuery(priceListQuery);
  const priceList = useSelector((state: RootState) =>
    priceListSelectors.selectPriceList(state, PriceListType.priceList, priceListQueryString)
  );
  const priceListError = useSelector((state: RootState) =>
    priceListSelectors.selectPriceListError(state, PriceListType.priceList, priceListQueryString)
  );
  const priceListFetchStatus = useSelector((state: RootState) =>
    priceListSelectors.selectPriceListFetchStatus(state, PriceListType.priceList, priceListQueryString)
  );

  useEffect(() => {
    if (!priceListError && priceListFetchStatus !== FetchStatus.inProgress) {
      dispatch(priceListActions.fetchPriceList(PriceListType.priceList, undefined, priceListQueryString));
    }
  }, [dispatch, priceListError, priceListQueryString]);

  return {
    priceList,
    priceListError,
    priceListFetchStatus,
  };
};
