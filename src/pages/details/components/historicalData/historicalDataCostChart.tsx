import {
  Skeleton,
  SkeletonSize,
} from '@redhat-cloud-services/frontend-components/components/Skeleton';
import { getQuery, Query } from 'api/queries/query';
import { Report, ReportPathsType, ReportType } from 'api/reports/report';
import {
  ChartType,
  transformReport,
} from 'components/charts/common/chartUtils';
import { HistoricalCostChart } from 'components/charts/historicalCostChart';
import React from 'react';
import { InjectedTranslateProps, translate } from 'react-i18next';
import { connect } from 'react-redux';
import { createMapStateToProps, FetchStatus } from 'store/common';
import { reportActions, reportSelectors } from 'store/reports';
import { formatValue, unitLookupKey } from 'utils/formatValue';
import { chartStyles, styles } from './historicalChart.styles';

interface HistoricalDataCostChartOwnProps {
  filterBy: string | number;
  groupBy: string;
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
  InjectedTranslateProps;

class HistoricalDataCostChartBase extends React.Component<
  HistoricalDataCostChartProps
> {
  public componentDidMount() {
    const {
      fetchReport,
      currentQueryString,
      previousQueryString,
      reportPathsType,
      reportType,
    } = this.props;

    fetchReport(reportPathsType, reportType, currentQueryString);
    fetchReport(reportPathsType, reportType, previousQueryString);
  }

  public componentDidUpdate(prevProps: HistoricalDataCostChartProps) {
    const {
      fetchReport,
      currentQueryString,
      previousQueryString,
      reportPathsType,
      reportType,
    } = this.props;

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
        <Skeleton style={styles.chartSkeleton} size={SkeletonSize.md} />
        <Skeleton style={styles.legendSkeleton} size={SkeletonSize.xs} />
      </>
    );
  };

  public render() {
    const {
      currentReport,
      currentReportFetchStatus,
      previousReport,
      previousReportFetchStatus,
      reportType,
      t,
    } = this.props;

    // Current data
    const currentData = transformReport(
      currentReport,
      ChartType.rolling,
      'date',
      'cost'
    );
    const currentInfrastructureCostData = transformReport(
      currentReport,
      ChartType.rolling,
      'date',
      'infrastructure'
    );

    // Previous data
    const previousData = transformReport(
      previousReport,
      ChartType.rolling,
      'date',
      'cost'
    );
    const previousInfrastructureCostData = transformReport(
      previousReport,
      ChartType.rolling,
      'date',
      'infrastructure'
    );

    const costUnits =
      currentReport &&
      currentReport.meta &&
      currentReport.meta.total &&
      currentReport.meta.total.cost
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
              xAxisLabel={t(`breakdown.historical.day_of_month_label`)}
              yAxisLabel={t(`breakdown.historical.${reportType}_label`, {
                units: t(`units.${unitLookupKey(costUnits)}`),
              })}
            />
          )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = createMapStateToProps<
  HistoricalDataCostChartOwnProps,
  HistoricalDataCostChartStateProps
>((state, { filterBy, groupBy, reportPathsType, reportType }) => {
  const currentQuery: Query = {
    filter: {
      time_scope_units: 'month',
      time_scope_value: -1,
      resolution: 'daily',
      limit: 3,
    },
    group_by: {
      [groupBy]: filterBy,
    },
  };
  const currentQueryString = getQuery(currentQuery);
  const previousQuery: Query = {
    filter: {
      time_scope_units: 'month',
      time_scope_value: -2,
      resolution: 'daily',
      limit: 3,
    },
    group_by: {
      [groupBy]: filterBy,
    },
  };
  const previousQueryString = getQuery(previousQuery);

  // Current report
  const currentReport = reportSelectors.selectReport(
    state,
    reportPathsType,
    reportType,
    currentQueryString
  );
  const currentReportFetchStatus = reportSelectors.selectReportFetchStatus(
    state,
    reportPathsType,
    reportType,
    currentQueryString
  );

  // Previous report
  const previousReport = reportSelectors.selectReport(
    state,
    reportPathsType,
    reportType,
    previousQueryString
  );
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
});

const mapDispatchToProps: HistoricalDataCostChartDispatchProps = {
  fetchReport: reportActions.fetchReport,
};

const HistoricalDataCostChart = translate()(
  connect(mapStateToProps, mapDispatchToProps)(HistoricalDataCostChartBase)
);

export { HistoricalDataCostChart, HistoricalDataCostChartProps };
