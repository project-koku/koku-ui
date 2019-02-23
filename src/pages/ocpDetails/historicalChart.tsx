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
import { styles } from './historicalChart.styles';

interface HistoricalModalOwnProps {
  currentQueryString: string;
  groupBy: string;
  previousQueryString: string;
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
      currentChargeReport,
      currentCpuReport,
      currentMemoryReport,
      groupBy,
      previousChargeReport,
      previousCpuReport,
      previousMemoryReport,
      t,
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

    const chartHeight = 130;

    return (
      <div className={css(styles.chartContainer)}>
        <div className={css(styles.chargeChart)}>
          <HistoricalTrendChart
            height={chartHeight}
            currentData={currentChargeData}
            formatDatumValue={formatValue}
            formatDatumOptions={{}}
            previousData={previousChargeData}
            title={t('ocp_details.historical.charge_title', { groupBy })}
            xAxisLabel={t('ocp_details.historical.day_of_month_label')}
            yAxisLabel={t('ocp_details.historical.charge_label')}
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
            height={chartHeight}
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
            height={chartHeight}
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
