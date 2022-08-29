import {
  Skeleton,
  SkeletonSize,
} from '@redhat-cloud-services/frontend-components/components/Skeleton';
import { OcpReport } from 'api/reports/ocpReports';
import { ReportPathsType, ReportType } from 'api/reports/report';
import {
  ChartType,
  transformReport,
} from 'components/charts/common/chartUtils';
import { HistoricalCostChart } from 'components/charts/historicalCostChart';
import { HistoricalUsageChart } from 'components/charts/historicalUsageChart';
import {
  chartStyles,
  styles,
} from 'routes/details/components/historicalData/historicalChart.styles';
import React from 'react';
import { InjectedTranslateProps, translate } from 'react-i18next';
import { connect } from 'react-redux';
import { createMapStateToProps, FetchStatus } from 'store/common';
import { reportActions, reportSelectors } from 'store/reports';
import { formatValue, unitLookupKey } from 'utils/formatValue';

interface HistoricalChartOwnProps {
  currentQueryString?: string;
  previousQueryString?: string;
}

interface HistoricalChartStateProps {
  currentCostReport?: OcpReport;
  currentCostReportFetchStatus?: FetchStatus;
  currentCpuReport?: OcpReport;
  currentCpuReportFetchStatus?: FetchStatus;
  currentLimitReport?: OcpReport;
  currentLimitReportFetchStatus?: FetchStatus;
  currentMemoryReport?: OcpReport;
  currentMemoryReportFetchStatus?: FetchStatus;
  previousCostReport?: OcpReport;
  previousCostReportFetchStatus?: FetchStatus;
  previousCpuReport?: OcpReport;
  previousCpuReportFetchStatus?: FetchStatus;
  previousLimitReport?: OcpReport;
  previousLimitReportFetchStatus?: FetchStatus;
  previousMemoryReport?: OcpReport;
  previousMemoryReportFetchStatus?: FetchStatus;
}

interface HistoricalChartDispatchProps {
  fetchReport?: typeof reportActions.fetchReport;
}

type HistoricalChartProps = HistoricalChartOwnProps &
  HistoricalChartStateProps &
  HistoricalChartDispatchProps &
  InjectedTranslateProps;

const cpuReportType = ReportType.cpu;
const costReportType = ReportType.cost;
const memoryReportType = ReportType.memory;
const reportPathsType = ReportPathsType.ocp;

class HistoricalChartBase extends React.Component<HistoricalChartProps> {
  public componentDidMount() {
    const { fetchReport, currentQueryString, previousQueryString } = this.props;

    fetchReport(reportPathsType, costReportType, currentQueryString);
    fetchReport(reportPathsType, cpuReportType, currentQueryString);
    fetchReport(reportPathsType, memoryReportType, currentQueryString);
    fetchReport(reportPathsType, costReportType, previousQueryString);
    fetchReport(reportPathsType, cpuReportType, previousQueryString);
    fetchReport(reportPathsType, memoryReportType, previousQueryString);
  }

