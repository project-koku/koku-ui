import { css } from '@patternfly/react-styles';
import { OcpReport, OcpReportType } from 'api/ocpReports';
import {
  ChartType,
  transformOcpReport,
} from 'components/charts/commonChart/chartUtils';
import { HistoricalTrendChart } from 'components/charts/historicalTrendChart';
import { HistoricalUsageChart } from 'components/charts/historicalUsageChart';
import React from 'react';
import { InjectedTranslateProps, translate } from 'react-i18next';
import { connect } from 'react-redux';
import { createMapStateToProps, FetchStatus } from 'store/common';
import * as ocpReportsActions from 'store/ocpReports/ocpReportsActions';
import * as ocpReportsSelectors from 'store/ocpReports/ocpReportsSelectors';
import { formatValue } from 'utils/formatValue';
import { chartStyles, styles } from './historicalChart.styles';

interface HistoricalModalOwnProps {
  currentQueryString: string;
  groupBy: string;
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

class HistoricalModalBase extends React.Component<HistoricalModalProps> {
  public componentDidMount() {
    const {
      currentCostReport,
      currentCpuReport,
      currentMemoryReport,
      currentQueryString,
      previousCostReport,
      previousCpuReport,
      previousMemoryReport,
      previousQueryString,
    } = this.props;

    if (!currentCostReport) {
      this.props.fetchReport(OcpReportType.cost, currentQueryString);
    }
    if (!currentCpuReport) {
      this.props.fetchReport(OcpReportType.cpu, currentQueryString);
    }
    if (!currentMemoryReport) {
      this.props.fetchReport(OcpReportType.memory, currentQueryString);
    }
    if (!previousCostReport) {
      this.props.fetchReport(OcpReportType.cost, previousQueryString);
    }
    if (!previousCpuReport) {
      this.props.fetchReport(OcpReportType.cpu, previousQueryString);
    }
    if (!previousMemoryReport) {
      this.props.fetchReport(OcpReportType.memory, previousQueryString);
    }
  }

  public componentDidUpdate(prevProps: HistoricalModalProps) {
    if (prevProps.currentQueryString !== this.props.currentQueryString) {
      this.props.fetchReport(OcpReportType.cost, this.props.currentQueryString);
      this.props.fetchReport(OcpReportType.cpu, this.props.currentQueryString);
      this.props.fetchReport(
        OcpReportType.memory,
        this.props.currentQueryString
      );
    }
    if (prevProps.previousQueryString !== this.props.previousQueryString) {
      this.props.fetchReport(
        OcpReportType.cost,
        this.props.previousQueryString
      );
      this.props.fetchReport(OcpReportType.cpu, this.props.previousQueryString);
      this.props.fetchReport(
        OcpReportType.memory,
        this.props.previousQueryString
      );
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
    const currentCostData = transformOcpReport(
      currentCostReport,
      ChartType.rolling,
      'date',
      'cost'
    );
    const previousCostData = transformOcpReport(
      previousCostReport,
      ChartType.rolling,
      'date',
      'cost'
    );

    // Cpu data
    const currentCpuCapacityData = transformOcpReport(
      currentCpuReport,
      ChartType.daily,
      'date',
      'capacity'
    );
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
    const previousCpuCapacityData = transformOcpReport(
      previousCpuReport,
      ChartType.daily,
      'date',
      'capacity'
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
    const currentMemoryCapacityData = transformOcpReport(
      currentMemoryReport,
      ChartType.daily,
      'date',
      'capacity'
    );
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
    const previousMemoryCapacityData = transformOcpReport(
      previousCpuReport,
      ChartType.daily,
      'date',
      'capacity'
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

    return (
      <div className={css(styles.chartContainer)}>
        <div className={css(styles.costChart)}>
          <HistoricalTrendChart
            height={chartStyles.chartHeight}
            currentData={currentCostData}
            formatDatumValue={formatValue}
            formatDatumOptions={{}}
            previousData={previousCostData}
            title={t('ocp_details.historical.cost_title', { groupBy })}
            xAxisLabel={t('ocp_details.historical.day_of_month_label')}
            yAxisLabel={t('ocp_details.historical.cost_label')}
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
            title={t('ocp_details.historical.cpu_title', { groupBy })}
            xAxisLabel={t('ocp_details.historical.day_of_month_label')}
            yAxisLabel={t('ocp_details.historical.cpu_label')}
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
            title={t('ocp_details.historical.memory_title', { groupBy })}
            xAxisLabel={t('ocp_details.historical.day_of_month_label')}
            yAxisLabel={t('ocp_details.historical.memory_label')}
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
  const currentCostReport = ocpReportsSelectors.selectReport(
    state,
    OcpReportType.cost,
    currentQueryString
  );
  const currentCostReportFetchStatus = ocpReportsSelectors.selectReportFetchStatus(
    state,
    OcpReportType.cost,
    currentQueryString
  );
  const currentCpuReport = ocpReportsSelectors.selectReport(
    state,
    OcpReportType.cpu,
    currentQueryString
  );
  const currentCpuReportFetchStatus = ocpReportsSelectors.selectReportFetchStatus(
    state,
    OcpReportType.cpu,
    currentQueryString
  );
  const currentMemoryReport = ocpReportsSelectors.selectReport(
    state,
    OcpReportType.memory,
    currentQueryString
  );
  const currentMemoryReportFetchStatus = ocpReportsSelectors.selectReportFetchStatus(
    state,
    OcpReportType.memory,
    currentQueryString
  );

  // Previous report
  const previousCostReport = ocpReportsSelectors.selectReport(
    state,
    OcpReportType.cost,
    previousQueryString
  );
  const previousCostReportFetchStatus = ocpReportsSelectors.selectReportFetchStatus(
    state,
    OcpReportType.cost,
    previousQueryString
  );
  const previousCpuReport = ocpReportsSelectors.selectReport(
    state,
    OcpReportType.cpu,
    previousQueryString
  );
  const previousCpuReportFetchStatus = ocpReportsSelectors.selectReportFetchStatus(
    state,
    OcpReportType.cpu,
    previousQueryString
  );
  const previousMemoryReport = ocpReportsSelectors.selectReport(
    state,
    OcpReportType.memory,
    previousQueryString
  );
  const previousMemoryReportFetchStatus = ocpReportsSelectors.selectReportFetchStatus(
    state,
    OcpReportType.memory,
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

export { HistoricalChart, HistoricalModalBase, HistoricalModalProps };
