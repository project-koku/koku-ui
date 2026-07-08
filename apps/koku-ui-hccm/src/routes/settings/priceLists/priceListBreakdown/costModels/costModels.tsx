import {
  Button,
  ButtonVariant,
  Card,
  CardBody,
  EmptyState,
  EmptyStateBody,
  EmptyStateFooter,
} from '@patternfly/react-core';
import type { AssignedCostModel, PriceListData } from 'api/priceList';
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
import { getFilteredCostModels } from 'routes/settings/priceLists/priceListBreakdown/rates/utils';
import * as queryUtils from 'routes/utils/query';
import type { RootState } from 'store';
import { FetchStatus } from 'store/common';
import { priceListActions, priceListSelectors } from 'store/priceLists';
import { formatPath } from 'utils/paths';

import { CostModelsTable } from './costModelsTable';
import { CostModelsToolbar } from './costModelsToolbar';

interface CostModelsOwnProps {
  // TBD...
}

export interface CostModelsMapProps {
  query?: Query;
}

export interface CostModelsStateProps {
  costModels?: AssignedCostModel[];
  priceList?: PriceListData | any;
  priceListError?: AxiosError;
  priceListFetchStatus?: FetchStatus;
}

type CostModelsProps = CostModelsOwnProps;

const baseQuery: Query = {
  filter_by: {},
};

const CostModels: React.FC<CostModelsProps> = () => {
  const intl = useIntl();
  const navigate = useNavigate();

  const [query, setQuery] = useState({ ...baseQuery });

  const { costModels, priceListError, priceListFetchStatus } = useMapToProps({ query });

  const hasFilters = Object.keys(query?.filter_by ?? {}).some(key => query.filter_by[key]?.length > 0);
  const hasNoCostModels = costModels?.length === 0 && !hasFilters;
  const isLoading = priceListFetchStatus === FetchStatus.inProgress;

  const getTable = () => {
    return (
      <CostModelsTable
        costModels={costModels}
        filterBy={query.filter_by}
        isDisabled={hasNoCostModels}
        isLoading={isLoading}
      />
    );
  };

  const getToolbar = () => {
    return (
      <CostModelsToolbar
        isDisabled={hasNoCostModels}
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
  return (
    <>
      {!hasNoCostModels || isLoading ? (
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

  // Todo: Update once we have a paginated API
  const priceListQuery = {
    // filter_by: query.filter_by,
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
  }, [dispatch, priceListError, priceListQueryString, uuid]);

  // Add filter
  const costModels = getFilteredCostModels(priceList?.assigned_cost_models, query?.filter_by);

  return {
    costModels,
    priceList,
    priceListError,
    priceListFetchStatus,
  };
};

export { CostModels };
