import { css } from '@patternfly/react-styles';
import { OcpReport, OcpReportType } from 'api/ocpReports';
import { MeasureChart } from 'components/measureChart';
import React from 'react';
import { InjectedTranslateProps, translate } from 'react-i18next';
import { connect } from 'react-redux';
import { createMapStateToProps, FetchStatus } from 'store/common';
import { ocpReportsActions, ocpReportsSelectors } from 'store/ocpReports';
import { styles } from './ocpDetails.styles';

export interface ChartDatum {
  capacity: number;
  legend: any[];
  limit: number;
  maxValue: number;
  ranges: any[];
  values: any[];
}

interface DetailsChartOwnProps {
  queryString: string;
}

interface DetailsChartStateProps {
  cpuReport?: OcpReport;
  cpuReportFetchStatus?: FetchStatus;
  memoryReport?: OcpReport;
  memoryReportFetchStatus?: FetchStatus;
}

interface DetailsChartDispatchProps {
  fetchReport?: typeof ocpReportsActions.fetchReport;
}

type DetailsChartProps = DetailsChartOwnProps &
  DetailsChartStateProps &
  DetailsChartDispatchProps &
  InjectedTranslateProps;

class DetailsChartBase extends React.Component<DetailsChartProps> {
  public componentDidMount() {
    const { cpuReport, memoryReport, queryString } = this.props;
    if (!cpuReport) {
      this.props.fetchReport(OcpReportType.cpu, queryString);
    }
    if (!memoryReport) {
      this.props.fetchReport(OcpReportType.memory, queryString);
    }
  }

  public componentDidUpdate(prevProps: DetailsChartProps) {
    if (prevProps.queryString !== this.props.queryString) {
      this.props.fetchReport(OcpReportType.cpu, this.props.queryString);
      this.props.fetchReport(OcpReportType.memory, this.props.queryString);
    }
  }

  private getChartDatum(report: OcpReport, labelKey: string): ChartDatum {
    const { t } = this.props;
    const datum: ChartDatum = {
      capacity: 0,
      legend: [],
      limit: 0,
      maxValue: 100,
      ranges: [],
      values: [],
    };
    if (report) {
      datum.limit = Math.trunc(report.total.limit);
      datum.capacity = Math.trunc(report.total.capacity);
      const request = Math.trunc(report.total.request);
      const usage = Math.trunc(report.total.usage);
      datum.maxValue = Math.max(usage, request, datum.limit, datum.capacity);

      datum.ranges = [
        {
          title: t(`ocp_details.bullet.${labelKey}_capacity`, {
            value: datum.capacity,
          }),
          value: Math.trunc(datum.capacity),
        },
      ];
      datum.values = [
        {
          title: t(`ocp_details.bullet.${labelKey}_usage`, { value: usage }),
          value: Math.trunc(usage),
        },
        {
          title: t(`ocp_details.bullet.${labelKey}_requests`, {
            value: request,
          }),
          value: Math.trunc(request),
        },
      ];
    }
    return datum;
  }

  public render() {
    const { cpuReport, memoryReport, t } = this.props;
    const cpuDatum = this.getChartDatum(cpuReport, 'cpu');
    const memoryDatum = this.getChartDatum(memoryReport, 'memory');

    // Temporarily hide memory chart as a workaround for issue #399
    return (
      <>
        {Boolean(cpuDatum && cpuDatum.values.length) && (
          <MeasureChart
            id="cpu-chart"
            label={t('ocp_details.bullet.cpu_label')}
            maxValue={cpuDatum.maxValue}
            ranges={cpuDatum.ranges}
            thresholdError={cpuDatum.limit}
            thresholdErrorLegendText={t(`ocp_details.bullet.cpu_limit`, {
              value: cpuDatum.limit,
            })}
            values={cpuDatum.values}
          />
        )}
        {Boolean(memoryDatum && memoryDatum.values.length === -1) && (
          <div className={css(styles.memoryBulletContainer)}>
            <MeasureChart
              id="memory-chart"
              label={t('ocp_details.bullet.memory_label')}
              maxValue={memoryDatum.maxValue}
              ranges={memoryDatum.ranges}
              thresholdError={memoryDatum.limit}
              thresholdErrorLegendText={t(`ocp_details.bullet.memory_limit`, {
                value: memoryDatum.limit,
              })}
              values={memoryDatum.values}
            />
          </div>
        )}
      </>
    );
  }
}

const mapStateToProps = createMapStateToProps<
  DetailsChartOwnProps,
  DetailsChartStateProps
>((state, { queryString }) => {
  const cpuReport = ocpReportsSelectors.selectReport(
    state,
    OcpReportType.cpu,
    queryString
  );
  const cpuReportFetchStatus = ocpReportsSelectors.selectReportFetchStatus(
    state,
    OcpReportType.cpu,
    queryString
  );
  const memoryReport = ocpReportsSelectors.selectReport(
    state,
    OcpReportType.memory,
    queryString
  );
  const memoryReportFetchStatus = ocpReportsSelectors.selectReportFetchStatus(
    state,
    OcpReportType.memory,
    queryString
  );
  return {
    cpuReport,
    cpuReportFetchStatus,
    memoryReport,
    memoryReportFetchStatus,
  };
});

const mapDispatchToProps: DetailsChartDispatchProps = {
  fetchReport: ocpReportsActions.fetchReport,
};

const DetailsChart = translate()(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(DetailsChartBase)
);

export { DetailsChart, DetailsChartBase, DetailsChartProps };
