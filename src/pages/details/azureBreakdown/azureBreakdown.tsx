import { getQuery, OcpQuery, parseQuery } from 'api/queries/ocpQuery';
import { Query } from 'api/queries/query';
import { Report, ReportPathsType, ReportType } from 'api/reports/report';
import { TagPathsType } from 'api/tags/tag';
import { AxiosError } from 'axios';
import BreakdownBase from 'pages/details/components/breakdown/breakdownBase';
import { getGroupById, getGroupByValue } from 'pages/details/components/utils/groupBy';
import React from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { paths } from 'routes';
import { createMapStateToProps, FetchStatus } from 'store/common';
import { reportActions, reportSelectors } from 'store/reports';

import { CostOverview } from './costOverview';
import { HistoricalData } from './historicalData';

type AzureCostOwnProps = WithTranslation;

interface AzureCostStateProps {
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

interface AzureCostDispatchProps {
  fetchReport?: typeof reportActions.fetchReport;
}

const detailsURL = paths.azureDetails;
const reportType = ReportType.cost;
const reportPathsType = ReportPathsType.azure;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mapStateToProps = createMapStateToProps<AzureCostOwnProps, AzureCostStateProps>((state, props) => {
  const queryFromRoute = parseQuery<OcpQuery>(location.search);
  const query = queryFromRoute;
  const queryString = getQuery(query);
  const report = reportSelectors.selectReport(state, reportPathsType, reportType, queryString);
  const reportError = reportSelectors.selectReportError(state, reportPathsType, reportType, queryString);
  const reportFetchStatus = reportSelectors.selectReportFetchStatus(state, reportPathsType, reportType, queryString);
  const filterBy = getGroupByValue(query);
  const groupBy = getGroupById(query);

  return {
    costOverviewComponent: <CostOverview filterBy={filterBy} groupBy={groupBy} report={report} />,
    detailsURL,
    filterBy,
    groupBy,
    historicalDataComponent: <HistoricalData filterBy={filterBy} groupBy={groupBy} />,
    query,
    queryString,
    report,
    reportError,
    reportFetchStatus,
    reportType,
    reportPathsType,
    tagReportPathsType: TagPathsType.azure,
    title: filterBy,
  };
});

const mapDispatchToProps: AzureCostDispatchProps = {
  fetchReport: reportActions.fetchReport,
};

const AzureCost = withTranslation()(connect(mapStateToProps, mapDispatchToProps)(BreakdownBase));

export default AzureCost;
