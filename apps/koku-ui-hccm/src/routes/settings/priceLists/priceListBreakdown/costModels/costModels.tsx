import {
  Button,
  ButtonVariant,
  Card,
  CardBody,
  EmptyState,
  EmptyStateBody,
  EmptyStateFooter,
} from '@patternfly/react-core';
import type { PriceListData } from 'api/priceList';
import { PriceListType } from 'api/priceList';
import type { Query } from 'api/queries/query';
import { getQuery } from 'api/queries/query';
import type { AxiosError } from 'axios';
import messages from 'locales/messages';
import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import type { AnyAction } from 'redux';
import type { ThunkDispatch } from 'redux-thunk';
import { routes } from 'routes';
import { NotAvailable } from 'routes/components/page/notAvailable';
import { LoadingState } from 'routes/components/state/loadingState';
import * as queryUtils from 'routes/utils/query';
import type { RootState } from 'store';
import { FetchStatus } from 'store/common';
import { priceListActions, priceListSelectors } from 'store/priceLists';
import { formatPath } from 'utils/paths';

import { CostModelsTable } from './costModelsTable';
import { CostModelsToolbar } from './costModelsToolbar';

interface CostModelsOwnProps {
  isParentLoading?: boolean;
}

export interface CostModelsMapProps {
  query?: Query;
}

export interface CostModelsStateProps {
  priceList?: PriceListData | any; // TODO: remove any once we have a paginated API
  priceListError?: AxiosError;
  priceListFetchStatus?: FetchStatus;
}

type CostModelsProps = CostModelsOwnProps;

const baseQuery: Query = {
  filter_by: {},
};

const CostModels: React.FC<CostModelsProps> = ({ isParentLoading }: CostModelsProps) => {
  const intl = useIntl();
  const navigate = useNavigate();

  const [query, setQuery] = useState({ ...baseQuery });

  const { priceList, priceListError, priceListFetchStatus } = useMapToProps({ query });

  const getCategories = () => {
    if (priceList) {
      return priceList.rates as any;
    }
    return [];
  };

  const getTable = () => {
    const categories = getCategories();

    return (
      <CostModelsTable
        filterBy={query.filter_by}
        isDisabled={categories.length === 0}
        isLoading={priceListFetchStatus === FetchStatus.inProgress}
        priceList={priceList}
      />
    );
  };

  const getToolbar = () => {
    const itemsTotal = priceList?.meta ? priceList.meta.count : 0;
    const categories = getCategories();

    return (
      <CostModelsToolbar
        isDisabled={categories.length === 0}
        itemsPerPage={categories.length}
        itemsTotal={itemsTotal}
        onFilterAdded={filter => handleOnFilterAdded(filter)}
        onFilterRemoved={filter => handleOnFilterRemoved(filter)}
        query={query}
      />
    );
  };

  const handleGoToCostModels = () => {
    navigate(`${formatPath(routes.settings.path)}`, {
      replace: true,
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

  if (priceListError) {
    return <NotAvailable />;
  }
  if (isParentLoading) {
    return null;
  }
  return (
    <>
      {priceList?.assigned_cost_model_count > 0 || priceListFetchStatus === FetchStatus.inProgress ? (
        <Card>
          <CardBody>
            <>
              {getToolbar()}
              {priceListFetchStatus === FetchStatus.inProgress ? (
                <LoadingState
                  body={intl.formatMessage(messages.costModelsLoadingStateDesc)}
                  heading={intl.formatMessage(messages.costModelsLoadingStateTitle)}
                />
              ) : (
                <>{getTable()}</>
              )}
            </>
          </CardBody>
        </Card>
      ) : (
        <EmptyState titleText={intl.formatMessage(messages.priceListEmptyCostModels)}>
          <EmptyStateBody>{intl.formatMessage(messages.priceListEmptyCostModelsDesc)}</EmptyStateBody>
          <EmptyStateFooter>
            <Button onClick={handleGoToCostModels} variant={ButtonVariant.primary}>
              {intl.formatMessage(messages.costModelsGoTo)}
            </Button>
          </EmptyStateFooter>
        </EmptyState>
      )}
    </>
  );
};

const useMapToProps = ({ query }: CostModelsMapProps): CostModelsStateProps => {
  const dispatch: ThunkDispatch<RootState, any, AnyAction> = useDispatch();
  const { uuid } = useParams();

  const priceListQuery = {
    filter_by: query.filter_by,
  };
  const priceListQueryString = getQuery(priceListQuery);
  const priceList = useSelector((state: RootState) =>
    priceListSelectors.selectPriceList(state, PriceListType.priceList, priceListQueryString)
  ) as PriceListData;
  const priceListError = useSelector((state: RootState) =>
    priceListSelectors.selectPriceListError(state, PriceListType.priceList, priceListQueryString)
  );
  const priceListFetchStatus = useSelector((state: RootState) =>
    priceListSelectors.selectPriceListFetchStatus(state, PriceListType.priceList, priceListQueryString)
  );

  useEffect(() => {
    if (!priceListError && priceListFetchStatus !== FetchStatus.inProgress && uuid) {
      dispatch(priceListActions.fetchPriceList(PriceListType.priceList, uuid, priceListQueryString));
    }
  }, [dispatch, priceListError, priceListQueryString, query, uuid]);

  return {
    priceList,
    priceListError,
    priceListFetchStatus,
  };
};

export { CostModels };
