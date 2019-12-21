import { css } from '@patternfly/react-styles';
import {
  Skeleton,
  SkeletonSize,
} from '@redhat-cloud-services/frontend-components/components/Skeleton';
import { OcpCloudReport, OcpCloudReportType } from 'api/ocpCloudReports';
import {
  ChartType,
  transformOcpCloudReport,
} from 'components/charts/commonChart/chartUtils';
import { HistoricalTrendChart } from 'components/charts/historicalTrendChart';
import { HistoricalUsageChart } from 'components/charts/historicalUsageChart';
import React from 'react';
import { InjectedTranslateProps, translate } from 'react-i18next';
import { connect } from 'react-redux';
import { createMapStateToProps, FetchStatus } from 'store/common';
import * as ocpCloudReportsActions from 'store/ocpCloudReports/ocpCloudReportsActions';
import * as ocpCloudReportsSelectors from 'store/ocpCloudReports/ocpCloudReportsSelectors';
import { formatValue, unitLookupKey } from 'utils/formatValue';
import { chartStyles, styles } from './historicalChart.styles';

interface HistoricalModalOwnProps {
  currentQueryString: string;
  previousQueryString: string;
}

interface HistoricalModalStateProps {
  currentCostReport?: OcpCloudReport;
  currentCostReportFetchStatus?: FetchStatus;
  currentCpuReport?: OcpCloudReport;
  currentCpuReportFetchStatus?: FetchStatus;
  currentLimitReport?: OcpCloudReport;
  currentLimitReportFetchStatus?: FetchStatus;
  currentMemoryReport?: OcpCloudReport;
  currentMemoryReportFetchStatus?: FetchStatus;
  previousCostReport?: OcpCloudReport;
  previousCostReportFetchStatus?: FetchStatus;
  previousCpuReport?: OcpCloudReport;
  previousCpuReportFetchStatus?: FetchStatus;
  previousLimitReport?: OcpCloudReport;
  previousLimitReportFetchStatus?: FetchStatus;
  previousMemoryReport?: OcpCloudReport;
  previousMemoryReportFetchStatus?: FetchStatus;
}

interface HistoricalModalDispatchProps {
  fetchReport?: typeof ocpCloudReportsActions.fetchReport;
}

type HistoricalModalProps = HistoricalModalOwnProps &
  HistoricalModalStateProps &
  HistoricalModalDispatchProps &
  InjectedTranslateProps;

const cpuReportType = OcpCloudReportType.cpu;
const costReportType = OcpCloudReportType.cost;
const memoryReportType = OcpCloudReportType.memory;

class HistoricalModalBase extends React.Component<HistoricalModalProps> {
  public componentDidMount() {
    const { fetchReport, currentQueryString, previousQueryString } = this.props;

    fetchReport(costReportType, currentQueryString);
    fetchReport(cpuReportType, currentQueryString);
    fetchReport(memoryReportType, currentQueryString);
    fetchReport(costReportType, previousQueryString);
    fetchReport(cpuReportType, previousQueryString);
    fetchReport(memoryReportType, previousQueryString);
  }

  public componentDidUpdate(prevProps: HistoricalModalProps) {
    const { fetchReport, currentQueryString, previousQueryString } = this.props;

    if (prevProps.currentQueryString !== currentQueryString) {
      fetchReport(costReportType, currentQueryString);
      fetchReport(cpuReportType, currentQueryString);
      fetchReport(memoryReportType, currentQueryString);
    }
    if (prevProps.previousQueryString !== previousQueryString) {
      fetchReport(costReportType, previousQueryString);
      fetchReport(cpuReportType, previousQueryString);
      fetchReport(memoryReportType, previousQueryString);
    }
  }

