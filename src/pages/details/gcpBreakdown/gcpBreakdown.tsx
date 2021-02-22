import { ProviderType } from 'api/providers';
import { GcpQuery, getQuery, parseQuery } from 'api/queries/gcpQuery';
import { getProvidersQuery } from 'api/queries/providersQuery';
import { breakdownDescKey, breakdownTitleKey, Query } from 'api/queries/query';
import { Report, ReportPathsType, ReportType } from 'api/reports/report';
import { TagPathsType } from 'api/tags/tag';
import { AxiosError } from 'axios';
import BreakdownBase from 'pages/details/components/breakdown/breakdownBase';
import { getGroupById, getGroupByValue } from 'pages/utils/groupBy';
import React from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { paths } from 'routes';
import { createMapStateToProps, FetchStatus } from 'store/common';
import { gcpProvidersQuery, providersSelectors } from 'store/providers';
import { reportActions, reportSelectors } from 'store/reports';

import { CostOverview } from './costOverview';
import { HistoricalData } from './historicalData';

type GcpBreakdownOwnProps = WithTranslation;

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
  const queryFromRoute = parseQuery<GcpQuery>(location.search);
  const query = queryFromRoute;
  const filterBy = getGroupByValue(query);
  const groupBy = getGroupById(query);

  const newQuery: Query = {
    filter: {
      time_scope_units: 'month',
      time_scope_value: -1,
      resolution: 'monthly',
      limit: 3,
      ...(query && query.filter && query.filter.account && { ['account']: query.filter.account }),
    },
    filter_by: query ? query.filter_by : undefined,
    group_by: {
      ...(groupBy && { [groupBy]: filterBy }),
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
    costOverviewComponent: <CostOverview filterBy={filterBy} groupBy={groupBy} query={query} report={report} />,
    description: query[breakdownDescKey],
    detailsURL,
    emptyStateTitle: props.t('navigation.gcp_details'),
    filterBy,
    groupBy,
    historicalDataComponent: <HistoricalData filterBy={filterBy} groupBy={groupBy} query={query} />,
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
    title: query[breakdownTitleKey] ? query[breakdownTitleKey] : filterBy,
  };
});

const mapDispatchToProps: BreakdownDispatchProps = {
  fetchReport: reportActions.fetchReport,
};

const GcpBreakdown = withTranslation()(connect(mapStateToProps, mapDispatchToProps)(BreakdownBase));

export default GcpBreakdown;
