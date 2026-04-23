import { Alert, AlertActionCloseButton, AlertActionLink, Grid, GridItem, PageSection } from '@patternfly/react-core';
import type { Providers } from 'api/providers';
import { ProviderType } from 'api/providers';
import type { OcpQuery } from 'api/queries/ocpQuery';
import { getQuery } from 'api/queries/ocpQuery';
import { ResourcePathsType } from 'api/resources/resource';
import type { AxiosError } from 'axios';
import messages from 'locales/messages';
import React, { useEffect, useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import type { AnyAction } from 'redux';
import type { ThunkDispatch } from 'redux-thunk';
import { getResizeObserver } from 'routes/components/charts/common';
import { Loading } from 'routes/components/page/loading';
import { NoData } from 'routes/components/page/noData';
import { NoProviders } from 'routes/components/page/noProviders';
import { NotAvailable } from 'routes/components/page/notAvailable';
import { ProviderStatus } from 'routes/details/components/providerStatus';
import { getIdKeyForGroupBy } from 'routes/utils/computedReport/getComputedOcpReportItems';
import { DateRangeType } from 'routes/utils/dateRange';
import { filterProviders, hasCurrentMonthData, hasPreviousMonthData } from 'routes/utils/providers';
import * as queryUtils from 'routes/utils/query';
import { getQueryState } from 'routes/utils/queryState';
import type { RootState } from 'store';
import { FetchStatus } from 'store/common';
import { providersActions, providersQuery, providersSelectors } from 'store/providers';
import { uiActions } from 'store/ui';
import type { openProvidersModal } from 'store/ui/uiActions';
import { getSinceDateRangeString } from 'utils/dates';
import {
  deleteOperatorAvailable,
  getCurrency,
  isOperatorAvailableValid,
  setOperatorAvailable,
} from 'utils/sessionStorage';

import { ComputeCard } from './compute';
import { styles } from './efficiency.styles';
import { EfficiencyHeader } from './efficiencyHeader';
import { MemoryCard } from './memory';

interface EfficiencyOwnProps {
  // TBD...
}

export interface EfficiencyStateProps {
  currency?: string;
  isCurrentMonthData?: boolean;
  isPreviousMonthData?: boolean;
  openProvidersModal: typeof openProvidersModal;
  providers: Providers;
  providersError: AxiosError;
  providersFetchStatus: FetchStatus;
}

export interface EfficiencyMapProps {
  // TBD...
}

type EfficiencyProps = EfficiencyOwnProps;

const baseQuery: OcpQuery = {
  filter: {},
  filter_by: {},
  exclude: {},
  group_by: {
    cluster: '*',
  },
  order_by: {},
};

const Efficiency: React.FC<EfficiencyProps> = () => {
  const intl = useIntl();
  const location = useLocation();
  const navigate = useNavigate();

  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);

  const queryStateName = 'efficiencyState';
  const queryState = getQueryState(location, queryStateName);
  const [query, setQuery] = useState({ ...baseQuery, ...(queryState && queryState) });

  const {
    currency,
    isCurrentMonthData,
    isPreviousMonthData,
    openProvidersModal,
    providers,
    providersError,
    providersFetchStatus,
  } = useMapToProps();

  useEffect(() => {
    // Set default time scope
    if (query.filter?.time_scope_value === undefined) {
      const newQuery = {
        ...query,
        filter: {
          ...query.filter,
          time_scope_value: Number(!isCurrentMonthData ? -2 : -1),
        },
      };
      setQuery(newQuery);
    } else {
      // Update state
      navigate(`${location.pathname}${location.search}`, {
        replace: true,
        state: {
          ...(location?.state || {}),
          ...(queryStateName && {
            [queryStateName]: {
              ...query,
            },
          }),
        },
      });
    }
  }, [isCurrentMonthData, query]);

  // Force update
  const forceUpdate = () => {
    setQuery({ ...query });
  };

  const handleOnDateRangeSelect = (value: string) => {
    const newQuery = {
      filter: {},
      ...JSON.parse(JSON.stringify(query)),
    };
    newQuery.filter.time_scope_value = value === DateRangeType.previousMonth ? -2 : -1;
    setQuery(newQuery);
  };

  const handleOnFilterAdded = filter => {
    const newQuery = queryUtils.handleOnFilterAdded(query, filter);
    setQuery(newQuery);
  };

  const handleOnFilterRemoved = filter => {
    const newQuery = queryUtils.handleOnFilterRemoved(query, filter);
    setQuery(newQuery);
  };

  const handleOnCurrencySelect = () => {
    const newQuery = queryUtils.handleOnCurrencySelect(query);
    setQuery(newQuery);
  };

  const handleOnGroupBySelect = groupBy => {
    const groupByKey: keyof OcpQuery['group_by'] = groupBy as any;
    const newQuery = {
      ...JSON.parse(JSON.stringify(query)),
      group_by: {
        [groupByKey]: '*',
      },
      order_by: undefined, // Clear sort
      category: undefined, // Only applies to projects
      delta: undefined,
    };
    setQuery(newQuery);
  };

  const handleOnOperatorAvailableClose = () => {
    // Set token to keep closed for current session
    setOperatorAvailable('true');
    forceUpdate();
  };

  const handleOnResize = () => {
    const { clientWidth = 0 } = containerRef?.current || {};
    if (clientWidth !== width) {
      setWidth(clientWidth);
    }
  };

  const isOperatorAlertOpen = () => {
    const result = providers?.data?.find(provider => provider.additional_context?.operator_update_available === true);

    if (!result) {
      if (providers && providersFetchStatus === FetchStatus.complete && !providersError) {
        deleteOperatorAvailable(); // Reset cookie for new alerts
      }
      return false;
    }

    // Keep closed if token is valid for current session
    return !isOperatorAvailableValid();
  };

  useEffect(() => {
    if (containerRef?.current) {
      const unobserve = getResizeObserver(containerRef?.current, handleOnResize);
      return () => {
        if (unobserve) {
          unobserve();
        }
      };
    }
  }, [containerRef, handleOnResize]);

  const gridColumns = width < 1325 ? 12 : 6;
  const groupById = getIdKeyForGroupBy(query.group_by);
  const title = intl.formatMessage(messages.ocpDetailsTitle);

  // Note: Providers are fetched via the AccountSettings component used by all routes
  if (providersError) {
    return <NotAvailable title={title} />;
  } else if (providersFetchStatus === FetchStatus.inProgress) {
    return <Loading title={title} />;
  } else if (providersFetchStatus === FetchStatus.complete) {
    // API returns empy data array for no sources
    const noProviders = providers && providers.meta && providers.meta.count === 0;

    if (noProviders) {
      return <NoProviders />;
    }
    if (!isCurrentMonthData && !isPreviousMonthData) {
      return <NoData detailsComponent={<ProviderStatus providerType={ProviderType.ocp} />} title={title} />;
    }
  }

  return (
    <div ref={containerRef}>
      <PageSection style={styles.headerContainer}>
        <EfficiencyHeader
          currency={currency}
          groupBy={groupById}
          isCurrentMonthData={isCurrentMonthData}
          isDisabled={!isCurrentMonthData && !isPreviousMonthData}
          isPreviousMonthData={isPreviousMonthData}
          onCurrencySelect={() => handleOnCurrencySelect()}
          onDateRangeSelect={handleOnDateRangeSelect}
          onFilterAdded={filter => handleOnFilterAdded(filter)}
          onFilterRemoved={filter => handleOnFilterRemoved(filter)}
          onGroupBySelect={handleOnGroupBySelect}
          query={query}
          resourcePathsType={ResourcePathsType.ocp}
          timeScopeValue={query.filter.time_scope_value}
        />
      </PageSection>
      <PageSection>
        {isOperatorAlertOpen() && (
          <Alert
            actionClose={<AlertActionCloseButton onClose={() => handleOnOperatorAvailableClose()} />}
            actionLinks={
              <AlertActionLink onClick={() => openProvidersModal()}>
                {intl.formatMessage(messages.newOperatorVersionAvailableLink)}
              </AlertActionLink>
            }
            isInline
            style={styles.alert}
            title={intl.formatMessage(messages.newOperatorVersionAvailable)}
            variant="warning"
          >
            {intl.formatMessage(messages.newOperatorVersionAvailableDesc)}
          </Alert>
        )}
        {!isCurrentMonthData && (
          <Alert
            isInline
            style={styles.alert}
            title={intl.formatMessage(messages.noCurrentData, {
              dateRange: getSinceDateRangeString(),
            })}
            variant="info"
          />
        )}
        <Grid hasGutter>
          <GridItem xl={gridColumns}>
            <ComputeCard
              currency={currency}
              groupBy={groupById}
              exclude={query.exclude}
              filterBy={query.filter_by}
              timeScopeValue={query.filter.time_scope_value}
            />
          </GridItem>
          <GridItem xl={gridColumns}>
            <MemoryCard
              currency={currency}
              groupBy={groupById}
              exclude={query.exclude}
              filterBy={query.filter_by}
              timeScopeValue={query.filter.time_scope_value}
            />
          </GridItem>
        </Grid>
      </PageSection>
    </div>
  );
};

