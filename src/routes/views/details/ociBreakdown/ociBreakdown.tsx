import type { Providers } from 'api/providers';
import { ProviderType } from 'api/providers';
import type { OcpQuery } from 'api/queries/ocpQuery';
import { getQuery, parseQuery } from 'api/queries/ocpQuery';
import { getProvidersQuery } from 'api/queries/providersQuery';
import type { Query } from 'api/queries/query';
import { breakdownDescKey } from 'api/queries/query';
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
import { filterProviders } from 'routes/views/utils/providers';
import type { FetchStatus } from 'store/common';
import { createMapStateToProps } from 'store/common';
import { featureFlagsSelectors } from 'store/featureFlags';
import { providersQuery, providersSelectors } from 'store/providers';
import { reportActions, reportSelectors } from 'store/reports';
import { getCurrency } from 'utils/localStorage';

import { CostOverview } from './costOverview';
import { HistoricalData } from './historicalData';

type OciCostOwnProps = WrappedComponentProps;

interface OciCostStateProps {
  CostOverview?: React.ReactNode;
  currency?: string;
  detailsURL: string;
  HistoricalData?: React.ReactNode;
  providers: Providers;
  providersError: AxiosError;
  providersFetchStatus: FetchStatus;
  query: Query;
  report: Report;
  reportError: AxiosError;
  reportFetchStatus: FetchStatus;
  reportType: ReportType;
  reportPathsType: ReportPathsType;
  reportQueryString: string;
}

interface OciCostDispatchProps {
  fetchReport?: typeof reportActions.fetchReport;
}

const detailsURL = paths.ociDetails;
const reportType = ReportType.cost;
const reportPathsType = ReportPathsType.oci;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mapStateToProps = createMapStateToProps<OciCostOwnProps, OciCostStateProps>((state, props) => {
  const queryFromRoute = parseQuery<OcpQuery>(location.search);
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
      ...(groupBy && { [groupBy]: undefined }), // Omit filters associated with the current group_by -- see https://issues.redhat.com/browse/COST-1131
    },
    exclude: {
      ...(queryFromRoute && queryFromRoute.exclude && queryFromRoute.exclude),
    },
    group_by: {
      ...(groupBy && { [groupBy]: groupByValue }),
    },
  };

  const reportQueryString = getQuery({
    ...newQuery,
    currency,
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
  const providersError = providersSelectors.selectProvidersError(state, ProviderType.all, providersQueryString);
  const providersFetchStatus = providersSelectors.selectProvidersFetchStatus(
    state,
    ProviderType.all,
    providersQueryString
  );

  return {
    costOverviewComponent: <CostOverview currency={currency} groupBy={groupBy} report={report} />,
    currency,
    description: queryFromRoute[breakdownDescKey],
    detailsURL,
    emptyStateTitle: props.intl.formatMessage(messages.ociDetailsTitle),
    groupBy,
    groupByValue,
    historicalDataComponent: <HistoricalData currency={currency} />,
    providers: filterProviders(providers, ProviderType.oci),
    providersError,
    providersFetchStatus,
    providerType: ProviderType.oci,
    query: queryFromRoute,
    report,
    reportError,
    reportFetchStatus,
    reportType,
    reportPathsType,
    reportQueryString,
    tagReportPathsType: TagPathsType.oci,
    title: groupByValue,
  };
});

const mapDispatchToProps: OciCostDispatchProps = {
  fetchReport: reportActions.fetchReport,
};

const OciCost = injectIntl(connect(mapStateToProps, mapDispatchToProps)(BreakdownBase));

export default OciCost;
