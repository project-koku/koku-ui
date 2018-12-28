import { css } from '@patternfly/react-styles';
import { OcpReport, OcpReportType } from 'api/ocpReports';
import {
  ChartType,
  getDateRangeString,
  transformOcpReport,
} from 'components/commonChart/chartUtils';
import { HistoricalTrendChart } from 'components/historicalTrendChart';
import { HistoricalUsageChart } from 'components/historicalUsageChart';
import React from 'react';
import { InjectedTranslateProps, translate } from 'react-i18next';
import { connect } from 'react-redux';
import { createMapStateToProps, FetchStatus } from 'store/common';
import * as ocpReportsActions from 'store/ocpReports/ocpReportsActions';
import * as ocpReportsSelectors from 'store/ocpReports/ocpReportsSelectors';
import { formatValue } from 'utils/formatValue';
import { styles } from './historicalChart.styles';

interface HistoricalModalOwnProps {
  chargeTitle?: string;
  cpuTitle?: string;
  currentQueryString: string;
  memoryTitle?: string;
  previousQueryString: string;
  xAxisChargeLabel?: string;
  xAxisCpuLabel?: string;
  xAxisMemoryLabel?: string;
  yAxisChargeLabel?: string;
  yAxisCpuLabel?: string;
  yAxisMemoryLabel?: string;
}

