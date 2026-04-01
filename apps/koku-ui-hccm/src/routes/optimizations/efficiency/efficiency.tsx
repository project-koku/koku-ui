import { Alert, AlertActionCloseButton, AlertActionLink, PageSection } from '@patternfly/react-core';
import type { Providers } from 'api/providers';
import { ProviderType } from 'api/providers';
import type { OcpQuery } from 'api/queries/ocpQuery';
import { parseQuery } from 'api/queries/ocpQuery';
import { getProvidersQuery } from 'api/queries/providersQuery';
import { ResourcePathsType } from 'api/resources/resource';
import type { AxiosError } from 'axios';
import messages from 'locales/messages';
import React from 'react';
import type { WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { ComputedReportItemValueType } from 'routes/components/charts/common';
import { Loading } from 'routes/components/page/loading';
import { NoData } from 'routes/components/page/noData';
import { NoProviders } from 'routes/components/page/noProviders';
import { NotAvailable } from 'routes/components/page/notAvailable';
import { ProviderStatus } from 'routes/details/components/providerStatus';
import { getIdKeyForGroupBy } from 'routes/utils/computedReport/getComputedOcpReportItems';
import { DateRangeType } from 'routes/utils/dateRange';
import { getGroupById } from 'routes/utils/groupBy';
import { filterProviders, hasCurrentMonthData, hasPreviousMonthData } from 'routes/utils/providers';
import { getRouteForQuery } from 'routes/utils/query';
import { handleOnCurrencySelect, handleOnFilterAdded, handleOnFilterRemoved } from 'routes/utils/queryNavigate';
import { getTimeScopeValue } from 'routes/utils/timeScope';
import { createMapStateToProps, FetchStatus } from 'store/common';
import { providersQuery, providersSelectors } from 'store/providers';
import { reportActions } from 'store/reports';
import { uiActions } from 'store/ui';
import type { openProvidersModal } from 'store/ui/uiActions';
import { getSinceDateRangeString } from 'utils/dates';
import type { RouterComponentProps } from 'utils/router';
import { withRouter } from 'utils/router';
import {
  deleteOperatorAvailable,
  getCostDistribution,
  getCurrency,
  isOperatorAvailableValid,
  setOperatorAvailable,
} from 'utils/sessionStorage';

import { styles } from './efficiency.styles';
import EfficiencyCompute from './efficiencyCompute';
import { EfficiencyHeader } from './efficiencyHeader';

export interface EfficiencyStateProps {
  currency?: string;
  currentDateRangeType?: string;
  isCurrentMonthData?: boolean;
  isPreviousMonthData?: boolean;
  providers: Providers;
  providersError: AxiosError;
  providersFetchStatus: FetchStatus;
  query: OcpQuery;
}

interface EfficiencyDispatchProps {
  fetchReport: typeof reportActions.fetchReport;
  openProvidersModal: typeof openProvidersModal;
}

interface EfficiencyState {
  isExportModalOpen?: boolean;
}

type EfficiencyOwnProps = RouterComponentProps & WrappedComponentProps;

type EfficiencyProps = EfficiencyStateProps & EfficiencyOwnProps & EfficiencyDispatchProps;

const baseQuery: OcpQuery = {
  filter: {
    limit: 10,
    offset: 0,
  },
  filter_by: {},
  exclude: {},
  group_by: {
    project: '*',
  },
  order_by: {
    cost: 'desc',
  },
};

class Efficiency extends React.Component<EfficiencyProps, EfficiencyState> {
  protected defaultState: EfficiencyState = {
    isExportModalOpen: false,
  };
  public state: EfficiencyState = { ...this.defaultState };

  private getComputeCard = () => {
    const { isCurrentMonthData, query } = this.props;

    return (
      <EfficiencyCompute isCurrentMonthData={isCurrentMonthData} timeScopeValue={query?.filter?.time_scope_value} />
    );
  };

  private handleOnDateRangeSelect = (value: string) => {
    const { query, router } = this.props;

    const newQuery = {
      filter: {},
      ...JSON.parse(JSON.stringify(query)),
    };
    newQuery.filter.time_scope_value = value === DateRangeType.previousMonth ? -2 : -1;
    router.navigate(getRouteForQuery(newQuery, router.location, true), { replace: true });
  };

  private handleOnGroupBySelect = groupBy => {
    const { query, router } = this.props;
    const groupByKey: keyof OcpQuery['group_by'] = groupBy as any;
    const newQuery = {
      ...JSON.parse(JSON.stringify(query)),
      // filter_by: undefined, // Preserve filter -- see https://redhat.atlassian.net/browse/COST-1090
      group_by: {
        [groupByKey]: '*',
      },
      order_by: undefined, // Clear sort
      category: undefined, // Only applies to projects
      delta: undefined,
    };
    router.navigate(getRouteForQuery(newQuery, router.location, true), { replace: true });
  };

  private handleOnOperatorAvailableClose = () => {
    // Set token to keep closed for current session
    setOperatorAvailable('true');
    this.forceUpdate();
  };

  private isOperatorAlertOpen = () => {
    const { providers, providersError, providersFetchStatus } = this.props;

    const result = providers.data.find(provider => provider.additional_context?.operator_update_available === true);

    if (!result) {
      if (providers && providersFetchStatus === FetchStatus.complete && !providersError) {
        deleteOperatorAvailable(); // Reset cookie for new alerts
      }
      return false;
    }

    // Keep closed if token is valid for current session
    return !isOperatorAvailableValid();
  };

  public render() {
    const {
      currency,
      intl,
      isCurrentMonthData,
      isPreviousMonthData,
      openProvidersModal,
      providers,
      providersError,
      providersFetchStatus,
      query,
      router,
    } = this.props;

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
      <>
        <PageSection style={styles.headerContainer}>
          <EfficiencyHeader
            currency={currency}
            groupBy={groupById}
            isCurrentMonthData={isCurrentMonthData}
            isDisabled={!isCurrentMonthData && !isPreviousMonthData}
            isPreviousMonthData={isPreviousMonthData}
            onCurrencySelect={() => handleOnCurrencySelect(query, router)}
            onDateRangeSelect={this.handleOnDateRangeSelect}
            onFilterAdded={filter => handleOnFilterAdded(query, router, filter)}
            onFilterRemoved={filter => handleOnFilterRemoved(query, router, filter)}
            onGroupBySelect={this.handleOnGroupBySelect}
            query={query}
            resourcePathsType={ResourcePathsType.ocp}
          />
        </PageSection>
        <PageSection>
          {this.isOperatorAlertOpen() && (
            <Alert
              actionClose={<AlertActionCloseButton onClose={() => this.handleOnOperatorAvailableClose()} />}
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
          {this.getComputeCard()}
        </PageSection>
      </>
    );
  }
}

const mapStateToProps = createMapStateToProps<EfficiencyOwnProps, EfficiencyStateProps>((state, { router }) => {
  const queryFromRoute = parseQuery<OcpQuery>(router.location.search);
  const groupBy = queryFromRoute.group_by ? getGroupById(queryFromRoute) : getGroupById(baseQuery);

  const costDistribution = groupBy === 'project' ? getCostDistribution() : undefined;
  const currency = getCurrency();

  // Check for current and previous data first
  const providersQueryString = getProvidersQuery(providersQuery);
  const providers = providersSelectors.selectProviders(state, ProviderType.all, providersQueryString);
  const providersError = providersSelectors.selectProvidersError(state, ProviderType.all, providersQueryString);
  const providersFetchStatus = providersSelectors.selectProvidersFetchStatus(
    state,
    ProviderType.all,
    providersQueryString
  );

  // Fetch based on time scope value
  const filteredProviders = filterProviders(providers, ProviderType.ocp);
  const isCurrentMonthData = hasCurrentMonthData(filteredProviders);

  let timeScopeValue = getTimeScopeValue(queryFromRoute);
  timeScopeValue = Number(!isCurrentMonthData ? -2 : timeScopeValue !== undefined ? timeScopeValue : -1);

  const query: any = {
    ...baseQuery,
    ...(costDistribution === ComputedReportItemValueType.distributed && {
      order_by: {
        distributed_cost: 'desc',
      },
    }),
    ...queryFromRoute,
  };
  query.filter.time_scope_value = timeScopeValue; // Add time scope here for breakdown pages

  return {
    costDistribution,
    currency,
    isCurrentMonthData,
    isPreviousMonthData: hasPreviousMonthData(filteredProviders),
    providers: filteredProviders,
    providersError,
    providersFetchStatus,
    query,
  };
});

const mapDispatchToProps: EfficiencyDispatchProps = {
  fetchReport: reportActions.fetchReport,
  openProvidersModal: uiActions.openProvidersModal,
};

export default injectIntl(withRouter(connect(mapStateToProps, mapDispatchToProps)(Efficiency)));