const useMapToProps = (): EfficiencyStateProps => {
  const dispatch: ThunkDispatch<RootState, any, AnyAction> = useDispatch();
  const currency = getCurrency();

  const providersQueryString = getQuery(providersQuery);
  const providers = useSelector((state: RootState) =>
    providersSelectors.selectProviders(state, ProviderType.all, providersQueryString)
  );
  const providersFetchStatus = useSelector((state: RootState) =>
    providersSelectors.selectProvidersFetchStatus(state, ProviderType.all, providersQueryString)
  );
  const providersError = useSelector((state: RootState) =>
    providersSelectors.selectProvidersError(state, ProviderType.all, providersQueryString)
  );

  // Fetch based on time scope value
  const filteredProviders = filterProviders(providers, ProviderType.ocp);
  const isCurrentMonthData = hasCurrentMonthData(filteredProviders);

  useEffect(() => {
    if (!providersError && providersFetchStatus !== FetchStatus.inProgress) {
      dispatch(providersActions.fetchProviders(ProviderType.all, providersQueryString));
    }
  }, [providersQueryString]);

  return {
    currency,
    isCurrentMonthData,
    isPreviousMonthData: hasPreviousMonthData(filteredProviders),
    openProvidersModal: uiActions.openProvidersModal,
    providers: filteredProviders,
    providersError,
    providersFetchStatus,
  };
};

export default Efficiency;
