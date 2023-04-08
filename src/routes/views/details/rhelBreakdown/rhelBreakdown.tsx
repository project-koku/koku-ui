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
import type { BreakdownStateProps } from 'routes/views/details/components/breakdown';
import { BreakdownBase } from 'routes/views/details/components/breakdown';
import { getGroupById, getGroupByValue } from 'routes/views/utils/groupBy';
import { filterProviders } from 'routes/views/utils/providers';
import { createMapStateToProps } from 'store/common';
import { providersQuery, providersSelectors } from 'store/providers';
import { reportActions, reportSelectors } from 'store/reports';
import { getCurrency } from 'utils/localStorage';
import { formatPath } from 'utils/paths';
import { breakdownDescKey, breakdownTitleKey, platformCategoryKey } from 'utils/props';
import type { RouterComponentProps } from 'utils/router';
import { withRouter } from 'utils/router';

import { CostOverview } from './costOverview';
import { HistoricalData } from './historicalData';

interface BreakdownDispatchProps {
  fetchReport?: typeof reportActions.fetchReport;
}

type RhelBreakdownOwnProps = RouterComponentProps & WrappedComponentProps;

const detailsURL = formatPath(routes.rhelDetails.path);
const reportType = ReportType.cost;
const reportPathsType = ReportPathsType.rhel;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mapStateToProps = createMapStateToProps<RhelBreakdownOwnProps, BreakdownStateProps>((state, { intl, router }) => {
  const queryFromRoute = parseQuery<Query>(router.location.search);
  const queryState = queryFromRoute.state ? JSON.parse(window.atob(queryFromRoute.state)) : undefined;

  const groupBy = getGroupById(queryFromRoute);
  const groupByValue = getGroupByValue(queryFromRoute);
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
      ...(queryState && queryState.filter_by && queryState.filter_by),
      ...(queryFromRoute && queryFromRoute.isPlatformCosts && { category: platformCategoryKey }),
      // Omit filters associated with the current group_by -- see https://issues.redhat.com/browse/COST-1131 and https://issues.redhat.com/browse/COST-3642
      ...(groupBy && groupByValue !== '*' && { [groupBy]: undefined }),
    },
    exclude: {
      ...(queryState && queryState.exclude && queryState.exclude),
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

  const title = queryFromRoute[breakdownTitleKey] ? queryFromRoute[breakdownTitleKey] : groupByValue;

  return {
    costOverviewComponent: <CostOverview currency={currency} groupBy={groupBy} report={report} title={title} />,
    currency,
    description: queryFromRoute[breakdownDescKey],
    detailsURL,
    emptyStateTitle: intl.formatMessage(messages.rhelDetailsTitle),
    groupBy,
    groupByValue,
    historicalDataComponent: <HistoricalData currency={currency} />,
    providers: filterProviders(providers, ProviderType.rhel),
    providersFetchStatus,
    providerType: ProviderType.rhel,
    query,
    report,
    reportError,
    reportFetchStatus,
    reportType,
    reportPathsType,
    reportQueryString,
    tagReportPathsType: TagPathsType.rhel,
    title,
  };
});

const mapDispatchToProps: BreakdownDispatchProps = {
  fetchReport: reportActions.fetchReport,
};

const RhelBreakdown = injectIntl(withRouter(connect(mapStateToProps, mapDispatchToProps)(BreakdownBase)));

export default RhelBreakdown;
