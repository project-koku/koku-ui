import {
  Skeleton,
  SkeletonSize,
} from '@redhat-cloud-services/frontend-components/components/Skeleton';
import { Report } from 'api/reports/report';
import { ReportPathsType, ReportType } from 'api/reports/report';
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

interface HistoricalChartOwnProps {
  currentQueryString?: string;
  previousQueryString?: string;
  reportPathsType?: ReportPathsType;
}

interface HistoricalChartStateProps {
  currentCostReport?: Report;
  currentCostReportFetchStatus?: FetchStatus;
  currentInstanceReport?: Report;
  currentInstanceReportFetchStatus?: FetchStatus;
  currentStorageReport?: Report;
  currentStorageReportFetchStatus?: FetchStatus;
  previousCostReport?: Report;
  previousCostReportFetchStatus?: FetchStatus;
  previousInstanceReport?: Report;
  previousInstanceReportFetchStatus?: FetchStatus;
  previousStorageReport?: Report;
  previousStorageReportFetchStatus?: FetchStatus;
}

interface HistoricalChartDispatchProps {
  fetchReport?: typeof reportActions.fetchReport;
}

type HistoricalChartProps = HistoricalChartOwnProps &
  HistoricalChartStateProps &
  HistoricalChartDispatchProps &
  InjectedTranslateProps;

const costReportType = ReportType.cost;
const instanceReportType = ReportType.instanceType;
const storageReportType = ReportType.storage;

class HistoricalChartBase extends React.Component<HistoricalChartProps> {
  public componentDidMount() {
    const {
      fetchReport,
      currentQueryString,
      previousQueryString,
      reportPathsType,
    } = this.props;

    fetchReport(reportPathsType, costReportType, currentQueryString);
    fetchReport(reportPathsType, instanceReportType, currentQueryString);
    fetchReport(reportPathsType, storageReportType, currentQueryString);
    fetchReport(reportPathsType, costReportType, previousQueryString);
    fetchReport(reportPathsType, instanceReportType, previousQueryString);
    fetchReport(reportPathsType, storageReportType, previousQueryString);
  }

