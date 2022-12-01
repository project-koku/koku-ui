import { ProviderType } from 'api/providers';
import { getQuery, parseQuery } from 'api/queries/ocpQuery';
import { getProvidersQuery } from 'api/queries/providersQuery';
import type { Query } from 'api/queries/query';
import { breakdownDescKey, breakdownTitleKey } from 'api/queries/query';
import type { Report } from 'api/reports/report';
import { ReportPathsType, ReportType } from 'api/reports/report';
import { TagPathsType } from 'api/tags/tag';
import type { AxiosError } from 'axios';
import messages from 'locales/messages';
import React from 'react';
import type { WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { paths } from 'routes';
import { BreakdownBase } from 'routes/views/details/components/breakdown';
import { getGroupById, getGroupByValue } from 'routes/views/utils/groupBy';
import { isPlatformCosts } from 'routes/views/utils/paths';
import { filterProviders } from 'routes/views/utils/providers';
import type { FetchStatus } from 'store/common';
import { createMapStateToProps } from 'store/common';
import { featureFlagsSelectors } from 'store/featureFlags';
import { providersQuery, providersSelectors } from 'store/providers';
import { reportActions, reportSelectors } from 'store/reports';
import { getCurrency } from 'utils/localStorage';

import { CostOverview } from './costOverview';
import { HistoricalData } from './historicalData';

type OcpBreakdownOwnProps = WrappedComponentProps;

interface OcpBreakdownStateProps {
  CostOverview?: React.ReactNode;
  currency?: string;
  detailsURL: string;
  HistoricalData?: React.ReactNode;
  query: Query;
  report: Report;
  reportError: AxiosError;
  reportFetchStatus: FetchStatus;
  reportType: ReportType;
  reportPathsType: ReportPathsType;
  reportQueryString: string;
}

interface BreakdownDispatchProps {
  fetchReport?: typeof reportActions.fetchReport;
}

const detailsURL = paths.ocpDetails;
const reportType = ReportType.cost;
const reportPathsType = ReportPathsType.ocp;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mapStateToProps = createMapStateToProps<OcpBreakdownOwnProps, OcpBreakdownStateProps>((state, props) => {
  const queryFromRoute = parseQuery<Query>(location.search);
  const groupBy = getGroupById(queryFromRoute);
  const groupByValue = getGroupByValue(queryFromRoute);
  const currency = featureFlagsSelectors.selectIsCurrencyFeatureEnabled(state) ? getCurrency() : undefined;

  const newQuery: Query = {
    filter: {
      resolution: 'monthly',
      time_scope_units: 'month',
      time_scope_value: -1,
    },
    filter_by: {
      // Add filters here to apply logical OR/AND
      ...(queryFromRoute && queryFromRoute.filter_by && queryFromRoute.filter_by),
      ...(queryFromRoute && queryFromRoute.filter && { category: queryFromRoute.filter.category }),
      ...(groupBy && { [groupBy]: undefined }), // Omit filters associated with the current group_by -- see https://issues.redhat.com/browse/COST-1131
    },
    exclude: {
      ...(queryFromRoute && queryFromRoute.exclude && queryFromRoute.exclude),
    },
    group_by: {
      ...(groupBy && { [groupBy]: groupByValue }),
    },
    category: queryFromRoute.category, // Needed to restore details page state
  };

  const reportQueryString = getQuery({
    ...newQuery,
    currency,
    category: undefined,
  });
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

  return {
    costOverviewComponent: (
      <CostOverview
        currency={currency}
        groupBy={groupBy}
        isPlatformCosts={isPlatformCosts(queryFromRoute)}
        report={report}
      />
    ),
    currency,
    description: queryFromRoute[breakdownDescKey],
    detailsURL,
    emptyStateTitle: props.intl.formatMessage(messages.ocpDetailsTitle),
    groupBy,
    groupByValue,
    historicalDataComponent: <HistoricalData currency={currency} />,
    providers: filterProviders(providers, ProviderType.ocp),
    providersFetchStatus,
    providerType: ProviderType.ocp,
    query: queryFromRoute,
    report,
    reportError,
    reportFetchStatus,
    reportType,
    reportPathsType,
    reportQueryString,
    tagReportPathsType: TagPathsType.ocp,
    title: queryFromRoute[breakdownTitleKey] ? queryFromRoute[breakdownTitleKey] : groupByValue,
  };
});

const mapDispatchToProps: BreakdownDispatchProps = {
  fetchReport: reportActions.fetchReport,
};

const OcpBreakdown = injectIntl(connect(mapStateToProps, mapDispatchToProps)(BreakdownBase));

export default OcpBreakdown;
