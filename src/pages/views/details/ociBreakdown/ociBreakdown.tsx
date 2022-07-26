import { Providers, ProviderType } from 'api/providers';
import { getQuery, OcpQuery, parseQuery } from 'api/queries/ocpQuery';
import { getProvidersQuery } from 'api/queries/providersQuery';
import { breakdownDescKey, Query } from 'api/queries/query';
import { Report, ReportPathsType, ReportType } from 'api/reports/report';
import { TagPathsType } from 'api/tags/tag';
import { AxiosError } from 'axios';
import messages from 'locales/messages';
import BreakdownBase from 'pages/views/details/components/breakdown';
import { getGroupById, getGroupByValue } from 'pages/views/utils/groupBy';
import { filterProviders } from 'pages/views/utils/providers';
import React from 'react';
import { injectIntl, WrappedComponentProps } from 'react-intl';
import { connect } from 'react-redux';
import { paths } from 'routes';
import { createMapStateToProps, FetchStatus } from 'store/common';
import { providersQuery, providersSelectors } from 'store/providers';
import { reportActions, reportSelectors } from 'store/reports';

import { CostOverview } from './costOverview';
import { HistoricalData } from './historicalData';

type OciCostOwnProps = WrappedComponentProps;

interface OciCostStateProps {
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

interface OciCostDispatchProps {
  fetchReport?: typeof reportActions.fetchReport;
}

const detailsURL = paths.ociDetails;
const reportType = ReportType.cost;
const reportPathsType = ReportPathsType.oci;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mapStateToProps = createMapStateToProps<OciCostOwnProps, OciCostStateProps>((state, props) => {
  const query = parseQuery<OcpQuery>(location.search);
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

  const providersQueryString = getProvidersQuery(providersQuery);
  const providers = providersSelectors.selectProviders(state, ProviderType.all, providersQueryString);
  const providersError = providersSelectors.selectProvidersError(state, ProviderType.all, providersQueryString);
  const providersFetchStatus = providersSelectors.selectProvidersFetchStatus(
    state,
    ProviderType.all,
    providersQueryString
  );

  return {
    costOverviewComponent: <CostOverview groupBy={groupBy} report={report} />,
    description: query[breakdownDescKey],
    detailsURL,
    emptyStateTitle: props.intl.formatMessage(messages.ociDetailsTitle),
    groupBy,
    groupByValue,
    historicalDataComponent: <HistoricalData />,
    providers: filterProviders(providers, ProviderType.oci),
    providersError,
    providersFetchStatus,
    providerType: ProviderType.oci,
    query,
    queryString,
    report,
    reportError,
    reportFetchStatus,
    reportType,
    reportPathsType,
    tagReportPathsType: TagPathsType.oci,
    title: groupByValue,
  };
});

const mapDispatchToProps: OciCostDispatchProps = {
  fetchReport: reportActions.fetchReport,
};

const OciCost = injectIntl(connect(mapStateToProps, mapDispatchToProps)(BreakdownBase));

export default OciCost;
