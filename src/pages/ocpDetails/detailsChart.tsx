import { css } from '@patternfly/react-styles';
import { getQuery, OcpQuery } from 'api/ocpQuery';
import { OcpReport, OcpReportType } from 'api/ocpReports';
import { BulletChart } from 'components/charts/bulletChart';
import { chartStyles } from 'components/charts/bulletChart/bulletChart.styles';
import React from 'react';
import { InjectedTranslateProps, translate } from 'react-i18next';
import { connect } from 'react-redux';
import { createMapStateToProps, FetchStatus } from 'store/common';
import { ocpReportsActions, ocpReportsSelectors } from 'store/ocpReports';
import { ComputedOcpReportItem } from 'utils/getComputedOcpReportItems';
import { styles } from './detailsChart.styles';

export interface ChartDatum {
  capacity: number;
  legend: any[];
  limit: any;
  ranges: any[];
  values: any[];
}

interface DetailsChartOwnProps {
  groupBy: string;
  item: ComputedOcpReportItem;
}

interface DetailsChartStateProps {
  cpuReport?: OcpReport;
  cpuReportFetchStatus?: FetchStatus;
  memoryReport?: OcpReport;
  memoryReportFetchStatus?: FetchStatus;
  queryString?: string;
}

interface DetailsChartDispatchProps {
  fetchReport?: typeof ocpReportsActions.fetchReport;
}

type DetailsChartProps = DetailsChartOwnProps &
  DetailsChartStateProps &
  DetailsChartDispatchProps &
  InjectedTranslateProps;

const cpuReportType = OcpReportType.cpu;
const memoryReportType = OcpReportType.memory;

class DetailsChartBase extends React.Component<DetailsChartProps> {
  public componentDidMount() {
    const { fetchReport, queryString } = this.props;
    fetchReport(cpuReportType, queryString);
    fetchReport(memoryReportType, queryString);
  }

  public componentDidUpdate(prevProps: DetailsChartProps) {
    const { fetchReport, queryString } = this.props;
    if (prevProps.queryString !== this.props.queryString) {
      fetchReport(cpuReportType, queryString);
      fetchReport(memoryReportType, queryString);
    }
  }

  private getChartDatum(report: OcpReport, labelKey: string): ChartDatum {
    const { t } = this.props;
    const datum: ChartDatum = {
      capacity: 0,
      legend: [],
      limit: {},
      ranges: [],
      values: [],
    };
    if (report && report.meta && report.meta.total) {
      datum.capacity = Math.trunc(report.meta.total.capacity.value);
      const limit = Math.trunc(report.meta.total.limit.value);
      const request = Math.trunc(report.meta.total.request.value);
      const usage = Math.trunc(report.meta.total.usage.value);

      datum.limit = {
        legend: t(`ocp_details.bullet.${labelKey}_limit`, { value: limit }),
        tooltip: t(`ocp_details.bullet.${labelKey}_limit`, { value: limit }),
        value: Math.trunc(limit),
      };
      datum.ranges = [
        {
          color: chartStyles.valueColorScale[1], // '#bee1f4'
          legend: t(`ocp_details.bullet.${labelKey}_requests`, {
            value: request,
          }),
          tooltip: t(`ocp_details.bullet.${labelKey}_requests`, {
            value: request,
          }),
          value: Math.trunc(request),
        },
        {
          color: chartStyles.rangeColorScale[0], // '#ededed'
          legend: t(`ocp_details.bullet.${labelKey}_capacity`, {
            value: datum.capacity,
          }),
          tooltip: t(`ocp_details.bullet.${labelKey}_capacity`, {
            value: datum.capacity,
          }),
          value: Math.trunc(datum.capacity),
        },
      ];
      datum.values = [
        {
          legend: t(`ocp_details.bullet.${labelKey}_usage`, { value: usage }),
          tooltip: t(`ocp_details.bullet.${labelKey}_usage`, { value: usage }),
          value: Math.trunc(usage),
        },
      ];
    }
    return datum;
  }

  public render() {
    const { cpuReport, memoryReport, t } = this.props;
    const cpuDatum = this.getChartDatum(cpuReport, 'cpu');
    const memoryDatum = this.getChartDatum(memoryReport, 'memory');

    return (
      <>
        {Boolean(cpuDatum && cpuDatum.values.length) && (
          <div className={css(styles.cpuBulletContainer)}>
            <BulletChart
              ranges={cpuDatum.ranges}
              thresholdError={cpuDatum.limit}
              title={t('ocp_details.bullet.cpu_label')}
              values={cpuDatum.values}
            />
          </div>
        )}
        {Boolean(memoryDatum && memoryDatum.values.length) && (
          <div className={css(styles.memoryBulletContainer)}>
            <BulletChart
              ranges={memoryDatum.ranges}
              thresholdError={memoryDatum.limit}
              title={t('ocp_details.bullet.memory_label')}
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
>((state, { groupBy, item }) => {
  const query: OcpQuery = {
    filter: {
      time_scope_units: 'month',
      time_scope_value: -1,
      resolution: 'monthly',
      limit: 3,
    },
    group_by: {
      [groupBy]: item.label || item.id,
    },
  };
  const queryString = getQuery(query);
  const cpuReport = ocpReportsSelectors.selectReport(
    state,
    cpuReportType,
    queryString
  );
  const cpuReportFetchStatus = ocpReportsSelectors.selectReportFetchStatus(
    state,
    cpuReportType,
    queryString
  );
  const memoryReport = ocpReportsSelectors.selectReport(
    state,
    memoryReportType,
    queryString
  );
  const memoryReportFetchStatus = ocpReportsSelectors.selectReportFetchStatus(
    state,
    memoryReportType,
    queryString
  );
  return {
    cpuReport,
    cpuReportFetchStatus,
    memoryReport,
    memoryReportFetchStatus,
    queryString,
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

export { DetailsChart, DetailsChartProps };