interface HistoricalModalStateProps {
  currentChargeReport?: OcpReport;
  currentChargeReportFetchStatus?: FetchStatus;
  currentCpuReport?: OcpReport;
  currentCpuReportFetchStatus?: FetchStatus;
  currentLimitReport?: OcpReport;
  currentLimitReportFetchStatus?: FetchStatus;
  currentMemoryReport?: OcpReport;
  currentMemoryReportFetchStatus?: FetchStatus;
  previousChargeReport?: OcpReport;
  previousChargeReportFetchStatus?: FetchStatus;
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
      currentChargeReport,
      currentCpuReport,
      currentMemoryReport,
      currentQueryString,
      previousChargeReport,
      previousCpuReport,
      previousMemoryReport,
      previousQueryString,
    } = this.props;

    if (!currentChargeReport) {
      this.props.fetchReport(OcpReportType.charge, currentQueryString);
    }
    if (!currentCpuReport) {
      this.props.fetchReport(OcpReportType.cpu, currentQueryString);
    }
    if (!currentMemoryReport) {
      this.props.fetchReport(OcpReportType.memory, currentQueryString);
    }
    if (!previousChargeReport) {
      this.props.fetchReport(OcpReportType.charge, previousQueryString);
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
      this.props.fetchReport(
        OcpReportType.charge,
        this.props.currentQueryString
      );
      this.props.fetchReport(OcpReportType.cpu, this.props.currentQueryString);
      this.props.fetchReport(
        OcpReportType.memory,
        this.props.currentQueryString
      );
    }
    if (prevProps.previousQueryString !== this.props.previousQueryString) {
      this.props.fetchReport(
        OcpReportType.charge,
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
      chargeTitle,
      cpuTitle,
      currentChargeReport,
      currentCpuReport,
      currentMemoryReport,
      memoryTitle,
      previousChargeReport,
      previousCpuReport,
      previousMemoryReport,
      t,
      xAxisChargeLabel,
      xAxisCpuLabel,
      xAxisMemoryLabel,
      yAxisChargeLabel,
      yAxisCpuLabel,
      yAxisMemoryLabel,
    } = this.props;

    // Charge data
    const currentChargeData = transformOcpReport(
      currentChargeReport,
      ChartType.rolling,
      'date',
      'charge'
    );
    const previousChargeData = transformOcpReport(
      previousChargeReport,
      ChartType.rolling,
      'date',
      'charge'
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

    // Current labels
    const currentCpuCapacityLabel = t(
      'ocp_details.historical.cpu_capacity_label',
      {
        date: getDateRangeString(currentChargeData),
      }
    );
    const currentCpuLimitLabel = t('ocp_details.historical.cpu_limit_label', {
      date: getDateRangeString(currentChargeData),
    });
    const currentCpuRequestLabel = t(
      'ocp_details.historical.cpu_requested_label',
      {
        date: getDateRangeString(currentChargeData),
      }
    );
    const currentCpuUsageLabel = t('ocp_details.historical.cpu_usage_label', {
      date: getDateRangeString(currentChargeData),
    });

    // Previous labels
    const previousCpuCapacityLabel = t(
      'ocp_details.historical.cpu_capacity_label',
      {
        date: getDateRangeString(previousChargeData),
      }
    );
    const previousCpuLimitLabel = t('ocp_details.historical.cpu_limit_label', {
      date: getDateRangeString(previousChargeData),
    });
    const previousCpuRequestLabel = t(
      'ocp_details.historical.cpu_requested_label',
      {
        date: getDateRangeString(previousChargeData),
      }
    );
    const previousCpuUsageLabel = t('ocp_details.historical.cpu_usage_label', {
      date: getDateRangeString(previousChargeData),
    });

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

    // Memory labels
    const currentMemoryCapacityLabel = t(
      'ocp_details.historical.memory_capacity_label',
      {
        date: getDateRangeString(currentChargeData),
      }
    );
    const currentMemoryLimitLabel = t(
      'ocp_details.historical.memory_limit_label',
      {
        date: getDateRangeString(currentChargeData),
      }
    );
    const currentMemoryRequestLabel = t(
      'ocp_details.historical.memory_requested_label',
      {
        date: getDateRangeString(currentChargeData),
      }
    );
    const currentMemoryUsageLabel = t(
      'ocp_details.historical.memory_usage_label',
      {
        date: getDateRangeString(currentChargeData),
      }
    );
    const previousMemoryCapacityLabel = t(
      'ocp_details.historical.memory_capacity_label',
      {
        date: getDateRangeString(currentChargeData),
      }
    );
    const previousMemoryLimitLabel = t(
      'ocp_details.historical.memory_limit_label',
      {
        date: getDateRangeString(currentChargeData),
      }
    );
    const previousMemoryRequestLabel = t(
      'ocp_details.historical.memory_requested_label',
      {
        date: getDateRangeString(previousChargeData),
      }
    );
    const previousMemoryUsageLabel = t(
      'ocp_details.historical.memory_usage_label',
      {
        date: getDateRangeString(previousChargeData),
      }
    );

    return (
      <div className={css(styles.chartContainer)}>
        <div className={css(styles.chargeChart)}>
          <HistoricalTrendChart
            height={75}
            currentData={currentChargeData}
            formatDatumValue={formatValue}
            formatDatumOptions={{}}
            previousData={previousChargeData}
            title={chargeTitle}
            xAxisLabel={xAxisChargeLabel}
            yAxisLabel={yAxisChargeLabel}
          />
        </div>
        <div className={css(styles.cpuChart)}>
          <HistoricalUsageChart
            currentCapacityData={currentCpuCapacityData}
            currentCapacityLabel={currentCpuCapacityLabel}
            currentLimitData={currentCpuLimitData}
            currentLimitLabel={currentCpuLimitLabel}
            currentRequestData={currentCpuRequestData}
            currentRequestLabel={currentCpuRequestLabel}
            currentUsageData={currentCpuUsageData}
            currentUsageLabel={currentCpuUsageLabel}
            formatDatumValue={formatValue}
            formatDatumOptions={{}}
            height={75}
            previousCapacityData={previousCpuCapacityData}
            previousCapacityLabel={previousCpuCapacityLabel}
            previousLimitData={previousCpuLimitData}
            previousLimitLabel={previousCpuLimitLabel}
            previousRequestData={previousCpuRequestData}
            previousRequestLabel={previousCpuRequestLabel}
            previousUsageData={previousCpuUsageData}
            previousUsageLabel={previousCpuUsageLabel}
            title={cpuTitle}
            xAxisLabel={xAxisCpuLabel}
            yAxisLabel={yAxisCpuLabel}
          />
        </div>
        <div className={css(styles.memoryChart)}>
          <HistoricalUsageChart
            currentCapacityData={currentMemoryCapacityData}
            currentCapacityLabel={currentMemoryCapacityLabel}
            currentLimitData={currentMemoryLimitData}
            currentLimitLabel={currentMemoryLimitLabel}
            currentRequestData={currentMemoryRequestData}
            currentRequestLabel={currentMemoryRequestLabel}
            currentUsageData={currentMemoryUsageData}
            currentUsageLabel={currentMemoryUsageLabel}
            formatDatumValue={formatValue}
            formatDatumOptions={{}}
            height={75}
            previousCapacityData={previousMemoryCapacityData}
            previousCapacityLabel={previousMemoryCapacityLabel}
            previousLimitData={previousMemoryLimitData}
            previousLimitLabel={previousMemoryLimitLabel}
            previousRequestData={previousMemoryRequestData}
            previousRequestLabel={previousMemoryRequestLabel}
            previousUsageData={previousMemoryUsageData}
            previousUsageLabel={previousMemoryUsageLabel}
            title={memoryTitle}
            xAxisLabel={xAxisMemoryLabel}
            yAxisLabel={yAxisMemoryLabel}
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
  const currentChargeReport = ocpReportsSelectors.selectReport(
    state,
    OcpReportType.charge,
    currentQueryString
  );
  const currentChargeReportFetchStatus = ocpReportsSelectors.selectReportFetchStatus(
    state,
    OcpReportType.charge,
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
  const previousChargeReport = ocpReportsSelectors.selectReport(
    state,
    OcpReportType.charge,
    previousQueryString
  );
  const previousChargeReportFetchStatus = ocpReportsSelectors.selectReportFetchStatus(
    state,
    OcpReportType.charge,
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
    currentChargeReport,
    currentChargeReportFetchStatus,
    currentCpuReport,
    currentCpuReportFetchStatus,
    currentMemoryReport,
    currentMemoryReportFetchStatus,
    previousChargeReport,
    previousChargeReportFetchStatus,
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
