import { css } from '@patternfly/react-styles';
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
import { formatValue } from 'utils/formatValue';
import { chartStyles, styles } from './historicalChart.styles';

interface HistoricalModalOwnProps {
  currentQueryString: string;
  groupBy: string;
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

  public render() {
    const {
      currentCostReport,
      currentCpuReport,
      currentMemoryReport,
      groupBy,
      previousCostReport,
      previousCpuReport,
      previousMemoryReport,
      t,
    } = this.props;

    // Cost data
    const currentCostData = transformOcpOnAwsReport(
      currentCostReport,
      ChartType.rolling,
      'date',
      'infrastructure_cost'
    );
    const previousCostData = transformOcpOnAwsReport(
      previousCostReport,
      ChartType.rolling,
      'date',
      'infrastructure_cost'
    );

    // Cpu data
    const currentCpuCapacityData = transformOcpOnAwsReport(
      currentCpuReport,
      ChartType.daily,
      'date',
      'capacity'
    );
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
    const previousCpuCapacityData = transformOcpOnAwsReport(
      previousCpuReport,
      ChartType.daily,
      'date',
      'capacity'
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
    const currentMemoryCapacityData = transformOcpOnAwsReport(
      currentMemoryReport,
      ChartType.daily,
      'date',
      'capacity'
    );
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
    const previousMemoryCapacityData = transformOcpOnAwsReport(
      previousCpuReport,
      ChartType.daily,
      'date',
      'capacity'
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

    return (
      <div className={css(styles.chartContainer)}>
        <div className={css(styles.costChart)}>
          <HistoricalTrendChart
            height={chartStyles.chartHeight}
            currentData={currentCostData}
            formatDatumValue={formatValue}
            formatDatumOptions={{}}
            previousData={previousCostData}
            title={t('ocp_on_aws_details.historical.cost_title', { groupBy })}
            xAxisLabel={t('ocp_on_aws_details.historical.day_of_month_label')}
            yAxisLabel={t('ocp_on_aws_details.historical.cost_label')}
          />
        </div>
        <div className={css(styles.cpuChart)}>
          <HistoricalUsageChart
            currentCapacityData={currentCpuCapacityData}
            currentLimitData={currentCpuLimitData}
            currentRequestData={currentCpuRequestData}
            currentUsageData={currentCpuUsageData}
            formatDatumValue={formatValue}
            formatDatumOptions={{}}
            height={chartStyles.chartHeight}
            previousCapacityData={previousCpuCapacityData}
            previousLimitData={previousCpuLimitData}
            previousRequestData={previousCpuRequestData}
            previousUsageData={previousCpuUsageData}
            title={t('ocp_on_aws_details.historical.cpu_title', { groupBy })}
            xAxisLabel={t('ocp_on_aws_details.historical.day_of_month_label')}
            yAxisLabel={t('ocp_on_aws_details.historical.cpu_label')}
          />
        </div>
        <div className={css(styles.memoryChart)}>
          <HistoricalUsageChart
            currentCapacityData={currentMemoryCapacityData}
            currentLimitData={currentMemoryLimitData}
            currentRequestData={currentMemoryRequestData}
            currentUsageData={currentMemoryUsageData}
            formatDatumValue={formatValue}
            formatDatumOptions={{}}
            height={chartStyles.chartHeight}
            previousCapacityData={previousMemoryCapacityData}
            previousLimitData={previousMemoryLimitData}
            previousRequestData={previousMemoryRequestData}
            previousUsageData={previousMemoryUsageData}
            title={t('ocp_on_aws_details.historical.memory_title', { groupBy })}
            xAxisLabel={t('ocp_on_aws_details.historical.day_of_month_label')}
            yAxisLabel={t('ocp_on_aws_details.historical.memory_label')}
          />
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
