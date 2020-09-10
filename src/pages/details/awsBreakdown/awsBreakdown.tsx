import { AwsQuery, getQuery, parseQuery } from 'api/queries/awsQuery';
import {
  breakdownDescKey,
  breakdownTitleKey,
  orgUnitIdKey,
  Query,
} from 'api/queries/query';
import { Report, ReportPathsType, ReportType } from 'api/reports/report';
import { AxiosError } from 'axios';
import BreakdownBase from 'pages/details/components/breakdown/breakdownBase';
import {
  getGroupById,
  getGroupByValue,
} from 'pages/details/components/utils/groupBy';
import React from 'react';
import { InjectedTranslateProps, translate } from 'react-i18next';
import { connect } from 'react-redux';
import { createMapStateToProps, FetchStatus } from 'store/common';
import { reportActions, reportSelectors } from 'store/reports';

import { CostOverview } from './costOverview';
import { HistoricalData } from './historicalData';

type AwsBreakdownOwnProps = InjectedTranslateProps;

interface AwsBreakdownStateProps {
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

const detailsURL = '/details/aws';
const reportType = ReportType.cost;
const reportPathsType = ReportPathsType.aws;

const mapStateToProps = createMapStateToProps<
  AwsBreakdownOwnProps,
  AwsBreakdownStateProps
>(state => {
  const queryFromRoute = parseQuery<AwsQuery>(location.search);
  const query = queryFromRoute;
  const filterBy = getGroupByValue(query);
  const groupBy = getGroupById(query);
  const groupByOrg =
    query && query.group_by && query.group_by[orgUnitIdKey]
      ? query.group_by[orgUnitIdKey]
      : undefined;
  const newQuery: Query = {
    filter: {
      time_scope_units: 'month',
      time_scope_value: -1,
      resolution: 'monthly',
      limit: 3,
      ...(query &&
        query.filter &&
        query.filter.account && { ['account']: query.filter.account }),
    },
    filter_by: query ? query.filter_by : undefined,
    group_by: {
      ...(groupByOrg && ({ [orgUnitIdKey]: groupByOrg } as any)),
      ...(groupBy && { [groupBy]: filterBy }),
    },
  };

  const queryString = getQuery(newQuery);
  const report = reportSelectors.selectReport(
    state,
    reportPathsType,
    reportType,
    queryString
  );
  const reportError = reportSelectors.selectReportError(
    state,
    reportPathsType,
    reportType,
    queryString
  );
  const reportFetchStatus = reportSelectors.selectReportFetchStatus(
    state,
    reportPathsType,
    reportType,
    queryString
  );

  return {
    costOverviewComponent: (
      <CostOverview
        filterBy={filterBy}
        groupBy={groupBy}
        query={query}
        report={report}
      />
    ),
    description: query[breakdownDescKey],
    detailsURL,
    filterBy,
    groupBy,
    historicalDataComponent: (
      <HistoricalData filterBy={filterBy} groupBy={groupBy} query={query} />
    ),
    query,
    queryString,
    report,
    reportError,
    reportFetchStatus,
    reportType,
    reportPathsType,
    title: query[breakdownTitleKey] ? query[breakdownTitleKey] : filterBy,
  };
});

const mapDispatchToProps: BreakdownDispatchProps = {
  fetchReport: reportActions.fetchReport,
};

const AwsBreakdown = translate()(
  connect(mapStateToProps, mapDispatchToProps)(BreakdownBase)
);

export default AwsBreakdown;
