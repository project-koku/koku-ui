import { ProviderType } from 'api/providers';
import { getProvidersQuery } from 'api/queries/providersQuery';
import type { Query } from 'api/queries/query';
import { getQuery, getQueryState, parseQuery } from 'api/queries/query';
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
import { getGroupById, getGroupByValue } from 'routes/utils/groupBy';
import { filterProviders } from 'routes/utils/providers';
import { createMapStateToProps } from 'store/common';
import { providersQuery, providersSelectors } from 'store/providers';
import { reportActions, reportSelectors } from 'store/reports';
import { getCurrency } from 'utils/localStorage';
import { formatPath } from 'utils/paths';
import { breakdownDescKey, breakdownTitleKey } from 'utils/props';
import type { RouterComponentProps } from 'utils/router';
import { withRouter } from 'utils/router';

import { CostOverview } from './costOverview';
import { HistoricalData } from './historicalData';

type AzureCostOwnProps = RouterComponentProps & WrappedComponentProps;

interface AzureCostDispatchProps {
  fetchReport?: typeof reportActions.fetchReport;
}

const detailsURL = formatPath(routes.azureDetails.path);
const reportType = ReportType.cost;
const reportPathsType = ReportPathsType.azure;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mapStateToProps = createMapStateToProps<AzureCostOwnProps, BreakdownStateProps>((state, { intl, router }) => {
  const queryFromRoute = parseQuery<Query>(router.location.search);
  const queryState = getQueryState(router.location, 'details');

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
      // Omit filters associated with the current group_by -- see https://issues.redhat.com/browse/COST-1131 and https://issues.redhat.com/browse/COST-3642
      // ...(groupBy && groupByValue !== '*' && { [groupBy]: undefined }),
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
  const providersError = providersSelectors.selectProvidersError(state, ProviderType.all, providersQueryString);
  const providersFetchStatus = providersSelectors.selectProvidersFetchStatus(
    state,
    ProviderType.all,
    providersQueryString
  );

  const title = queryFromRoute[breakdownTitleKey] ? queryFromRoute[breakdownTitleKey] : groupByValue;

  return {
    costOverviewComponent: <CostOverview currency={currency} groupBy={groupBy} report={report} />,
    currency,
    description: queryFromRoute[breakdownDescKey],
    detailsURL,
    emptyStateTitle: intl.formatMessage(messages.azureDetailsTitle),
    groupBy,
    groupByValue,
    historicalDataComponent: <HistoricalData currency={currency} />,
    providers: filterProviders(providers, ProviderType.azure),
    providersError,
    providersFetchStatus,
    providerType: ProviderType.azure,
    query,
    report,
    reportError,
    reportFetchStatus,
    reportType,
    reportPathsType,
    reportQueryString,
    tagPathsType: TagPathsType.azure,
    title,
  };
});

const mapDispatchToProps: AzureCostDispatchProps = {
  fetchReport: reportActions.fetchReport,
};

const AzureCost = injectIntl(withRouter(connect(mapStateToProps, mapDispatchToProps)(BreakdownBase)));

export default AzureCost;
