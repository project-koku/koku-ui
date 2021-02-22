import { ProviderType } from 'api/providers';
import { getQuery, OcpQuery, parseQuery } from 'api/queries/ocpQuery';
import { getProvidersQuery } from 'api/queries/providersQuery';
import { breakdownDescKey, Query } from 'api/queries/query';
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
import { ocpProvidersQuery, providersSelectors } from 'store/providers';
import { reportActions, reportSelectors } from 'store/reports';

import { CostOverview } from './costOverview';
import { HistoricalData } from './historicalData';

type OcpBreakdownOwnProps = WithTranslation;

interface OcpBreakdownStateProps {
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

const detailsURL = paths.ocpDetails;
const reportType = ReportType.cost;
const reportPathsType = ReportPathsType.ocp;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mapStateToProps = createMapStateToProps<OcpBreakdownOwnProps, OcpBreakdownStateProps>((state, props) => {
  const queryFromRoute = parseQuery<OcpQuery>(location.search);
  const query = queryFromRoute;
  const filterBy = getGroupByValue(query);
  const groupBy = getGroupById(query);

  const newQuery: Query = {
    ...query,
    ...{ [breakdownDescKey]: undefined },
  };
  const queryString = getQuery(newQuery);

  const report = reportSelectors.selectReport(state, reportPathsType, reportType, queryString);
  const reportError = reportSelectors.selectReportError(state, reportPathsType, reportType, queryString);
  const reportFetchStatus = reportSelectors.selectReportFetchStatus(state, reportPathsType, reportType, queryString);

  const providersQueryString = getProvidersQuery(ocpProvidersQuery);
  const providers = providersSelectors.selectProviders(state, ProviderType.ocp, providersQueryString);
  const providersFetchStatus = providersSelectors.selectProvidersFetchStatus(
    state,
    ProviderType.ocp,
    providersQueryString
  );

  return {
    costOverviewComponent: <CostOverview filterBy={filterBy} groupBy={groupBy} report={report} />,
    description: query[breakdownDescKey],
    detailsURL,
    emptyStateTitle: props.t('navigation.ocp_details'),
    filterBy,
    groupBy,
    historicalDataComponent: <HistoricalData filterBy={filterBy} groupBy={groupBy} />,
    providers,
    providersFetchStatus,
    providerType: ProviderType.ocp,
    query,
    queryString,
    report,
    reportError,
    reportFetchStatus,
    reportType,
    reportPathsType,
    tagReportPathsType: TagPathsType.ocp,
    title: filterBy,
  };
});

const mapDispatchToProps: BreakdownDispatchProps = {
  fetchReport: reportActions.fetchReport,
};

const OcpBreakdown = withTranslation()(connect(mapStateToProps, mapDispatchToProps)(BreakdownBase));

export default OcpBreakdown;
