import { Skeleton } from '@patternfly/react-core';
import type { Query } from 'api/queries/query';
import { getQuery, logicalAndPrefix, orgUnitIdKey, parseQuery } from 'api/queries/query';
import type { Report, ReportPathsType } from 'api/reports/report';
import { ReportType } from 'api/reports/report';
import messages from 'locales/messages';
import React from 'react';
import type { WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { DatumType, transformReport } from 'routes/views/components/charts/common/chartDatum';
import { HistoricalUsageChart } from 'routes/views/components/charts/historicalUsageChart';
import { getGroupById, getGroupByOrgValue, getGroupByValue } from 'routes/views/utils/groupBy';
import { createMapStateToProps, FetchStatus } from 'store/common';
import { reportActions, reportSelectors } from 'store/reports';
import { formatUnits, unitsLookupKey } from 'utils/format';
import { skeletonWidth } from 'utils/skeleton';

import { chartStyles, styles } from './historicalChart.styles';

interface HistoricalDataUsageChartOwnProps {
  chartName?: string;
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
    const { chartName, currentReport, currentReportFetchStatus, previousReport, previousReportFetchStatus, intl } =
      this.props;

    // Current data
    const currentLimitData = transformReport(currentReport, DatumType.rolling, 'date', 'limit');
    const currentRequestData = transformReport(currentReport, DatumType.rolling, 'date', 'request');
    const currentUsageData = transformReport(currentReport, DatumType.rolling, 'date', 'usage');

    // Previous data
    const previousLimitData = transformReport(previousReport, DatumType.rolling, 'date', 'limit');
    const previousRequestData = transformReport(previousReport, DatumType.rolling, 'date', 'request');
    const previousUsageData = transformReport(previousReport, DatumType.rolling, 'date', 'usage');

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
              name={chartName}
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
    const queryFromRoute = parseQuery<Query>(location.search);
    const groupByOrgValue = getGroupByOrgValue(queryFromRoute);
    const groupBy = getGroupById(queryFromRoute);
    const groupByValue = getGroupByValue(queryFromRoute);

    // instance-types and storage APIs must filter org units
    const useFilter = reportType === ReportType.instanceType || reportType === ReportType.storage;

    const baseQuery: Query = {
      filter_by: {
        // Add filters here to apply logical OR/AND
        ...(queryFromRoute && queryFromRoute.filter_by && queryFromRoute.filter_by),
        ...(queryFromRoute &&
          queryFromRoute.filter &&
          queryFromRoute.filter.account && { [`${logicalAndPrefix}account`]: queryFromRoute.filter.account }),
        ...(queryFromRoute &&
          queryFromRoute.filter &&
          queryFromRoute.filter.category && { category: queryFromRoute.filter.category }),
        ...(groupBy && { [groupBy]: undefined }), // Omit filters associated with the current group_by -- see https://issues.redhat.com/browse/COST-1131
        ...(groupByOrgValue && useFilter && { [orgUnitIdKey]: groupByOrgValue }),
      },
      exclude: {
        ...(queryFromRoute && queryFromRoute.exclude && queryFromRoute.exclude),
      },
      group_by: {
        ...(groupByOrgValue && !useFilter && { [orgUnitIdKey]: groupByOrgValue }),
        ...(groupBy && !groupByOrgValue && { [groupBy]: groupByValue }),
      },
    };

    // Current report
    const currentQuery: Query = {
      ...baseQuery,
      filter: {
        resolution: 'daily',
        time_scope_units: 'month',
        time_scope_value: -1,
      },
    };
    const currentQueryString = getQuery(currentQuery);
    const currentReport = reportSelectors.selectReport(state, reportPathsType, reportType, currentQueryString);
    const currentReportFetchStatus = reportSelectors.selectReportFetchStatus(
      state,
      reportPathsType,
      reportType,
      currentQueryString
    );

    // Previous report
    const previousQuery: Query = {
      ...baseQuery,
      filter: {
        resolution: 'daily',
        time_scope_units: 'month',
        time_scope_value: -2,
      },
    };
    const previousQueryString = getQuery(previousQuery);
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

export { HistoricalDataUsageChart };
