import { ProviderType } from 'api/providers';
import { getQuery, IbmQuery, parseQuery } from 'api/queries/ibmQuery';
import { getProvidersQuery } from 'api/queries/providersQuery';
import { breakdownDescKey, breakdownTitleKey, Query } from 'api/queries/query';
import { Report, ReportPathsType, ReportType } from 'api/reports/report';
import { TagPathsType } from 'api/tags/tag';
import { AxiosError } from 'axios';
import BreakdownBase from 'pages/views/details/components/breakdown/breakdownBase';
import { getGroupById, getGroupByValue } from 'pages/views/utils/groupBy';
import React from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { paths } from 'routes';
import { createMapStateToProps, FetchStatus } from 'store/common';
import { ibmProvidersQuery, providersSelectors } from 'store/providers';
import { reportActions, reportSelectors } from 'store/reports';

import { CostOverview } from './costOverview';
import { HistoricalData } from './historicalData';

type IbmBreakdownOwnProps = WithTranslation;

interface IbmBreakdownStateProps {
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

const detailsURL = paths.ibmDetails;
const reportType = ReportType.cost;
const reportPathsType = ReportPathsType.ibm;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mapStateToProps = createMapStateToProps<IbmBreakdownOwnProps, IbmBreakdownStateProps>((state, props) => {
  const queryFromRoute = parseQuery<IbmQuery>(location.search);
  const query = queryFromRoute;
  const groupBy = getGroupById(query);
  const groupByValue = getGroupByValue(query);

  const newQuery: Query = {
    filter: {
      resolution: 'monthly',
      time_scope_units: 'month',
      time_scope_value: -1,
      ...(query && query.filter && query.filter.account && { ['account']: query.filter.account }),
    },
    ...(query && query.filter_by && { filter_by: query.filter_by }),
    group_by: {
      ...(groupBy && { [groupBy]: groupByValue }),
    },
  };
  const queryString = getQuery(newQuery);

  const report = reportSelectors.selectReport(state, reportPathsType, reportType, queryString);
  const reportError = reportSelectors.selectReportError(state, reportPathsType, reportType, queryString);
  const reportFetchStatus = reportSelectors.selectReportFetchStatus(state, reportPathsType, reportType, queryString);

  const providersQueryString = getProvidersQuery(ibmProvidersQuery);
  const providers = providersSelectors.selectProviders(state, ProviderType.ibm, providersQueryString);
  const providersFetchStatus = providersSelectors.selectProvidersFetchStatus(
    state,
    ProviderType.ibm,
    providersQueryString
  );

  return {
    costOverviewComponent: <CostOverview groupBy={groupBy} groupByValue={groupByValue} query={query} report={report} />,
    description: query[breakdownDescKey],
    detailsURL,
    emptyStateTitle: props.t('navigation.ibm_details'),
    groupBy,
    groupByValue,
    historicalDataComponent: <HistoricalData />,
    providers,
    providersFetchStatus,
    providerType: ProviderType.ibm,
    query,
    queryString,
    report,
    reportError,
    reportFetchStatus,
    reportType,
    reportPathsType,
    tagReportPathsType: TagPathsType.ibm,
    title: query[breakdownTitleKey] ? query[breakdownTitleKey] : groupByValue,
  };
});

const mapDispatchToProps: BreakdownDispatchProps = {
  fetchReport: reportActions.fetchReport,
};

const IbmBreakdown = withTranslation()(connect(mapStateToProps, mapDispatchToProps)(BreakdownBase));

export default IbmBreakdown;
