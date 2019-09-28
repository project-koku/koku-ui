import { css } from '@patternfly/react-styles';
import {
  Skeleton,
  SkeletonSize,
} from '@redhat-cloud-services/frontend-components/components/Skeleton';
import { OcpReport, OcpReportType } from 'api/ocpReports';
import {
  ChartType,
  transformOcpReport,
} from 'components/charts/commonChart/chartUtils';
import { HistoricalCostChart } from 'components/charts/historicalCostChart';
import { HistoricalUsageChart } from 'components/charts/historicalUsageChart';
import React from 'react';
import { InjectedTranslateProps, translate } from 'react-i18next';
import { connect } from 'react-redux';
import { createMapStateToProps, FetchStatus } from 'store/common';
import * as ocpReportsActions from 'store/ocpReports/ocpReportsActions';
import * as ocpReportsSelectors from 'store/ocpReports/ocpReportsSelectors';
import { formatValue, unitLookupKey } from 'utils/formatValue';
import { chartStyles, styles } from './historicalChart.styles';

interface HistoricalModalOwnProps {
  currentQueryString: string;
  previousQueryString: string;
}

interface HistoricalModalStateProps {
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

interface HistoricalModalDispatchProps {
  fetchReport?: typeof ocpReportsActions.fetchReport;
}

type HistoricalModalProps = HistoricalModalOwnProps &
  HistoricalModalStateProps &
  HistoricalModalDispatchProps &
  InjectedTranslateProps;

const cpuReportType = OcpReportType.cpu;
const costReportType = OcpReportType.cost;
const memoryReportType = OcpReportType.memory;

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
    const currentCostData = transformOcpReport(
      currentCostReport,
      ChartType.rolling,
      'date',
      'cost'
    );
    const currentInfrastructureCostData = transformOcpReport(
      currentCostReport,
      ChartType.rolling,
      'date',
      'infrastructureCost'
    );
    const previousCostData = transformOcpReport(
      previousCostReport,
      ChartType.rolling,
      'date',
      'cost'
    );
    const previousInfrastructureCostData = transformOcpReport(
      previousCostReport,
      ChartType.rolling,
      'date',
      'infrastructureCost'
    );

    // Cpu data
    const currentCpuLimitData = transformOcpReport(
      currentCpuReport,
      ChartType.daily,
      'date',
      'limit'
    );
    const currentCpuRequestData = transformOcpReport(
      currentCpuReport,
      ChartType.daily,
      'date',
      'request'
    );
    const currentCpuUsageData = transformOcpReport(
      currentCpuReport,
      ChartType.daily,
      'date',
      'usage'
    );
    const previousCpuLimitData = transformOcpReport(
      previousCpuReport,
      ChartType.daily,
      'date',
      'limit'
    );
    const previousCpuRequestData = transformOcpReport(
      previousCpuReport,
      ChartType.daily,
      'date',
      'request'
    );
    const previousCpuUsageData = transformOcpReport(
      previousCpuReport,
      ChartType.daily,
      'date',
      'usage'
    );

    // Memory data
    const currentMemoryLimitData = transformOcpReport(
      currentMemoryReport,
      ChartType.daily,
      'date',
      'limit'
    );
    const currentMemoryRequestData = transformOcpReport(
      currentMemoryReport,
      ChartType.daily,
      'date',
      'request'
    );
    const currentMemoryUsageData = transformOcpReport(
      currentMemoryReport,
      ChartType.daily,
      'date',
      'usage'
    );
    const previousMemoryLimitData = transformOcpReport(
      previousCpuReport,
      ChartType.daily,
      'date',
      'limit'
    );
    const previousMemoryRequestData = transformOcpReport(
      previousMemoryReport,
      ChartType.daily,
      'date',
      'request'
    );
    const previousMemoryUsageData = transformOcpReport(
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
        ? currentCostReport.meta.total.cost.units
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
              title={t('ocp_details.historical.cpu_title')}
              xAxisLabel={t('ocp_details.historical.day_of_month_label')}
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
  HistoricalModalOwnProps,
  HistoricalModalStateProps
>((state, { currentQueryString, previousQueryString }) => {
  // Current report
  const currentCostReport = ocpReportsSelectors.selectReport(
    state,
    costReportType,
    currentQueryString
  );
  const currentCostReportFetchStatus = ocpReportsSelectors.selectReportFetchStatus(
    state,
    costReportType,
    currentQueryString
  );
  const currentCpuReport = ocpReportsSelectors.selectReport(
    state,
    cpuReportType,
    currentQueryString
  );
  const currentCpuReportFetchStatus = ocpReportsSelectors.selectReportFetchStatus(
    state,
    cpuReportType,
    currentQueryString
  );
  const currentMemoryReport = ocpReportsSelectors.selectReport(
    state,
    memoryReportType,
    currentQueryString
  );
  const currentMemoryReportFetchStatus = ocpReportsSelectors.selectReportFetchStatus(
    state,
    memoryReportType,
    currentQueryString
  );

  // Previous report
  const previousCostReport = ocpReportsSelectors.selectReport(
    state,
    costReportType,
    previousQueryString
  );
  const previousCostReportFetchStatus = ocpReportsSelectors.selectReportFetchStatus(
    state,
    costReportType,
    previousQueryString
  );
  const previousCpuReport = ocpReportsSelectors.selectReport(
    state,
    cpuReportType,
    previousQueryString
  );
  const previousCpuReportFetchStatus = ocpReportsSelectors.selectReportFetchStatus(
    state,
    cpuReportType,
    previousQueryString
  );
  const previousMemoryReport = ocpReportsSelectors.selectReport(
    state,
    memoryReportType,
    previousQueryString
  );
  const previousMemoryReportFetchStatus = ocpReportsSelectors.selectReportFetchStatus(
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
  fetchReport: ocpReportsActions.fetchReport,
};

const HistoricalChart = translate()(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(HistoricalModalBase)
);

export { HistoricalChart, HistoricalModalProps };
