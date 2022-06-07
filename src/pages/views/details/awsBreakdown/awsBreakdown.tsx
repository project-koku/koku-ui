import { Providers, ProviderType } from 'api/providers';
import { AwsQuery, getQuery, parseQuery } from 'api/queries/awsQuery';
import { getProvidersQuery } from 'api/queries/providersQuery';
import { breakdownDescKey, breakdownTitleKey, logicalAndPrefix, orgUnitIdKey, Query } from 'api/queries/query';
import { Report, ReportPathsType, ReportType } from 'api/reports/report';
import { TagPathsType } from 'api/tags/tag';
import { AxiosError } from 'axios';
import messages from 'locales/messages';
import BreakdownBase from 'pages/views/details/components/breakdown';
import { getGroupById, getGroupByOrgValue, getGroupByValue } from 'pages/views/utils/groupBy';
import { filterProviders } from 'pages/views/utils/providers';
import React from 'react';
import { injectIntl, WrappedComponentProps } from 'react-intl';
import { connect } from 'react-redux';
import { paths } from 'routes';
import { createMapStateToProps, FetchStatus } from 'store/common';
import { providersQuery, providersSelectors } from 'store/providers';
import { reportActions, reportSelectors } from 'store/reports';
import { getCostType } from 'utils/costType';

import { CostOverview } from './costOverview';
import { HistoricalData } from './historicalData';

type AwsBreakdownOwnProps = WrappedComponentProps;

interface AwsBreakdownStateProps {
  CostOverview?: React.ReactNode;
  detailsURL: string;
  HistoricalData?: React.ReactNode;
  providers: Providers;
  providersError: AxiosError;
  providersFetchStatus: FetchStatus;
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
  const query = parseQuery<AwsQuery>(location.search);
  const groupByOrgValue = getGroupByOrgValue(query);
  const groupBy = groupByOrgValue ? orgUnitIdKey : getGroupById(query);
  const groupByValue = groupByOrgValue ? groupByOrgValue : getGroupByValue(query);
  const costType = getCostType();

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
      ...(query && query.filter && query.filter.account && { [`${logicalAndPrefix}account`]: query.filter.account }),
    },
    group_by: {
      ...(groupBy && { [groupBy]: groupByValue }),
    },
    cost_type: costType,
  };
  const queryString = getQuery(newQuery);

  const report = reportSelectors.selectReport(state, reportPathsType, reportType, queryString);
  const reportError = reportSelectors.selectReportError(state, reportPathsType, reportType, queryString);
  const reportFetchStatus = reportSelectors.selectReportFetchStatus(state, reportPathsType, reportType, queryString);

  const providersQueryString = getProvidersQuery(providersQuery);
  const providers = providersSelectors.selectProviders(state, ProviderType.all, providersQueryString);
  const providersError = providersSelectors.selectProvidersError(state, ProviderType.all, providersQueryString);
  const providersFetchStatus = providersSelectors.selectProvidersFetchStatus(
    state,
    ProviderType.all,
    providersQueryString
  );

  return {
    costOverviewComponent: <CostOverview costType={costType} groupBy={groupBy} query={query} report={report} />,
    costType,
    description: query[breakdownDescKey],
    detailsURL,
    emptyStateTitle: props.intl.formatMessage(messages.AWSDetailsTitle),
    groupBy,
    groupByValue,
    historicalDataComponent: <HistoricalData costType={costType} />,
    providers: filterProviders(providers, ProviderType.aws),
    providersError,
    providersFetchStatus,
    providerType: ProviderType.aws,
    query,
    queryString,
    report,
    reportError,
    reportFetchStatus,
    reportType,
    reportPathsType,
    showCostType: true,
    tagReportPathsType: TagPathsType.aws,
    title: query[breakdownTitleKey] ? query[breakdownTitleKey] : groupByValue,
  };
});

const mapDispatchToProps: BreakdownDispatchProps = {
  fetchReport: reportActions.fetchReport,
};

const AwsBreakdown = injectIntl(connect(mapStateToProps, mapDispatchToProps)(BreakdownBase));

export default AwsBreakdown;
