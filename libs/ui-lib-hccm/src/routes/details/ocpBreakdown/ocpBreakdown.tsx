import { ProviderType } from '@koku-ui/api/providers';
import { getProvidersQuery } from '@koku-ui/api/queries/providersQuery';
import type { Query } from '@koku-ui/api/queries/query';
import { getQuery, parseQuery } from '@koku-ui/api/queries/query';
import { ReportPathsType, ReportType } from '@koku-ui/api/reports/report';
import { TagPathsType } from '@koku-ui/api/tags/tag';
import messages from '@koku-ui/i18n/locales/messages';
import React from 'react';
import type { WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';

import { routes } from '../../../routes';
import { createMapStateToProps } from '../../../store/common';
import { providersQuery, providersSelectors } from '../../../store/providers';
import { reportActions, reportSelectors } from '../../../store/reports';
import { uiActions } from '../../../store/ui';
import { formatPath } from '../../../utils/paths';
import { breadcrumbLabelKey, breakdownDescKey, breakdownTitleKey, platformCategoryKey } from '../../../utils/props';
import type { RouterComponentProps } from '../../../utils/router';
import { withRouter } from '../../../utils/router';
import { getCostDistribution, getCurrency } from '../../../utils/sessionStorage';
import { getGroupById, getGroupByValue } from '../../utils/groupBy';
import { filterProviders } from '../../utils/providers';
import { getQueryState } from '../../utils/queryState';
import { getTimeScopeValue } from '../../utils/timeScope';
import type { BreakdownStateProps } from '../components/breakdown';
import { BreakdownBase } from '../components/breakdown';
import { ProviderBreakdownModal } from '../components/providerStatus';
import { ClusterInfoModal } from './clusterInfo';
import { CostOverview } from './costOverview';
import { HistoricalData } from './historicalData';
import { Optimizations } from './optimizations';
import { Virtualization } from './virtualization';

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
  const isFilterByExact = groupBy && groupByValue !== '*';
  const timeScopeValue = getTimeScopeValue(queryState);

  const query = { ...queryFromRoute };
  const reportQuery = {
    currency,
    filter: {
      resolution: 'monthly',
      time_scope_units: 'month',
      time_scope_value: timeScopeValue,
    },
    filter_by: {
      // Add filters here to apply logical OR/AND
      ...(queryState?.filter_by && queryState.filter_by),
      ...(queryFromRoute?.isPlatformCosts && { category: platformCategoryKey }),
      // Omit filters associated with the current group_by -- see https://issues.redhat.com/browse/COST-1131 and https://issues.redhat.com/browse/COST-3642
      ...(isFilterByExact && {
        [groupBy]: undefined, // Replace with "exact:" filter below -- see https://issues.redhat.com/browse/COST-6659
        [`exact:${groupBy}`]: groupByValue,
      }),
    },
    exclude: {
      ...(queryState?.exclude && queryState.exclude),
    },
    group_by: {
      // Required because distributed costs are only included with group_by project
      ...(groupBy && { [groupBy]: isFilterByExact ? '*' : groupByValue }),
    },
    // Todo: Uncomment to omit group_by in breakdown page
    // ...(!isFilterByExact && {
    //   group_by: {
    //     ...(groupBy && { [groupBy]: groupByValue }),
    //   },
    // }),
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
    clusterInfoComponent: groupBy === 'cluster' ? <ClusterInfoModal clusterId={groupByValue} /> : undefined,
    dataDetailsComponent:
      groupBy === 'cluster' ? (
        <ProviderBreakdownModal clusterId={groupByValue} isOverallStatus providerType={ProviderType.ocp} />
      ) : undefined,
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
      <HistoricalData
        costDistribution={costDistribution}
        currency={currency}
        groupBy={groupBy}
        timeScopeValue={timeScopeValue}
      />
    ),
    isOptimizationsTab: queryFromRoute.optimizationsTab !== undefined,
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
    timeScopeValue,
    title,
    virtualizationComponent: <Virtualization costDistribution={costDistribution} currency={currency} />,
  };
});

const mapDispatchToProps: OcpBreakdownDispatchProps = {
  closeOptimizationsDrawer: uiActions.closeOptimizationsDrawer,
  fetchReport: reportActions.fetchReport,
};

export default injectIntl(withRouter(connect(mapStateToProps, mapDispatchToProps)(BreakdownBase)));
