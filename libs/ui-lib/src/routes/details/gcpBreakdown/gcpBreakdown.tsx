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
import { formatPath } from '../../../utils/paths';
import { breakdownDescKey, breakdownTitleKey } from '../../../utils/props';
import type { RouterComponentProps } from '../../../utils/router';
import { withRouter } from '../../../utils/router';
import { getCurrency } from '../../../utils/sessionStorage';
import { getGroupById, getGroupByValue } from '../../utils/groupBy';
import { filterProviders } from '../../utils/providers';
import { getQueryState } from '../../utils/queryState';
import { getTimeScopeValue } from '../../utils/timeScope';
import type { BreakdownStateProps } from '../components/breakdown';
import { BreakdownBase } from '../components/breakdown';
import { CostOverview } from './costOverview';
import { HistoricalData } from './historicalData';

interface GcpBreakdownDispatchProps {
  fetchReport?: typeof reportActions.fetchReport;
}

type GcpBreakdownOwnProps = RouterComponentProps & WrappedComponentProps;

const detailsURL = formatPath(routes.gcpDetails.path);
const reportType = ReportType.cost;
const reportPathsType = ReportPathsType.gcp;

const mapStateToProps = createMapStateToProps<GcpBreakdownOwnProps, BreakdownStateProps>((state, { intl, router }) => {
  const queryFromRoute = parseQuery<Query>(router.location.search);
  const queryState = getQueryState(router.location, 'details');

  const groupBy = getGroupById(queryFromRoute);
  const groupByValue = getGroupByValue(queryFromRoute);

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
      ...(groupBy && { [groupBy]: isFilterByExact ? '*' : groupByValue }),
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
  const providersError = providersSelectors.selectProvidersError(state, ProviderType.all, providersQueryString);
  const providersFetchStatus = providersSelectors.selectProvidersFetchStatus(
    state,
    ProviderType.all,
    providersQueryString
  );

  return {
    breadcrumbPath: formatPath(routes.gcpDetails.path),
    costOverviewComponent: <CostOverview currency={currency} groupBy={groupBy} report={report} />,
    currency,
    description: queryFromRoute[breakdownDescKey],
    detailsURL,
    emptyStateTitle: intl.formatMessage(messages.gcpDetailsTitle),
    groupBy,
    groupByValue,
    historicalDataComponent: <HistoricalData currency={currency} timeScopeValue={timeScopeValue} />,
    providers: filterProviders(providers, ProviderType.gcp),
    providersError,
    providersFetchStatus,
    providerType: ProviderType.gcp,
    query,
    report,
    reportError,
    reportFetchStatus,
    reportType,
    reportPathsType,
    reportQueryString,
    tagPathsType: TagPathsType.gcp,
    timeScopeValue,
    title: queryFromRoute[breakdownTitleKey] ? queryFromRoute[breakdownTitleKey] : groupByValue,
  };
});

const mapDispatchToProps: GcpBreakdownDispatchProps = {
  fetchReport: reportActions.fetchReport,
};

export default injectIntl(withRouter(connect(mapStateToProps, mapDispatchToProps)(BreakdownBase)));
