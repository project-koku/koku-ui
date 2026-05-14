import { Card, CardBody, Pagination, PaginationVariant } from '@patternfly/react-core';
import type { PriceList } from 'api/priceList';
import { PriceListType } from 'api/priceList';
import type { Query } from 'api/queries/query';
import { getQuery } from 'api/queries/query';
import type { AxiosError } from 'axios';
import messages from 'locales/messages';
import React, { useCallback, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import type { AnyAction } from 'redux';
import type { ThunkDispatch } from 'redux-thunk';
import { routes } from 'routes';
import { NotAvailable } from 'routes/components/page/notAvailable';
import { LoadingState } from 'routes/components/state/loadingState';
import { usePriceListUpdate } from 'routes/settings/priceList/utils';
import * as queryUtils from 'routes/utils/query';
import type { RootState } from 'store';
import { FetchStatus } from 'store/common';
import { priceListActions, priceListSelectors } from 'store/priceList';
import { formatPath } from 'utils/paths';

import { styles } from './priceLists.styles';
import { PriceListsTable } from './priceListsTable';
import { PriceListsToolbar } from './priceListsToolbar';

interface PriceListsOwnProps {
  canWrite?: boolean;
}

export interface PriceListsMapProps {
  isShowDeprecated?: boolean;
  query?: Query;
}

export interface PriceListsStateProps {
  priceList?: PriceList;
  priceListError?: AxiosError;
  priceListQueryString?: string;
  priceListStatus?: FetchStatus;
}

type PriceListsProps = PriceListsOwnProps;

const baseQuery: Query = {
  limit: 10,
  offset: 0,
  filter_by: {},
  order_by: {
    name: 'asc',
  },
};

const PriceLists: React.FC<PriceListsProps> = ({ canWrite }) => {
  const intl = useIntl();
  const location = useLocation();
  const navigate = useNavigate();

  const [isShowDeprecated, setIsShowDeprecated] = useState<boolean>(false);
  const [query, setQuery] = useState({ ...baseQuery });

  const { priceList, priceListError, priceListStatus } = useMapToProps({ isShowDeprecated, query });

  const isDisabled = priceList?.data?.length === 0;

  // Force update
  const forceUpdate = useCallback(() => {
    setQuery(prev => ({ ...prev }));
  }, []);

  const getPagination = (isBottom = false) => {
    const count = priceList?.meta?.count ?? 0;
    const limit = priceList?.meta?.limit ?? baseQuery.limit;
    const offset = priceList?.meta?.offset ?? baseQuery.offset;
    const page = Math.trunc(offset / limit + 1);

    return (
      <Pagination
        isCompact={!isBottom}
        isDisabled={isDisabled}
        itemCount={count}
        onPerPageSelect={(_event, perPage) => handleOnPerPageSelect(perPage)}
        onSetPage={(_event, pageNumber) => handleOnSetPage(pageNumber)}
        page={page}
        perPage={limit}
        titles={{
          paginationAriaLabel: intl.formatMessage(messages.paginationTitle, {
            title: intl.formatMessage(messages.openShift),
            placement: isBottom ? 'bottom' : 'top',
          }),
        }}
        variant={isBottom ? PaginationVariant.bottom : PaginationVariant.top}
        widgetId={`pagination${isBottom ? '-bottom' : ''}`}
      />
    );
  };

  const getTable = () => {
    return (
      <PriceListsTable
        canWrite={canWrite}
        filterBy={query.filter_by}
        isDisabled={priceList?.data?.length === 0}
        isLoading={priceListStatus === FetchStatus.inProgress}
        onDelete={forceUpdate}
        onDeprecate={forceUpdate}
        onDuplicate={forceUpdate}
        orderBy={query.order_by}
        onSort={(sortType, isSortAscending) => handleOnSort(sortType, isSortAscending)}
        priceList={priceList}
      />
    );
  };

  const getToolbar = () => {
    return (
      <PriceListsToolbar
        canWrite={canWrite}
        isDisabled={isDisabled}
        isShowDeprecated={isShowDeprecated}
        itemsPerPage={priceList?.meta?.limit ?? baseQuery.limit}
        itemsTotal={priceList?.meta?.count ?? 0}
        onCreate={handleOnCreate}
        onFilterAdded={filter => handleOnFilterAdded(filter)}
        onFilterRemoved={filter => handleOnFilterRemoved(filter)}
        onShowDeprecated={handleOnShowDeprecated}
        pagination={getPagination()}
        query={query}
      />
    );
  };

  const handleOnShowDeprecated = (checked: boolean) => {
    setIsShowDeprecated(checked);
  };

  const handleOnCreate = () => {
    navigate(formatPath(routes.priceListCreate.path), {
      replace: true,
      state: {
        ...(location?.state || {}),
      },
    });
  };

  const handleOnFilterAdded = filter => {
    const newQuery = queryUtils.handleOnFilterAdded(query, filter);
    setQuery(newQuery);
  };

  const handleOnFilterRemoved = filter => {
    const newQuery = queryUtils.handleOnFilterRemoved(query, filter);
    setQuery(newQuery);
  };

  const handleOnPerPageSelect = perPage => {
    const newQuery = queryUtils.handleOnPerPageSelect(query, perPage, true);
    setQuery(newQuery);
  };

  const handleOnSetPage = pageNumber => {
    const newQuery = queryUtils.handleOnSetPage(query, priceList, pageNumber, true);
    setQuery(newQuery);
  };

  const handleOnSort = (sortType, isSortAscending) => {
    const newQuery = queryUtils.handleOnSort(query, sortType, isSortAscending);
    setQuery(newQuery);
  };

  if (priceListError) {
    return <NotAvailable />;
  }
  return (
    <Card>
      <CardBody>
        {intl.formatMessage(messages.priceListDesc, {
          learnMore: (
            <a href={intl.formatMessage(messages.docsPriceList)} rel="noreferrer" target="_blank">
              {intl.formatMessage(messages.learnMore)}
            </a>
          ),
        })}
        <div style={styles.tableContainer}>
          {getToolbar()}
          {priceListStatus === FetchStatus.inProgress ? (
            <LoadingState />
          ) : (
            <>
              {getTable()}
              <div style={styles.paginationContainer}>{getPagination(true)}</div>
            </>
          )}
        </div>
      </CardBody>
    </Card>
  );
};

const useMapToProps = ({ isShowDeprecated, query }: PriceListsMapProps): PriceListsStateProps => {
  const dispatch: ThunkDispatch<RootState, any, AnyAction> = useDispatch();

  const priceListQuery = {
    filter: {
      ...(!isShowDeprecated && { enabled: true }),
    },
    filter_by: query.filter_by,
    limit: query.limit,
    offset: query.offset,
    order_by: query.order_by,
  };
  const priceListQueryString = getQuery(priceListQuery);
  const priceList = useSelector((state: RootState) =>
    priceListSelectors.selectPriceList(state, PriceListType.priceList, priceListQueryString)
  );
  const priceListError = useSelector((state: RootState) =>
    priceListSelectors.selectPriceListError(state, PriceListType.priceList, priceListQueryString)
  );
  const priceListStatus = useSelector((state: RootState) =>
    priceListSelectors.selectPriceListStatus(state, PriceListType.priceList, priceListQueryString)
  );

  // Notifications
  const { status: priceListAddStatus } = usePriceListUpdate({
    priceListType: PriceListType.priceListAdd,
  });
  const { status: priceListDuplicateStatus } = usePriceListUpdate({
    priceListType: PriceListType.priceListDuplicate,
  });
  const { status: priceListRemoveStatus } = usePriceListUpdate({
    priceListType: PriceListType.priceListRemove,
  });
  const { status: priceListUpdateStatus } = usePriceListUpdate({
    priceListType: PriceListType.priceListUpdate,
  });

  useEffect(() => {
    if (
      !priceListError &&
      priceListStatus !== FetchStatus.inProgress &&
      priceListAddStatus !== FetchStatus.inProgress &&
      priceListDuplicateStatus !== FetchStatus.inProgress &&
      priceListRemoveStatus !== FetchStatus.inProgress &&
      priceListUpdateStatus !== FetchStatus.inProgress
    ) {
      dispatch(priceListActions.fetchPriceList(PriceListType.priceList, undefined, priceListQueryString));
    }
  }, [isShowDeprecated, query]);

  return {
    priceList,
    priceListError,
    priceListQueryString,
    priceListStatus,
  };
};

export { PriceLists };