  public componentDidUpdate(prevProps: HistoricalChartProps) {
    const { fetchReport, currentQueryString, previousQueryString } = this.props;

    if (prevProps.currentQueryString !== currentQueryString) {
      fetchReport(reportPathsType, costReportType, currentQueryString);
      fetchReport(reportPathsType, cpuReportType, currentQueryString);
      fetchReport(reportPathsType, memoryReportType, currentQueryString);
    }
    if (prevProps.previousQueryString !== previousQueryString) {
      fetchReport(reportPathsType, costReportType, previousQueryString);
      fetchReport(reportPathsType, cpuReportType, previousQueryString);
      fetchReport(reportPathsType, memoryReportType, previousQueryString);
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
      currentCpuReport,
      currentCpuReportFetchStatus,
      currentMemoryReport,
      currentMemoryReportFetchStatus,
      previousCostReport,
      previousCostReportFetchStatus,
      previousCpuReport,
      previousCpuReportFetchStatus,
      previousMemoryReport,
      previousMemoryReportFetchStatus,
      t,
    } = this.props;

    // Cost data
    const currentCostData = transformReport(
      currentCostReport,
      ChartType.rolling,
      'date',
      'cost'
    );
    const currentInfrastructureCostData = transformReport(
      currentCostReport,
      ChartType.rolling,
      'date',
      'infrastructure'
    );
    const previousCostData = transformReport(
      previousCostReport,
      ChartType.rolling,
      'date',
      'cost'
    );
    const previousInfrastructureCostData = transformReport(
      previousCostReport,
      ChartType.rolling,
      'date',
      'infrastructure'
    );

    // Cpu data
    const currentCpuLimitData = transformReport(
      currentCpuReport,
      ChartType.daily,
      'date',
      'limit'
    );
    const currentCpuRequestData = transformReport(
      currentCpuReport,
      ChartType.daily,
      'date',
      'request'
    );
    const currentCpuUsageData = transformReport(
      currentCpuReport,
      ChartType.daily,
      'date',
      'usage'
    );
    const previousCpuLimitData = transformReport(
      previousCpuReport,
      ChartType.daily,
      'date',
      'limit'
    );
    const previousCpuRequestData = transformReport(
      previousCpuReport,
      ChartType.daily,
      'date',
      'request'
    );
    const previousCpuUsageData = transformReport(
      previousCpuReport,
      ChartType.daily,
      'date',
      'usage'
    );

    // Memory data
    const currentMemoryLimitData = transformReport(
      currentMemoryReport,
      ChartType.daily,
      'date',
      'limit'
    );
    const currentMemoryRequestData = transformReport(
      currentMemoryReport,
      ChartType.daily,
      'date',
      'request'
    );
    const currentMemoryUsageData = transformReport(
      currentMemoryReport,
      ChartType.daily,
      'date',
      'usage'
    );
    const previousMemoryLimitData = transformReport(
      previousCpuReport,
      ChartType.daily,
      'date',
      'limit'
    );
    const previousMemoryRequestData = transformReport(
      previousMemoryReport,
      ChartType.daily,
      'date',
      'request'
    );
    const previousMemoryUsageData = transformReport(
      previousMemoryReport,
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
    const cpuUnits =
      currentCpuReport &&
      currentCpuReport.meta &&
      currentCpuReport.meta.total &&
      currentCpuReport.meta.total.usage
        ? currentCpuReport.meta.total.usage.units
        : '';
    const memoryUnits =
      currentMemoryReport &&
      currentMemoryReport.meta &&
      currentMemoryReport.meta.total &&
      currentMemoryReport.meta.total.usage
        ? currentMemoryReport.meta.total.usage.units
        : '';

    return (
      <div style={styles.chartContainer}>
        <div style={styles.costChart}>
          {currentCostReportFetchStatus === FetchStatus.inProgress &&
          previousCostReportFetchStatus === FetchStatus.inProgress ? (
            this.getSkeleton()
          ) : (
            <HistoricalCostChart
              containerHeight={chartStyles.chartContainerHeight}
              currentCostData={currentCostData}
              currentInfrastructureCostData={currentInfrastructureCostData}
              formatDatumValue={formatValue}
              formatDatumOptions={{}}
              height={chartStyles.chartHeight}
              previousCostData={previousCostData}
              previousInfrastructureCostData={previousInfrastructureCostData}
              title={t('ocp_details.historical.cost_title')}
              xAxisLabel={t('ocp_details.historical.day_of_month_label')}
              yAxisLabel={t('ocp_details.historical.cost_label', {
                units: t(`units.${unitLookupKey(costUnits)}`),
              })}
            />
          )}
        </div>
        <div style={styles.cpuChart}>
          {currentCpuReportFetchStatus === FetchStatus.inProgress &&
          previousCpuReportFetchStatus === FetchStatus.inProgress ? (
            this.getSkeleton()
          ) : (
            <HistoricalUsageChart
              containerHeight={chartStyles.chartContainerHeight}
              currentLimitData={currentCpuLimitData}
              currentRequestData={currentCpuRequestData}
              currentUsageData={currentCpuUsageData}
              formatDatumValue={formatValue}
              formatDatumOptions={{}}
              height={chartStyles.chartHeight}
              previousLimitData={previousCpuLimitData}
              previousRequestData={previousCpuRequestData}
              previousUsageData={previousCpuUsageData}
              title={t('ocp_details.historical.cpu_title')}
              xAxisLabel={t('ocp_details.historical.day_of_month_label')}
              yAxisLabel={t('ocp_details.historical.cpu_label', {
                units: t(`units.${unitLookupKey(cpuUnits)}`),
              })}
            />
          )}
        </div>
        <div style={styles.memoryChart}>
          {currentMemoryReportFetchStatus === FetchStatus.inProgress &&
          previousMemoryReportFetchStatus === FetchStatus.inProgress ? (
            this.getSkeleton()
          ) : (
            <HistoricalUsageChart
              containerHeight={chartStyles.chartContainerHeight}
              currentLimitData={currentMemoryLimitData}
              currentRequestData={currentMemoryRequestData}
              currentUsageData={currentMemoryUsageData}
              formatDatumValue={formatValue}
              formatDatumOptions={{}}
              height={chartStyles.chartHeight}
              previousLimitData={previousMemoryLimitData}
              previousRequestData={previousMemoryRequestData}
              previousUsageData={previousMemoryUsageData}
              title={t('ocp_details.historical.memory_title')}
              xAxisLabel={t('ocp_details.historical.day_of_month_label')}
              yAxisLabel={t('ocp_details.historical.memory_label', {
                units: t(`units.${unitLookupKey(memoryUnits)}`),
              })}
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
>((state, { currentQueryString, previousQueryString }) => {
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
  const currentCpuReport = reportSelectors.selectReport(
    state,
    reportPathsType,
    cpuReportType,
    currentQueryString
  );
  const currentCpuReportFetchStatus = reportSelectors.selectReportFetchStatus(
    state,
    reportPathsType,
    cpuReportType,
    currentQueryString
  );
  const currentMemoryReport = reportSelectors.selectReport(
    state,
    reportPathsType,
    memoryReportType,
    currentQueryString
  );
  const currentMemoryReportFetchStatus = reportSelectors.selectReportFetchStatus(
    state,
    reportPathsType,
    memoryReportType,
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
  const previousCpuReport = reportSelectors.selectReport(
    state,
    reportPathsType,
    cpuReportType,
    previousQueryString
  );
  const previousCpuReportFetchStatus = reportSelectors.selectReportFetchStatus(
    state,
    reportPathsType,
    cpuReportType,
    previousQueryString
  );
  const previousMemoryReport = reportSelectors.selectReport(
    state,
    reportPathsType,
    memoryReportType,
    previousQueryString
  );
  const previousMemoryReportFetchStatus = reportSelectors.selectReportFetchStatus(
    state,
    reportPathsType,
    memoryReportType,
    previousQueryString
  );
  return {
    currentCostReport,
    currentCostReportFetchStatus,
    currentCpuReport,
    currentCpuReportFetchStatus,
    currentMemoryReport,
    currentMemoryReportFetchStatus,
    previousCostReport,
    previousCostReportFetchStatus,
    previousCpuReport,
    previousCpuReportFetchStatus,
    previousMemoryReport,
    previousMemoryReportFetchStatus,
  };
});

const mapDispatchToProps: HistoricalChartDispatchProps = {
  fetchReport: reportActions.fetchReport,
};

const HistoricalChart = translate()(
  connect(mapStateToProps, mapDispatchToProps)(HistoricalChartBase)
);

export { HistoricalChart, HistoricalChartProps };
