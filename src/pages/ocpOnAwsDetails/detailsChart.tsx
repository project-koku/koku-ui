import { css } from '@patternfly/react-styles';
import { getQuery, OcpOnAwsQuery } from 'api/ocpOnAwsQuery';
import { OcpOnAwsReport, OcpOnAwsReportType } from 'api/ocpOnAwsReports';
import { BulletChart } from 'components/charts/bulletChart';
import { chartStyles } from 'components/charts/bulletChart/bulletChart.styles';
import React from 'react';
import { InjectedTranslateProps, translate } from 'react-i18next';
import { connect } from 'react-redux';
import { createMapStateToProps, FetchStatus } from 'store/common';
import {
  ocpOnAwsReportsActions,
  ocpOnAwsReportsSelectors,
} from 'store/ocpOnAwsReports';
import { unitLookupKey } from 'utils/formatValue';
import { ComputedOcpOnAwsReportItem } from 'utils/getComputedOcpOnAwsReportItems';
import { styles } from './detailsChart.styles';

export interface ChartDatum {
  legend: any[];
  limit: any;
  ranges: any[];
  values: any[];
}

interface DetailsChartOwnProps {
  groupBy: string;
  item: ComputedOcpOnAwsReportItem;
}

interface DetailsChartStateProps {
  cpuReport?: OcpOnAwsReport;
  cpuReportFetchStatus?: FetchStatus;
  memoryReport?: OcpOnAwsReport;
  memoryReportFetchStatus?: FetchStatus;
  queryString?: string;
}

interface DetailsChartDispatchProps {
  fetchReport?: typeof ocpOnAwsReportsActions.fetchReport;
}

type DetailsChartProps = DetailsChartOwnProps &
  DetailsChartStateProps &
  DetailsChartDispatchProps &
  InjectedTranslateProps;

const cpuReportType = OcpOnAwsReportType.cpu;
const memoryReportType = OcpOnAwsReportType.memory;

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

  private getChartDatum(report: OcpOnAwsReport, labelKey: string): ChartDatum {
    const { t } = this.props;
    const datum: ChartDatum = {
      legend: [],
      limit: {},
      ranges: [],
      values: [],
    };
    if (report && report.meta && report.meta.total) {
      const limit = Math.trunc(report.meta.total.limit.value);
      const limitUnits = t(
        `units.${unitLookupKey(report.meta.total.limit.units)}`
      );
      const request = Math.trunc(report.meta.total.request.value);
      const requestUnits = t(
        `units.${unitLookupKey(report.meta.total.request.units)}`
      );
      const usage = Math.trunc(report.meta.total.usage.value);
      const usageUnits = t(
        `units.${unitLookupKey(report.meta.total.usage.units)}`
      );

      datum.limit = {
        legend: t(`ocp_details.bullet.${labelKey}_limit`, {
          value: limit,
          units: limitUnits,
        }),
        tooltip: t(`ocp_details.bullet.${labelKey}_limit`, {
          value: limit,
          units: limitUnits,
        }),
        value: Math.trunc(limit),
      };
      datum.ranges = [
        {
          color: chartStyles.valueColorScale[1], // '#bee1f4'
          legend: t(`ocp_details.bullet.${labelKey}_requests`, {
            value: request,
            units: requestUnits,
          }),
          tooltip: t(`ocp_details.bullet.${labelKey}_requests`, {
            value: request,
            units: requestUnits,
          }),
          value: Math.trunc(request),
        },
      ];
      datum.values = [
        {
          legend: t(`ocp_details.bullet.${labelKey}_usage`, {
            value: usage,
            units: usageUnits,
          }),
          tooltip: t(`ocp_details.bullet.${labelKey}_usage`, {
            value: usage,
            units: usageUnits,
          }),
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
              title={t('ocp_on_aws_details.bullet.cpu_label')}
              values={cpuDatum.values}
            />
          </div>
        )}
        {Boolean(memoryDatum && memoryDatum.values.length) && (
          <div className={css(styles.memoryBulletContainer)}>
            <BulletChart
              ranges={memoryDatum.ranges}
              thresholdError={memoryDatum.limit}
              title={t('ocp_on_aws_details.bullet.memory_label')}
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
  const query: OcpOnAwsQuery = {
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
  const cpuReport = ocpOnAwsReportsSelectors.selectReport(
    state,
    cpuReportType,
    queryString
  );
  const cpuReportFetchStatus = ocpOnAwsReportsSelectors.selectReportFetchStatus(
    state,
    cpuReportType,
    queryString
  );
  const memoryReport = ocpOnAwsReportsSelectors.selectReport(
    state,
    memoryReportType,
    queryString
  );
  const memoryReportFetchStatus = ocpOnAwsReportsSelectors.selectReportFetchStatus(
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
  fetchReport: ocpOnAwsReportsActions.fetchReport,
};

const DetailsChart = translate()(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(DetailsChartBase)
);

export { DetailsChart, DetailsChartProps };
