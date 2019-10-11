import { css } from '@patternfly/react-styles';
import {
  Skeleton,
  SkeletonSize,
} from '@redhat-cloud-services/frontend-components/components/Skeleton';
import { OcpOnAwsReport, OcpOnAwsReportType } from 'api/ocpOnAwsReports';
import {
  ChartType,
  transformOcpOnAwsReport,
} from 'components/charts/commonChart/chartUtils';
import { HistoricalTrendChart } from 'components/charts/historicalTrendChart';
import { HistoricalUsageChart } from 'components/charts/historicalUsageChart';
import React from 'react';
import { InjectedTranslateProps, translate } from 'react-i18next';
import { connect } from 'react-redux';
import { createMapStateToProps, FetchStatus } from 'store/common';
import * as ocpOnAwsReportsActions from 'store/ocpOnAwsReports/ocpOnAwsReportsActions';
import * as ocpOnAwsReportsSelectors from 'store/ocpOnAwsReports/ocpOnAwsReportsSelectors';
import { formatValue, unitLookupKey } from 'utils/formatValue';
import { chartStyles, styles } from './historicalChart.styles';

interface HistoricalModalOwnProps {
  currentQueryString: string;
  previousQueryString: string;
}

interface HistoricalModalStateProps {
  currentCostReport?: OcpOnAwsReport;
  currentCostReportFetchStatus?: FetchStatus;
  currentCpuReport?: OcpOnAwsReport;
  currentCpuReportFetchStatus?: FetchStatus;
  currentLimitReport?: OcpOnAwsReport;
  currentLimitReportFetchStatus?: FetchStatus;
  currentMemoryReport?: OcpOnAwsReport;
  currentMemoryReportFetchStatus?: FetchStatus;
  previousCostReport?: OcpOnAwsReport;
  previousCostReportFetchStatus?: FetchStatus;
  previousCpuReport?: OcpOnAwsReport;
  previousCpuReportFetchStatus?: FetchStatus;
  previousLimitReport?: OcpOnAwsReport;
  previousLimitReportFetchStatus?: FetchStatus;
  previousMemoryReport?: OcpOnAwsReport;
  previousMemoryReportFetchStatus?: FetchStatus;
}

interface HistoricalModalDispatchProps {
  fetchReport?: typeof ocpOnAwsReportsActions.fetchReport;
}

type HistoricalModalProps = HistoricalModalOwnProps &
  HistoricalModalStateProps &
  HistoricalModalDispatchProps &
  InjectedTranslateProps;

const cpuReportType = OcpOnAwsReportType.cpu;
const costReportType = OcpOnAwsReportType.cost;
const memoryReportType = OcpOnAwsReportType.memory;

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
    const currentCostData = transformOcpOnAwsReport(
      currentCostReport,
      ChartType.rolling,
      'date',
      'infrastructureCost'
    );
    const previousCostData = transformOcpOnAwsReport(
      previousCostReport,
      ChartType.rolling,
      'date',
      'infrastructureCost'
    );

    // Cpu data
    const currentCpuLimitData = transformOcpOnAwsReport(
      currentCpuReport,
      ChartType.daily,
      'date',
      'limit'
    );
    const currentCpuRequestData = transformOcpOnAwsReport(
      currentCpuReport,
      ChartType.daily,
      'date',
      'request'
    );
    const currentCpuUsageData = transformOcpOnAwsReport(
      currentCpuReport,
      ChartType.daily,
      'date',
      'usage'
    );
    const previousCpuLimitData = transformOcpOnAwsReport(
      previousCpuReport,
      ChartType.daily,
      'date',
      'limit'
    );
    const previousCpuRequestData = transformOcpOnAwsReport(
      previousCpuReport,
      ChartType.daily,
      'date',
      'request'
    );
    const previousCpuUsageData = transformOcpOnAwsReport(
      previousCpuReport,
      ChartType.daily,
      'date',
      'usage'
    );

    // Memory data
    const currentMemoryLimitData = transformOcpOnAwsReport(
      currentMemoryReport,
      ChartType.daily,
      'date',
      'limit'
    );
    const currentMemoryRequestData = transformOcpOnAwsReport(
      currentMemoryReport,
      ChartType.daily,
      'date',
      'request'
    );
    const currentMemoryUsageData = transformOcpOnAwsReport(
      currentMemoryReport,
      ChartType.daily,
      'date',
      'usage'
    );
    const previousMemoryLimitData = transformOcpOnAwsReport(
      previousCpuReport,
      ChartType.daily,
      'date',
      'limit'
    );
    const previousMemoryRequestData = transformOcpOnAwsReport(
      previousMemoryReport,
      ChartType.daily,
      'date',
      'request'
    );
    const previousMemoryUsageData = transformOcpOnAwsReport(
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
              title={t('ocp_on_aws_details.historical.cost_title')}
              xAxisLabel={t('ocp_on_aws_details.historical.day_of_month_label')}
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
              title={t('ocp_on_aws_details.historical.cpu_title')}
              xAxisLabel={t('ocp_on_aws_details.historical.day_of_month_label')}
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
              title={t('ocp_on_aws_details.historical.memory_title')}
              xAxisLabel={t('ocp_on_aws_details.historical.day_of_month_label')}
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
  const currentCostReport = ocpOnAwsReportsSelectors.selectReport(
    state,
    costReportType,
    currentQueryString
  );
  const currentCostReportFetchStatus = ocpOnAwsReportsSelectors.selectReportFetchStatus(
    state,
    costReportType,
    currentQueryString
  );
  const currentCpuReport = ocpOnAwsReportsSelectors.selectReport(
    state,
    cpuReportType,
    currentQueryString
  );
  const currentCpuReportFetchStatus = ocpOnAwsReportsSelectors.selectReportFetchStatus(
    state,
    cpuReportType,
    currentQueryString
  );
  const currentMemoryReport = ocpOnAwsReportsSelectors.selectReport(
    state,
    memoryReportType,
    currentQueryString
  );
  const currentMemoryReportFetchStatus = ocpOnAwsReportsSelectors.selectReportFetchStatus(
    state,
    memoryReportType,
    currentQueryString
  );

  // Previous report
  const previousCostReport = ocpOnAwsReportsSelectors.selectReport(
    state,
    costReportType,
    previousQueryString
  );
  const previousCostReportFetchStatus = ocpOnAwsReportsSelectors.selectReportFetchStatus(
    state,
    costReportType,
    previousQueryString
  );
  const previousCpuReport = ocpOnAwsReportsSelectors.selectReport(
    state,
    cpuReportType,
    previousQueryString
  );
  const previousCpuReportFetchStatus = ocpOnAwsReportsSelectors.selectReportFetchStatus(
    state,
    cpuReportType,
    previousQueryString
  );
  const previousMemoryReport = ocpOnAwsReportsSelectors.selectReport(
    state,
    memoryReportType,
    previousQueryString
  );
  const previousMemoryReportFetchStatus = ocpOnAwsReportsSelectors.selectReportFetchStatus(
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
  fetchReport: ocpOnAwsReportsActions.fetchReport,
};

const HistoricalChart = translate()(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(HistoricalModalBase)
);

export { HistoricalChart, HistoricalModalProps };
