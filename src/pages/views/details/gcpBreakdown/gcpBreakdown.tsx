import { ProviderType } from 'api/providers';
import { GcpQuery, getQuery, parseQuery } from 'api/queries/gcpQuery';
import { getProvidersQuery } from 'api/queries/providersQuery';
import { breakdownDescKey, breakdownTitleKey, Query } from 'api/queries/query';
import { Report, ReportPathsType, ReportType } from 'api/reports/report';
import { TagPathsType } from 'api/tags/tag';
import { AxiosError } from 'axios';
import messages from 'locales/messages';
import BreakdownBase from 'pages/views/details/components/breakdown/breakdownBase';
import { getGroupById, getGroupByValue } from 'pages/views/utils/groupBy';
import React from 'react';
import { injectIntl, WrappedComponentProps } from 'react-intl';
import { connect } from 'react-redux';
import { paths } from 'routes';
import { createMapStateToProps, FetchStatus } from 'store/common';
import { gcpProvidersQuery, providersSelectors } from 'store/providers';
import { reportActions, reportSelectors } from 'store/reports';

import { CostOverview } from './costOverview';
import { HistoricalData } from './historicalData';

type GcpBreakdownOwnProps = WrappedComponentProps;

interface GcpBreakdownStateProps {
  CostOverview?: React.ReactNode;
  detailsURL: string;
  HistoricalData?: React.ReactNode;
  query: Query;
  queryString: string;
  report: Report;
  reportError: AxiosError;
  reportFetchStatus: FetchStatus;
  reportType: ReportType;
  reportPathsType: ReportPathsType;
}

interface BreakdownDispatchProps {
  fetchReport?: typeof reportActions.fetchReport;
}

const detailsURL = paths.gcpDetails;
const reportType = ReportType.cost;
const reportPathsType = ReportPathsType.gcp;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mapStateToProps = createMapStateToProps<GcpBreakdownOwnProps, GcpBreakdownStateProps>((state, props) => {
  const query = parseQuery<GcpQuery>(location.search);
  const groupBy = getGroupById(query);
  const groupByValue = getGroupByValue(query);

  const newQuery: Query = {
    filter: {
      resolution: 'monthly',
      time_scope_units: 'month',
      time_scope_value: -1,
    },
    filter_by: {
      // Add filters here to apply logical OR/AND
      ...(query && query.filter_by && query.filter_by),
      ...(groupBy && { [groupBy]: undefined }), // Omit filters associated with the current group_by -- see https://issues.redhat.com/browse/COST-1131
    },
    group_by: {
      ...(groupBy && { [groupBy]: groupByValue }),
    },
  };
  const queryString = getQuery(newQuery);

  const report = reportSelectors.selectReport(state, reportPathsType, reportType, queryString);
  const reportError = reportSelectors.selectReportError(state, reportPathsType, reportType, queryString);
  const reportFetchStatus = reportSelectors.selectReportFetchStatus(state, reportPathsType, reportType, queryString);

  const providersQueryString = getProvidersQuery(gcpProvidersQuery);
  const providers = providersSelectors.selectProviders(state, ProviderType.gcp, providersQueryString);
  const providersFetchStatus = providersSelectors.selectProvidersFetchStatus(
    state,
    ProviderType.gcp,
    providersQueryString
  );

  return {
    costOverviewComponent: <CostOverview groupBy={groupBy} query={query} report={report} />,
    description: query[breakdownDescKey],
    detailsURL,
    emptyStateTitle: props.intl.formatMessage(messages.GCPDetailsTitle),
    groupBy,
    groupByValue,
    historicalDataComponent: <HistoricalData />,
    providers,
    providersFetchStatus,
    providerType: ProviderType.gcp,
    query,
    queryString,
    report,
    reportError,
    reportFetchStatus,
    reportType,
    reportPathsType,
    tagReportPathsType: TagPathsType.gcp,
    title: query[breakdownTitleKey] ? query[breakdownTitleKey] : groupByValue,
  };
});

const mapDispatchToProps: BreakdownDispatchProps = {
  fetchReport: reportActions.fetchReport,
};

const GcpBreakdown = injectIntl(connect(mapStateToProps, mapDispatchToProps)(BreakdownBase));

export default GcpBreakdown;
