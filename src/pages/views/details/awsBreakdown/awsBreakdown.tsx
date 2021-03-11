import { ProviderType } from 'api/providers';
import { AwsQuery, getQuery, parseQuery } from 'api/queries/awsQuery';
import { getProvidersQuery } from 'api/queries/providersQuery';
import { breakdownDescKey, breakdownTitleKey, logicalAndPrefix, orgUnitIdKey, Query } from 'api/queries/query';
import { Report, ReportPathsType, ReportType } from 'api/reports/report';
import { TagPathsType } from 'api/tags/tag';
import { AxiosError } from 'axios';
import BreakdownBase from 'pages/views/details/components/breakdown/breakdownBase';
import { getGroupById, getGroupByOrgValue, getGroupByValue } from 'pages/views/utils/groupBy';
import React from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { paths } from 'routes';
import { createMapStateToProps, FetchStatus } from 'store/common';
import { awsProvidersQuery, providersSelectors } from 'store/providers';
import { reportActions, reportSelectors } from 'store/reports';

import { CostOverview } from './costOverview';
import { HistoricalData } from './historicalData';

type AwsBreakdownOwnProps = WithTranslation;

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

const detailsURL = paths.awsDetails;
const reportType = ReportType.cost;
const reportPathsType = ReportPathsType.aws;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mapStateToProps = createMapStateToProps<AwsBreakdownOwnProps, AwsBreakdownStateProps>((state, props) => {
  const queryFromRoute = parseQuery<AwsQuery>(location.search);
  const query = queryFromRoute;
  const groupByOrgValue = getGroupByOrgValue(query);
  const groupBy = groupByOrgValue ? orgUnitIdKey : getGroupById(query);
  const groupByValue = groupByOrgValue ? groupByOrgValue : getGroupByValue(query);

  const newQuery: Query = {
    filter: {
      resolution: 'monthly',
      time_scope_units: 'month',
      time_scope_value: -1,
    },
    filter_by: {
      // Add filters here to apply logical OR/AND
      ...(query && query.filter && query.filter.account && { [`${logicalAndPrefix}account`]: query.filter.account }),
      ...(query && query.filter_by && query.filter_by),
    },
    group_by: {
      ...(groupBy && { [groupBy]: groupByValue }),
    },
  };
  const queryString = getQuery(newQuery);

  const report = reportSelectors.selectReport(state, reportPathsType, reportType, queryString);
  const reportError = reportSelectors.selectReportError(state, reportPathsType, reportType, queryString);
  const reportFetchStatus = reportSelectors.selectReportFetchStatus(state, reportPathsType, reportType, queryString);

  const providersQueryString = getProvidersQuery(awsProvidersQuery);
  const providers = providersSelectors.selectProviders(state, ProviderType.aws, providersQueryString);
  const providersFetchStatus = providersSelectors.selectProvidersFetchStatus(
    state,
    ProviderType.aws,
    providersQueryString
  );

  return {
    costOverviewComponent: <CostOverview groupBy={groupBy} query={query} report={report} />,
    description: query[breakdownDescKey],
    detailsURL,
    emptyStateTitle: props.t('navigation.aws_details'),
    groupBy,
    groupByValue,
    historicalDataComponent: <HistoricalData />,
    providers,
    providersFetchStatus,
    providerType: ProviderType.aws,
    query,
    queryString,
    report,
    reportError,
    reportFetchStatus,
    reportType,
    reportPathsType,
    tagReportPathsType: TagPathsType.aws,
    title: query[breakdownTitleKey] ? query[breakdownTitleKey] : groupByValue,
  };
});

const mapDispatchToProps: BreakdownDispatchProps = {
  fetchReport: reportActions.fetchReport,
};

const AwsBreakdown = withTranslation()(connect(mapStateToProps, mapDispatchToProps)(BreakdownBase));

export default AwsBreakdown;