  private getSkeleton = () => {
    return (
      <>
        <Skeleton
          className={css(styles.chartSkeleton)}
          size={SkeletonSize.md}
        />
        <Skeleton
          className={css(styles.legendSkeleton)}
          size={SkeletonSize.xs}
        />
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
    const currentCostData = transformOcpCloudReport(
      currentCostReport,
      ChartType.rolling,
      'date',
      'infrastructureCost'
    );
    const previousCostData = transformOcpCloudReport(
      previousCostReport,
      ChartType.rolling,
      'date',
      'infrastructureCost'
    );

    // Cpu data
    const currentCpuLimitData = transformOcpCloudReport(
      currentCpuReport,
      ChartType.daily,
      'date',
      'limit'
    );
    const currentCpuRequestData = transformOcpCloudReport(
      currentCpuReport,
      ChartType.daily,
      'date',
      'request'
    );
    const currentCpuUsageData = transformOcpCloudReport(
      currentCpuReport,
      ChartType.daily,
      'date',
      'usage'
    );
    const previousCpuLimitData = transformOcpCloudReport(
      previousCpuReport,
      ChartType.daily,
      'date',
      'limit'
    );
    const previousCpuRequestData = transformOcpCloudReport(
      previousCpuReport,
      ChartType.daily,
      'date',
      'request'
    );
    const previousCpuUsageData = transformOcpCloudReport(
      previousCpuReport,
      ChartType.daily,
      'date',
      'usage'
    );

    // Memory data
    const currentMemoryLimitData = transformOcpCloudReport(
      currentMemoryReport,
      ChartType.daily,
      'date',
      'limit'
    );
    const currentMemoryRequestData = transformOcpCloudReport(
      currentMemoryReport,
      ChartType.daily,
      'date',
      'request'
    );
    const currentMemoryUsageData = transformOcpCloudReport(
      currentMemoryReport,
      ChartType.daily,
      'date',
      'usage'
    );
    const previousMemoryLimitData = transformOcpCloudReport(
      previousCpuReport,
      ChartType.daily,
      'date',
      'limit'
    );
    const previousMemoryRequestData = transformOcpCloudReport(
      previousMemoryReport,
      ChartType.daily,
      'date',
      'request'
    );
    const previousMemoryUsageData = transformOcpCloudReport(
      previousMemoryReport,
      ChartType.daily,
      'date',
      'usage'
    );

    const costUnits =
      currentCostReport &&
      currentCostReport.meta &&
      currentCostReport.meta.total &&
      currentCostReport.meta.total.infrastructure_cost
        ? currentCostReport.meta.total.infrastructure_cost.units
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
      <div className={css(styles.chartContainer)}>
        <div className={css(styles.costChart)}>
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
              title={t('ocp_on_cloud_details.historical.cost_title')}
              xAxisLabel={t(
                'ocp_on_cloud_details.historical.day_of_month_label'
              )}
              yAxisLabel={t('ocp_details.historical.cost_label', {
                units: t(`units.${unitLookupKey(costUnits)}`),
              })}
            />
          )}
        </div>
        <div className={css(styles.cpuChart)}>
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
              title={t('ocp_on_cloud_details.historical.cpu_title')}
              xAxisLabel={t(
                'ocp_on_cloud_details.historical.day_of_month_label'
              )}
              yAxisLabel={t('ocp_details.historical.cpu_label', {
                units: t(`units.${unitLookupKey(cpuUnits)}`),
              })}
            />
          )}
        </div>
        <div className={css(styles.memoryChart)}>
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
              title={t('ocp_on_cloud_details.historical.memory_title')}
              xAxisLabel={t(
                'ocp_on_cloud_details.historical.day_of_month_label'
              )}
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
  HistoricalModalOwnProps,
  HistoricalModalStateProps
>((state, { currentQueryString, previousQueryString }) => {
  // Current report
  const currentCostReport = ocpCloudReportsSelectors.selectReport(
    state,
    costReportType,
    currentQueryString
  );
  const currentCostReportFetchStatus = ocpCloudReportsSelectors.selectReportFetchStatus(
    state,
    costReportType,
    currentQueryString
  );
  const currentCpuReport = ocpCloudReportsSelectors.selectReport(
    state,
    cpuReportType,
    currentQueryString
  );
  const currentCpuReportFetchStatus = ocpCloudReportsSelectors.selectReportFetchStatus(
    state,
    cpuReportType,
    currentQueryString
  );
  const currentMemoryReport = ocpCloudReportsSelectors.selectReport(
    state,
    memoryReportType,
    currentQueryString
  );
  const currentMemoryReportFetchStatus = ocpCloudReportsSelectors.selectReportFetchStatus(
    state,
    memoryReportType,
    currentQueryString
  );

  // Previous report
  const previousCostReport = ocpCloudReportsSelectors.selectReport(
    state,
    costReportType,
    previousQueryString
  );
  const previousCostReportFetchStatus = ocpCloudReportsSelectors.selectReportFetchStatus(
    state,
    costReportType,
    previousQueryString
  );
  const previousCpuReport = ocpCloudReportsSelectors.selectReport(
    state,
    cpuReportType,
    previousQueryString
  );
  const previousCpuReportFetchStatus = ocpCloudReportsSelectors.selectReportFetchStatus(
    state,
    cpuReportType,
    previousQueryString
  );
  const previousMemoryReport = ocpCloudReportsSelectors.selectReport(
    state,
    memoryReportType,
    previousQueryString
  );
  const previousMemoryReportFetchStatus = ocpCloudReportsSelectors.selectReportFetchStatus(
    state,
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

const mapDispatchToProps: HistoricalModalDispatchProps = {
  fetchReport: ocpCloudReportsActions.fetchReport,
};

const HistoricalChart = translate()(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(HistoricalModalBase)
);

export { HistoricalChart, HistoricalModalProps };
