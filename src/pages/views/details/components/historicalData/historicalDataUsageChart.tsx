import { Skeleton } from '@patternfly/react-core';
import { getQuery, logicalAndPrefix, orgUnitIdKey, parseQuery, Query } from 'api/queries/query';
import { Report, ReportPathsType, ReportType } from 'api/reports/report';
import messages from 'locales/messages';
import { ChartType, transformReport } from 'pages/views/components/charts/common/chartDatumUtils';
import { HistoricalUsageChart } from 'pages/views/components/charts/historicalUsageChart';
import { getGroupById, getGroupByOrgValue, getGroupByValue } from 'pages/views/utils/groupBy';
import React from 'react';
import { injectIntl, WrappedComponentProps } from 'react-intl';
import { connect } from 'react-redux';
import { createMapStateToProps, FetchStatus } from 'store/common';
import { reportActions, reportSelectors } from 'store/reports';
import { formatUnits, unitsLookupKey } from 'utils/format';
import { skeletonWidth } from 'utils/skeleton';

import { chartStyles, styles } from './historicalChart.styles';

interface HistoricalDataUsageChartOwnProps {
  reportPathsType: ReportPathsType;
  reportType: ReportType;
}

interface HistoricalDataUsageChartStateProps {
  currentQuery?: Query;
  currentQueryString?: string;
  currentReport?: Report;
  currentReportFetchStatus?: FetchStatus;
  previousQuery?: Query;
  previousQueryString?: string;
  previousReport?: Report;
  previousReportFetchStatus?: FetchStatus;
}

interface HistoricalDataUsageChartDispatchProps {
  fetchReport?: typeof reportActions.fetchReport;
}

type HistoricalDataUsageChartProps = HistoricalDataUsageChartOwnProps &
  HistoricalDataUsageChartStateProps &
  HistoricalDataUsageChartDispatchProps &
  WrappedComponentProps;

class HistoricalDataUsageChartBase extends React.Component<HistoricalDataUsageChartProps> {
  public componentDidMount() {
    const { fetchReport, currentQueryString, previousQueryString, reportPathsType, reportType } = this.props;

    fetchReport(reportPathsType, reportType, currentQueryString);
    fetchReport(reportPathsType, reportType, previousQueryString);
  }

  public componentDidUpdate(prevProps: HistoricalDataUsageChartProps) {
    const { fetchReport, currentQueryString, previousQueryString, reportPathsType, reportType } = this.props;

    if (prevProps.currentQueryString !== currentQueryString) {
      fetchReport(reportPathsType, reportType, currentQueryString);
    }
    if (prevProps.previousQueryString !== previousQueryString) {
      fetchReport(reportPathsType, reportType, previousQueryString);
    }
  }

  private getSkeleton = () => {
    return (
      <>
        <Skeleton style={styles.chartSkeleton} width={skeletonWidth.md} />
        <Skeleton style={styles.legendSkeleton} width={skeletonWidth.xs} />
      </>
    );
  };

  public render() {
    const { currentReport, currentReportFetchStatus, previousReport, previousReportFetchStatus, intl } = this.props;

    // Current data
    const currentLimitData = transformReport(currentReport, ChartType.daily, 'date', 'limit');
    const currentRequestData = transformReport(currentReport, ChartType.daily, 'date', 'request');
    const currentUsageData = transformReport(currentReport, ChartType.daily, 'date', 'usage');

    // Previous data
    const previousLimitData = transformReport(previousReport, ChartType.daily, 'date', 'limit');
    const previousRequestData = transformReport(previousReport, ChartType.daily, 'date', 'request');
    const previousUsageData = transformReport(previousReport, ChartType.daily, 'date', 'usage');

    const usageUnits =
      currentReport && currentReport.meta && currentReport.meta.total && currentReport.meta.total.usage
        ? currentReport.meta.total.usage.units
        : '';

    return (
      <div style={styles.chartContainer}>
        <div style={styles.usageChart}>
          {currentReportFetchStatus === FetchStatus.inProgress &&
          previousReportFetchStatus === FetchStatus.inProgress ? (
            this.getSkeleton()
          ) : (
            <HistoricalUsageChart
              adjustContainerHeight
              containerHeight={chartStyles.chartContainerHeight}
              currentLimitData={currentLimitData}
              currentRequestData={currentRequestData}
              currentUsageData={currentUsageData}
              formatter={formatUnits}
              formatOptions={{}}
              height={chartStyles.chartHeight}
              previousLimitData={previousLimitData}
              previousRequestData={previousRequestData}
              previousUsageData={previousUsageData}
              xAxisLabel={intl.formatMessage(messages.historicalChartDayOfMonthLabel)}
              yAxisLabel={intl.formatMessage(messages.units, { units: unitsLookupKey(usageUnits) })}
            />
          )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = createMapStateToProps<HistoricalDataUsageChartOwnProps, HistoricalDataUsageChartStateProps>(
  (state, { reportPathsType, reportType }) => {
    const query = parseQuery<Query>(location.search);
    const groupByOrgValue = getGroupByOrgValue(query);
    const groupBy = getGroupById(query);
    const groupByValue = getGroupByValue(query);

    // instance-types and storage APIs must filter org units
    const useFilter = reportType === ReportType.instanceType || reportType === ReportType.storage;

    const baseQuery: Query = {
      filter_by: {
        // Add filters here to apply logical OR/AND
        ...(query && query.filter_by && query.filter_by),
        ...(query && query.filter && query.filter.account && { [`${logicalAndPrefix}account`]: query.filter.account }),
        ...(groupBy && { [groupBy]: undefined }), // Omit filters associated with the current group_by -- see https://issues.redhat.com/browse/COST-1131
        ...(groupByOrgValue && useFilter && { [orgUnitIdKey]: groupByOrgValue }),
      },
      group_by: {
        ...(groupByOrgValue && !useFilter && { [orgUnitIdKey]: groupByOrgValue }),
        ...(groupBy && !groupByOrgValue && { [groupBy]: groupByValue }),
      },
    };
    const currentQuery: Query = {
      ...baseQuery,
      filter: {
        resolution: 'daily',
        time_scope_units: 'month',
        time_scope_value: -1,
      },
    };
    const currentQueryString = getQuery(currentQuery);
    const previousQuery: Query = {
      ...baseQuery,
      filter: {
        resolution: 'daily',
        time_scope_units: 'month',
        time_scope_value: -2,
      },
    };
    const previousQueryString = getQuery(previousQuery);

    // Current report
    const currentReport = reportSelectors.selectReport(state, reportPathsType, reportType, currentQueryString);
    const currentReportFetchStatus = reportSelectors.selectReportFetchStatus(
      state,
      reportPathsType,
      reportType,
      currentQueryString
    );

    // Previous report
    const previousReport = reportSelectors.selectReport(state, reportPathsType, reportType, previousQueryString);
    const previousReportFetchStatus = reportSelectors.selectReportFetchStatus(
      state,
      reportPathsType,
      reportType,
      previousQueryString
    );

    return {
      currentQuery,
      currentQueryString,
      currentReport,
      currentReportFetchStatus,
      previousQuery,
      previousQueryString,
      previousReport,
      previousReportFetchStatus,
    };
  }
);

const mapDispatchToProps: HistoricalDataUsageChartDispatchProps = {
  fetchReport: reportActions.fetchReport,
};

const HistoricalDataUsageChart = injectIntl(connect(mapStateToProps, mapDispatchToProps)(HistoricalDataUsageChartBase));

export { HistoricalDataUsageChart, HistoricalDataUsageChartProps };
