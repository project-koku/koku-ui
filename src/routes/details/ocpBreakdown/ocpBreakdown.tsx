import { ProviderType } from 'api/providers';
import { getProvidersQuery } from 'api/queries/providersQuery';
import type { Query } from 'api/queries/query';
import { getQuery, parseQuery } from 'api/queries/query';
import { ReportPathsType, ReportType } from 'api/reports/report';
import { TagPathsType } from 'api/tags/tag';
import messages from 'locales/messages';
import React from 'react';
import type { WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { routes } from 'routes';
import type { BreakdownStateProps } from 'routes/details/components/breakdown';
import { BreakdownBase } from 'routes/details/components/breakdown';
import { DataDetails } from 'routes/details/components/providerDetails/clusterDetails';
import { ClusterInfo } from 'routes/details/ocpBreakdown/providerDetails/clusterInfo';
import { getGroupById, getGroupByValue } from 'routes/utils/groupBy';
import { filterProviders } from 'routes/utils/providers';
import { getQueryState } from 'routes/utils/queryState';
import { createMapStateToProps } from 'store/common';
import { FeatureToggleSelectors } from 'store/featureToggle';
import { providersQuery, providersSelectors } from 'store/providers';
import { reportActions, reportSelectors } from 'store/reports';
import { uiActions } from 'store/ui';
import { formatPath } from 'utils/paths';
import { breadcrumbLabelKey, breakdownDescKey, breakdownTitleKey, platformCategoryKey } from 'utils/props';
import type { RouterComponentProps } from 'utils/router';
import { withRouter } from 'utils/router';
import { getCostDistribution, getCurrency } from 'utils/sessionStorage';

import { CostOverview } from './costOverview';
import { HistoricalData } from './historicalData';
import { Optimizations } from './optimizations';

interface OcpBreakdownDispatchProps {
  closeOptimizationsDrawer?: typeof uiActions.closeOptimizationsDrawer;
  fetchReport?: typeof reportActions.fetchReport;
}

type OcpBreakdownOwnProps = RouterComponentProps & WrappedComponentProps;

const detailsURL = formatPath(routes.ocpDetails.path);
const reportType = ReportType.cost;
const reportPathsType = ReportPathsType.ocp;

const mapStateToProps = createMapStateToProps<OcpBreakdownOwnProps, BreakdownStateProps>((state, { intl, router }) => {
  const queryFromRoute = parseQuery<Query>(router.location.search);
  const queryState = getQueryState(router.location, 'details');

  const groupBy = getGroupById(queryFromRoute);
  const groupByValue = getGroupByValue(queryFromRoute);

  const costDistribution = groupBy === 'project' ? getCostDistribution() : undefined;
  const currency = getCurrency();

  const query = { ...queryFromRoute };
  const reportQuery = {
    currency,
    filter: {
      resolution: 'monthly',
      time_scope_units: 'month',
      time_scope_value: -1,
    },
    filter_by: {
      // Add filters here to apply logical OR/AND
      ...(queryState?.filter_by && queryState.filter_by),
      ...(queryFromRoute?.isPlatformCosts && { category: platformCategoryKey }),
      // Omit filters associated with the current group_by -- see https://issues.redhat.com/browse/COST-1131 and https://issues.redhat.com/browse/COST-3642
      ...(groupBy && groupByValue !== '*' && { [groupBy]: undefined }), // Used by the "Platform" project
    },
    exclude: {
      ...(queryState?.exclude && queryState.exclude),
    },
    group_by: {
      ...(groupBy && { [groupBy]: groupByValue }),
    },
  };

  const reportQueryString = getQuery(reportQuery);
  const report = reportSelectors.selectReport(state, reportPathsType, reportType, reportQueryString);
  const reportError = reportSelectors.selectReportError(state, reportPathsType, reportType, reportQueryString);
  const reportFetchStatus = reportSelectors.selectReportFetchStatus(
    state,
    reportPathsType,
    reportType,
    reportQueryString
  );

  const providersQueryString = getProvidersQuery(providersQuery);
  const providers = providersSelectors.selectProviders(state, ProviderType.all, providersQueryString);
  const providersFetchStatus = providersSelectors.selectProvidersFetchStatus(
    state,
    ProviderType.all,
    providersQueryString
  );

  const breadcrumbLabel = queryFromRoute[breadcrumbLabelKey] ? queryFromRoute[breadcrumbLabelKey] : undefined;
  const title = queryFromRoute[breakdownTitleKey] ? queryFromRoute[breakdownTitleKey] : groupByValue;

  return {
    breadcrumbLabel,
    clusterInfoComponent: groupBy === 'cluster' ? <ClusterInfo clusterId={groupByValue} /> : undefined,
    dataDetailsComponent: groupBy === 'cluster' ? <DataDetails clusterId={groupByValue} /> : undefined,
    costDistribution,
    costOverviewComponent: (
      <CostOverview
        costDistribution={costDistribution}
        currency={currency}
        groupBy={groupBy}
        isPlatformCosts={queryFromRoute?.isPlatformCosts}
        report={report}
        title={title}
      />
    ),
    currency,
    description: queryFromRoute[breakdownDescKey],
    detailsURL,
    emptyStateTitle: intl.formatMessage(messages.ocpDetailsTitle),
    groupBy,
    groupByValue,
    historicalDataComponent: (
      <HistoricalData costDistribution={costDistribution} currency={currency} groupBy={groupBy} />
    ),
    isOptimizationsTab: queryFromRoute.optimizationsTab !== undefined,
    isRosToggleEnabled: FeatureToggleSelectors.selectIsRosToggleEnabled(state),
    optimizationsComponent: groupBy === 'project' && groupByValue !== '*' ? <Optimizations /> : undefined,
    providers: filterProviders(providers, ProviderType.ocp),
    providersFetchStatus,
    providerType: ProviderType.ocp,
    query,
    queryState,
    report,
    reportError,
    reportFetchStatus,
    reportType,
    reportPathsType,
    reportQueryString,
    showCostDistribution: groupBy === 'project',
    tagPathsType: TagPathsType.ocp,
    title,
  };
});

const mapDispatchToProps: OcpBreakdownDispatchProps = {
  closeOptimizationsDrawer: uiActions.closeOptimizationsDrawer,
  fetchReport: reportActions.fetchReport,
};

export default injectIntl(withRouter(connect(mapStateToProps, mapDispatchToProps)(BreakdownBase)));