  public componentDidUpdate(prevProps: HistoricalChartProps) {
    const {
      fetchReport,
      currentQueryString,
      previousQueryString,
      reportPathsType,
    } = this.props;
    if (prevProps.currentQueryString !== currentQueryString) {
      fetchReport(reportPathsType, costReportType, currentQueryString);
      fetchReport(reportPathsType, instanceReportType, currentQueryString);
      fetchReport(reportPathsType, storageReportType, currentQueryString);
    }
    if (prevProps.previousQueryString !== previousQueryString) {
      fetchReport(reportPathsType, costReportType, previousQueryString);
      fetchReport(reportPathsType, instanceReportType, previousQueryString);
      this.props.fetchReport(
        reportPathsType,
        storageReportType,
        previousQueryString
      );
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
      currentCostReport,
      currentCostReportFetchStatus,
      currentInstanceReport,
      currentInstanceReportFetchStatus,
      currentStorageReport,
      currentStorageReportFetchStatus,
      previousCostReport,
      previousCostReportFetchStatus,
      previousInstanceReport,
      previousInstanceReportFetchStatus,
      previousStorageReport,
      previousStorageReportFetchStatus,
      t,
    } = this.props;

    // Cost data
    const currentCostData = transformReport(
      currentCostReport,
      ChartType.rolling,
      'date',
      'cost'
    );
    const previousCostData = transformReport(
      previousCostReport,
      ChartType.rolling,
      'date',
      'cost'
    );

    // Instance data
    const currentInstanceData = transformReport(
      currentInstanceReport,
      ChartType.daily,
      'date',
      'usage'
    );
    const previousInstanceData = transformReport(
      previousInstanceReport,
      ChartType.daily,
      'date',
      'usage'
    );

    // Storage data
    const currentStorageData = transformReport(
      currentStorageReport,
      ChartType.daily,
      'date',
      'usage'
    );
    const previousStorageData = transformReport(
      previousStorageReport,
      ChartType.daily,
      'date',
      'usage'
    );

    const costUnits =
      currentCostReport &&
      currentCostReport.meta &&
      currentCostReport.meta.total &&
      currentCostReport.meta.total.cost
        ? currentCostReport.meta.total.cost.total.units
        : 'USD';

    let instanceUnits =
      currentInstanceReport &&
      currentInstanceReport.meta &&
      currentInstanceReport.meta.total &&
      currentInstanceReport.meta.total.usage
        ? currentInstanceReport.meta.total.usage.units
        : undefined;

    let storageUnits =
      currentStorageReport &&
      currentStorageReport.meta &&
      currentStorageReport.meta.total &&
      currentStorageReport.meta.total.usage
        ? currentStorageReport.meta.total.usage.units
        : undefined;

    let instanceYAxisLabel;
    if (
      instanceUnits &&
      Number.isNaN(Number(currentInstanceReport.meta.total.usage.units))
    ) {
      instanceYAxisLabel = t(`details.historical.units_label`, {
        units: t(`units.${unitLookupKey(instanceUnits)}`),
      });
    } else {
      instanceUnits = t(`breakdown.historical.instance_type_label`);
      instanceYAxisLabel = t(`breakdown.historical.units_label`, {
        units: t(`units.${unitLookupKey(instanceUnits)}`),
      });
    }

    let storageYAxisLabel;
    if (
      storageUnits &&
      Number.isNaN(Number(currentStorageReport.meta.total.usage.units))
    ) {
      storageYAxisLabel = t(`details.historical.units_label`, {
        units: t(`units.${unitLookupKey(storageUnits)}`),
      });
    } else {
      storageUnits = t(`breakdown.historical.storage_label`);
      storageYAxisLabel = t(`breakdown.historical.units_label`, {
        units: t(`units.${unitLookupKey(storageUnits)}`),
      });
    }

    return (
      <div style={styles.chartContainer}>
        <div style={styles.costChart}>
          {currentCostReportFetchStatus === FetchStatus.inProgress &&
          previousCostReportFetchStatus === FetchStatus.inProgress ? (
            this.getSkeleton()
          ) : (
            <HistoricalTrendChart
              containerHeight={chartStyles.chartContainerHeight}
              currentData={currentCostData}
              formatDatumValue={formatValue}
              formatDatumOptions={{}}
              height={chartStyles.chartHeight}
              previousData={previousCostData}
              title={t('details.historical.cost_title')}
              xAxisLabel={t('details.historical.day_of_month_label')}
              yAxisLabel={t('details.historical.cost_label', {
                units: t(`units.${unitLookupKey(costUnits)}`),
              })}
            />
          )}
        </div>
        <div style={styles.instanceChart}>
          {currentInstanceReportFetchStatus === FetchStatus.inProgress &&
          previousInstanceReportFetchStatus === FetchStatus.inProgress ? (
            this.getSkeleton()
          ) : (
            <HistoricalTrendChart
              containerHeight={chartStyles.chartContainerHeight}
              currentData={currentInstanceData}
              formatDatumValue={formatValue}
              formatDatumOptions={{}}
              height={chartStyles.chartHeight}
              previousData={previousInstanceData}
              title={t('details.historical.instance_title')}
              showUsageLegendLabel
              units={instanceUnits}
              xAxisLabel={t('details.historical.day_of_month_label')}
              yAxisLabel={instanceYAxisLabel}
            />
          )}
        </div>
        <div style={styles.storageChart}>
          {currentStorageReportFetchStatus === FetchStatus.inProgress &&
          previousStorageReportFetchStatus === FetchStatus.inProgress ? (
            this.getSkeleton()
          ) : (
            <HistoricalTrendChart
              containerHeight={chartStyles.chartContainerHeight}
              currentData={currentStorageData}
              formatDatumValue={formatValue}
              formatDatumOptions={{}}
              height={chartStyles.chartHeight}
              previousData={previousStorageData}
              title={t('details.historical.storage_title')}
              showUsageLegendLabel
              units={storageUnits}
              xAxisLabel={t('details.historical.day_of_month_label')}
              yAxisLabel={storageYAxisLabel}
            />
          )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = createMapStateToProps<
  HistoricalChartOwnProps,
  HistoricalChartStateProps
>((state, { currentQueryString, previousQueryString, reportPathsType }) => {
  // Current report
  const currentCostReport = reportSelectors.selectReport(
    state,
    reportPathsType,
    costReportType,
    currentQueryString
  );
  const currentCostReportFetchStatus = reportSelectors.selectReportFetchStatus(
    state,
    reportPathsType,
    costReportType,
    currentQueryString
  );
  const currentInstanceReport = reportSelectors.selectReport(
    state,
    reportPathsType,
    instanceReportType,
    currentQueryString
  );
  const currentInstanceReportFetchStatus = reportSelectors.selectReportFetchStatus(
    state,
    reportPathsType,
    instanceReportType,
    currentQueryString
  );
  const currentStorageReport = reportSelectors.selectReport(
    state,
    reportPathsType,
    storageReportType,
    currentQueryString
  );
  const currentStorageReportFetchStatus = reportSelectors.selectReportFetchStatus(
    state,
    reportPathsType,
    storageReportType,
    currentQueryString
  );

  // Previous report
  const previousCostReport = reportSelectors.selectReport(
    state,
    reportPathsType,
    costReportType,
    previousQueryString
  );
  const previousCostReportFetchStatus = reportSelectors.selectReportFetchStatus(
    state,
    reportPathsType,
    costReportType,
    previousQueryString
  );
  const previousInstanceReport = reportSelectors.selectReport(
    state,
    reportPathsType,
    instanceReportType,
    previousQueryString
  );
  const previousInstanceReportFetchStatus = reportSelectors.selectReportFetchStatus(
    state,
    reportPathsType,
    instanceReportType,
    previousQueryString
  );
  const previousStorageReport = reportSelectors.selectReport(
    state,
    reportPathsType,
    storageReportType,
    previousQueryString
  );
  const previousStorageReportFetchStatus = reportSelectors.selectReportFetchStatus(
    state,
    reportPathsType,
    storageReportType,
    previousQueryString
  );
  return {
    currentCostReport,
    currentCostReportFetchStatus,
    currentInstanceReport,
    currentInstanceReportFetchStatus,
    currentStorageReport,
    currentStorageReportFetchStatus,
    previousCostReport,
    previousCostReportFetchStatus,
    previousInstanceReport,
    previousInstanceReportFetchStatus,
    previousStorageReport,
    previousStorageReportFetchStatus,
  };
});

const mapDispatchToProps: HistoricalChartDispatchProps = {
  fetchReport: reportActions.fetchReport,
};

const HistoricalChart = translate()(
  connect(mapStateToProps, mapDispatchToProps)(HistoricalChartBase)
);

export { HistoricalChart, HistoricalChartProps };
