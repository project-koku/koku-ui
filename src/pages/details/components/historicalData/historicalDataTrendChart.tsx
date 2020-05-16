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
import { HistoricalTrendChart } from 'components/charts/historicalTrendChart';
import React from 'react';
import { InjectedTranslateProps, translate } from 'react-i18next';
import { connect } from 'react-redux';
import { createMapStateToProps, FetchStatus } from 'store/common';
import { reportActions, reportSelectors } from 'store/reports';
import { formatValue, unitLookupKey } from 'utils/formatValue';
import { chartStyles, styles } from './historicalChart.styles';

interface HistoricalDataTrendChartOwnProps {
  filterBy: string | number;
  groupBy: string;
  reportPathsType: ReportPathsType;
  reportType: ReportType;
}

interface HistoricalDataTrendChartStateProps {
  currentQuery?: Query;
  currentQueryString?: string;
  currentReport?: Report;
  currentReportFetchStatus?: FetchStatus;
  previousQuery?: Query;
  previousQueryString?: string;
  previousReport?: Report;
  previousReportFetchStatus?: FetchStatus;
}

interface HistoricalDataTrendChartDispatchProps {
  fetchReport?: typeof reportActions.fetchReport;
}

type HistoricalDataTrendChartProps = HistoricalDataTrendChartOwnProps &
  HistoricalDataTrendChartStateProps &
  HistoricalDataTrendChartDispatchProps &
  InjectedTranslateProps;

class HistoricalDataTrendChartBase extends React.Component<
  HistoricalDataTrendChartProps
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

  public componentDidUpdate(prevProps: HistoricalDataTrendChartProps) {
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

    const isCostChart = reportType === ReportType.cost;

    // Current data
    const currentData = transformReport(
      currentReport,
      isCostChart ? ChartType.rolling : ChartType.daily,
      'date',
      isCostChart ? 'cost' : 'usage'
    );
    const previousData = transformReport(
      previousReport,
      isCostChart ? ChartType.rolling : ChartType.daily,
      'date',
      isCostChart ? 'cost' : 'usage'
    );

    const costUnits =
      currentReport &&
      currentReport.meta &&
      currentReport.meta.total &&
      currentReport.meta.total.cost
        ? currentReport.meta.total.cost.total.units
        : 'USD';

    let usageUnits =
      currentReport &&
      currentReport.meta &&
      currentReport.meta.total &&
      currentReport.meta.total.usage
        ? currentReport.meta.total.usage.units
        : undefined;

    let yAxisLabel;
    if (isCostChart) {
      yAxisLabel = t(`breakdown.historical.${reportType}_label`, {
        units: t(`units.${unitLookupKey(costUnits)}`),
      });
    } else if (
      usageUnits &&
      Number.isNaN(Number(currentReport.meta.total.usage.units))
    ) {
      yAxisLabel = t(`breakdown.historical.units_label`, {
        units: t(`units.${unitLookupKey(usageUnits)}`),
      });
    } else {
      usageUnits = t(`breakdown.historical.${reportType}_label`);
      yAxisLabel = t(`breakdown.historical.units_label`, {
        units: t(`units.${unitLookupKey(usageUnits)}`),
      });
    }

    return (
      <div style={styles.chartContainer}>
        <div style={styles.costChart}>
          {currentReportFetchStatus === FetchStatus.inProgress &&
          previousReportFetchStatus === FetchStatus.inProgress ? (
            this.getSkeleton()
          ) : (
            <HistoricalTrendChart
              containerHeight={chartStyles.chartContainerHeight - 50}
              currentData={currentData}
              formatDatumValue={formatValue}
              formatDatumOptions={{}}
              height={chartStyles.chartHeight}
              previousData={previousData}
              units={isCostChart ? costUnits : usageUnits}
              xAxisLabel={t(`breakdown.historical.day_of_month_label`)}
              yAxisLabel={yAxisLabel}
            />
          )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = createMapStateToProps<
  HistoricalDataTrendChartOwnProps,
  HistoricalDataTrendChartStateProps
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

const mapDispatchToProps: HistoricalDataTrendChartDispatchProps = {
  fetchReport: reportActions.fetchReport,
};

const HistoricalDataTrendChart = translate()(
  connect(mapStateToProps, mapDispatchToProps)(HistoricalDataTrendChartBase)
);

export { HistoricalDataTrendChart, HistoricalDataTrendChartProps };
