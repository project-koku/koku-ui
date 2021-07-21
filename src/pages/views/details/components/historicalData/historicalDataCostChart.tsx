import { Skeleton } from '@patternfly/react-core';
import { getQuery, parseQuery, Query } from 'api/queries/query';
import { Report, ReportPathsType, ReportType } from 'api/reports/report';
import { ChartType, transformReport } from 'components/charts/common/chartDatumUtils';
import { HistoricalCostChart } from 'components/charts/historicalCostChart';
import { getGroupById, getGroupByValue } from 'pages/views/utils/groupBy';
import React from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { createMapStateToProps, FetchStatus } from 'store/common';
import { reportActions, reportSelectors } from 'store/reports';
import { formatValue, unitLookupKey } from 'utils/formatValue';
import { skeletonWidth } from 'utils/skeleton';

import { chartStyles, styles } from './historicalChart.styles';

interface HistoricalDataCostChartOwnProps {
  reportPathsType: ReportPathsType;
  reportType: ReportType;
}

interface HistoricalDataCostChartStateProps {
  currentQuery?: Query;
  currentQueryString?: string;
  currentReport?: Report;
  currentReportFetchStatus?: FetchStatus;
  previousQuery?: Query;
  previousQueryString?: string;
  previousReport?: Report;
  previousReportFetchStatus?: FetchStatus;
}

interface HistoricalDataCostChartDispatchProps {
  fetchReport?: typeof reportActions.fetchReport;
}

type HistoricalDataCostChartProps = HistoricalDataCostChartOwnProps &
  HistoricalDataCostChartStateProps &
  HistoricalDataCostChartDispatchProps &
  WithTranslation;

class HistoricalDataCostChartBase extends React.Component<HistoricalDataCostChartProps> {
  public componentDidMount() {
    const { fetchReport, currentQueryString, previousQueryString, reportPathsType, reportType } = this.props;

    fetchReport(reportPathsType, reportType, currentQueryString);
    fetchReport(reportPathsType, reportType, previousQueryString);
  }

  public componentDidUpdate(prevProps: HistoricalDataCostChartProps) {
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
    const { currentReport, currentReportFetchStatus, previousReport, previousReportFetchStatus, reportType, t } =
      this.props;

    // Current data
    const currentData = transformReport(currentReport, ChartType.rolling, 'date', 'cost');
    const currentInfrastructureCostData = transformReport(currentReport, ChartType.rolling, 'date', 'infrastructure');

    // Previous data
    const previousData = transformReport(previousReport, ChartType.rolling, 'date', 'cost');
    const previousInfrastructureCostData = transformReport(previousReport, ChartType.rolling, 'date', 'infrastructure');

    const costUnits =
      currentReport && currentReport.meta && currentReport.meta.total && currentReport.meta.total.cost
        ? currentReport.meta.total.cost.total.units
        : 'USD';

    return (
      <div style={styles.chartContainer}>
        <div style={styles.costChart}>
          {currentReportFetchStatus === FetchStatus.inProgress &&
          previousReportFetchStatus === FetchStatus.inProgress ? (
            this.getSkeleton()
          ) : (
            <HistoricalCostChart
              adjustContainerHeight
              containerHeight={chartStyles.chartContainerHeight - 25}
              currentCostData={currentData}
              currentInfrastructureCostData={currentInfrastructureCostData}
              formatDatumValue={formatValue}
              formatDatumOptions={{}}
              height={chartStyles.chartHeight}
              previousCostData={previousData}
              previousInfrastructureCostData={previousInfrastructureCostData}
              xAxisLabel={t(`breakdown.historical_chart.day_of_month_label`)}
              yAxisLabel={t(`breakdown.historical_chart.${reportType}_label`, {
                units: t(`units.${unitLookupKey(costUnits)}`),
              })}
            />
          )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = createMapStateToProps<HistoricalDataCostChartOwnProps, HistoricalDataCostChartStateProps>(
  (state, { reportPathsType, reportType }) => {
    const query = parseQuery<Query>(location.search);
    const groupBy = getGroupById(query);
    const groupByValue = getGroupByValue(query);

    const baseQuery: Query = {
      filter_by: {
        // Add filters here to apply logical OR/AND
        ...(query && query.filter_by && query.filter_by),
        ...(groupBy && { [groupBy]: undefined }), // Omit filters associated with the current group_by -- see https://issues.redhat.com/browse/COST-1131
      },
      group_by: {
        ...(groupBy && { [groupBy]: groupByValue }),
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

const mapDispatchToProps: HistoricalDataCostChartDispatchProps = {
  fetchReport: reportActions.fetchReport,
};

const HistoricalDataCostChart = withTranslation()(
  connect(mapStateToProps, mapDispatchToProps)(HistoricalDataCostChartBase)
);

export { HistoricalDataCostChart, HistoricalDataCostChartProps };
