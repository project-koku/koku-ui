import { css } from '@patternfly/react-styles';
import {
  Skeleton,
  SkeletonSize,
} from '@red-hat-insights/insights-frontend-components/components/Skeleton';
import { getQuery, OcpQuery } from 'api/ocpQuery';
import { OcpReport, OcpReportType } from 'api/ocpReports';
import { BulletChart } from 'components/charts/bulletChart';
import { chartStyles } from 'components/charts/bulletChart/bulletChart.styles';
import React from 'react';
import { InjectedTranslateProps, translate } from 'react-i18next';
import { connect } from 'react-redux';
import { createMapStateToProps, FetchStatus } from 'store/common';
import { ocpReportsActions, ocpReportsSelectors } from 'store/ocpReports';
import { unitLookupKey } from 'utils/formatValue';
import { ComputedOcpReportItem } from 'utils/getComputedOcpReportItems';
import { styles } from './detailsChart.styles';

export interface ChartDatum {
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
      legend: [],
      limit: {},
      ranges: [],
      values: [],
    };
    if (report && report.meta && report.meta.total) {
      if (report.meta.total.limit !== null) {
        const limit = Math.trunc(report.meta.total.limit.value);
        const limitUnits = t(
          `units.${unitLookupKey(report.meta.total.limit.units)}`
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
      }
      if (report.meta.total.request !== null) {
        const request = Math.trunc(report.meta.total.request.value);
        const requestUnits = t(
          `units.${unitLookupKey(report.meta.total.request.units)}`
        );
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
      }
      if (report.meta.total.usage !== null) {
        const usage = Math.trunc(report.meta.total.usage.value);
        const usageUnits = t(
          `units.${unitLookupKey(report.meta.total.usage.units)}`
        );
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
    }
    return datum;
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
      cpuReport,
      cpuReportFetchStatus,
      memoryReport,
      memoryReportFetchStatus,
      t,
    } = this.props;
    const cpuDatum = this.getChartDatum(cpuReport, 'cpu');
    const memoryDatum = this.getChartDatum(memoryReport, 'memory');

    return (
      <>
        {Boolean(cpuDatum && cpuDatum.values.length) && (
          <div className={css(styles.cpuBulletContainer)}>
            {cpuReportFetchStatus === FetchStatus.inProgress ? (
              this.getSkeleton()
            ) : (
              <BulletChart
                ranges={cpuDatum.ranges}
                thresholdError={cpuDatum.limit}
                title={t('ocp_details.bullet.cpu_label')}
                values={cpuDatum.values}
              />
            )}
          </div>
        )}
        {Boolean(memoryDatum && memoryDatum.values.length) && (
          <div className={css(styles.memoryBulletContainer)}>
            {memoryReportFetchStatus === FetchStatus.inProgress ? (
              this.getSkeleton()
            ) : (
              <BulletChart
                ranges={memoryDatum.ranges}
                thresholdError={memoryDatum.limit}
                title={t('ocp_details.bullet.memory_label')}
                values={memoryDatum.values}
              />
            )}
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
