import 'components/charts/common/charts-common.scss';

import { ChartBullet } from '@patternfly/react-charts';
import { Grid, GridItem, Skeleton } from '@patternfly/react-core';
import { OcpQuery, parseQuery } from 'api/queries/ocpQuery';
import { getQuery, Query } from 'api/queries/query';
import { Report } from 'api/reports/report';
import { ReportPathsType, ReportType } from 'api/reports/report';
import { getGroupById, getGroupByValue } from 'pages/views/utils/groupBy';
import React from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { createMapStateToProps, FetchStatus } from 'store/common';
import { reportActions, reportSelectors } from 'store/reports';
import { formatValue, unitLookupKey } from 'utils/formatValue';

import { styles } from './usageChart.styles';

export interface ChartDatum {
  limit: any;
  ranges: any[];
  usage: any[];
}

interface UsageChartOwnProps {
  reportPathsType: ReportPathsType;
  reportType: ReportType; // cpu or memory
}

interface UsageChartStateProps {
  groupBy?: string;
  report?: Report;
  reportFetchStatus?: FetchStatus;
  queryString?: string;
}

interface UsageChartDispatchProps {
  fetchReport?: typeof reportActions.fetchReport;
}

interface State {
  width: number;
}

type UsageChartProps = UsageChartOwnProps & UsageChartStateProps & UsageChartDispatchProps & WithTranslation;

class UsageChartBase extends React.Component<UsageChartProps> {
  private containerRef = React.createRef<HTMLDivElement>();
  public state: State = {
    width: 0,
  };

  public componentDidMount() {
    const { fetchReport, queryString, reportPathsType, reportType } = this.props;
    fetchReport(reportPathsType, reportType, queryString);

    window.addEventListener('resize', this.handleResize);
    this.handleResize();
  }

  public componentDidUpdate(prevProps: UsageChartProps) {
    const { fetchReport, queryString, reportPathsType, reportType } = this.props;
    if (prevProps.queryString !== this.props.queryString) {
      fetchReport(reportPathsType, reportType, queryString);
    }
  }

  public componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }

  private handleResize = () => {
    if (this.containerRef.current && this.containerRef.current.clientWidth) {
      this.setState({ width: this.containerRef.current.clientWidth });
    }
  };

  private getChartDatum(): ChartDatum {
    const { report, reportType, t } = this.props;
    const datum: ChartDatum = {
      limit: {},
      ranges: [],
      usage: [],
    };

    // Always show bullet chart legends https://github.com/project-koku/koku-ui/issues/963
    const hasTotal = report && report.meta && report.meta.total;

    const hasLimit = hasTotal && report.meta.total.limit && report.meta.total.limit !== null;
    const limit = Math.trunc(hasLimit ? report.meta.total.limit.value : 0);
    const limitUnits = t(`units.${unitLookupKey(hasLimit ? report.meta.total.limit.units : '')}`);
    datum.limit = {
      legend: t(`details.usage.${reportType}_limit`, {
        value: limit,
        units: limitUnits,
      }),
      tooltip: t(`details.usage.${reportType}_limit`, {
        value: limit,
        units: limitUnits,
      }),
      value: Math.trunc(limit),
    };

    const hasRequest = hasTotal && report.meta.total.request && report.meta.total.request !== null;
    const request = Math.trunc(hasRequest ? report.meta.total.request.value : 0);
    const requestUnits = t(`units.${unitLookupKey(hasRequest ? report.meta.total.request.units : '')}`);
    datum.ranges = [
      {
        legend: t(`details.usage.${reportType}_requests`, {
          value: request,
          units: requestUnits,
        }),
        tooltip: t(`details.usage.${reportType}_requests`, {
          value: request,
          units: requestUnits,
        }),
        value: Math.trunc(request),
      },
    ];

    const hasUsage = hasTotal && report.meta.total.usage && report.meta.total.usage !== null;
    const usage = Math.trunc(hasUsage ? report.meta.total.usage.value : 0);
    const usageUnits = t(`units.${unitLookupKey(hasUsage ? report.meta.total.usage.units : '')}`);
    datum.usage = [
      {
        legend: t(`details.usage.${reportType}_usage`, {
          value: usage,
          units: usageUnits,
        }),
        tooltip: t(`details.usage.${reportType}_usage`, {
          value: usage,
          units: usageUnits,
        }),
        value: Math.trunc(usage),
      },
    ];
    return datum;
  }

  private getChartDatumWithCapacity(): ChartDatum {
    const { report, reportType, t } = this.props;
    const datum: ChartDatum = {
      limit: {},
      ranges: [],
      usage: [],
    };

    // Always show bullet chart legends https://github.com/project-koku/koku-ui/issues/963
    const hasTotal = report && report.meta && report.meta.total;

    const hasLimit = hasTotal && report.meta.total.limit && report.meta.total.limit !== null;
    const limit = Math.trunc(hasLimit ? report.meta.total.limit.value : 0);
    const limitUnits = t(`units.${unitLookupKey(hasLimit ? report.meta.total.limit.units : '')}`);
    datum.limit = {
      legend: t(`details.usage.${reportType}_limit`, {
        value: limit,
        units: limitUnits,
      }),
      tooltip: t(`details.usage.${reportType}_limit`, {
        value: limit,
        units: limitUnits,
      }),
      value: Math.trunc(limit),
    };

    const hasCapacity = hasTotal && report.meta.total.request && report.meta.total.request !== null;
    const capacity = Math.trunc(hasCapacity ? report.meta.total.capacity.value : 0);
    const capacityUnits = t(`units.${unitLookupKey(hasCapacity ? report.meta.total.capacity.units : '')}`);
    datum.ranges = [
      {
        legend: t(`details.usage.${reportType}_capacity`, {
          value: capacity,
          units: capacityUnits,
        }),
        tooltip: t(`details.usage.${reportType}_capacity`, {
          value: capacity,
          units: capacityUnits,
        }),
        value: Math.trunc(capacity),
      },
    ];

    const hasRequest = hasTotal && report.meta.total.request && report.meta.total.request !== null;
    const hasUsage = hasTotal && report.meta.total.usage && report.meta.total.usage !== null;
    const request = Math.trunc(hasRequest ? report.meta.total.request.value : 0);
    const requestUnits = t(`units.${unitLookupKey(hasRequest ? report.meta.total.request.units : '')}`);
    const usage = Math.trunc(hasUsage ? report.meta.total.usage.value : 0);
    const usageUnits = t(`units.${unitLookupKey(hasUsage ? report.meta.total.usage.units : '')}`);
    datum.usage = [
      {
        legend: t(`details.usage.${reportType}_usage`, {
          value: usage,
          units: usageUnits,
        }),
        tooltip: t(`details.usage.${reportType}_usage`, {
          value: usage,
          units: usageUnits,
        }),
        value: Math.trunc(usage),
      },
      {
        legend: t(`details.usage.${reportType}_requests`, {
          value: request,
          units: requestUnits,
        }),
        tooltip: t(`details.usage.${reportType}_requests`, {
          value: request,
          units: requestUnits,
        }),
        value: Math.trunc(request),
      },
    ];
    return datum;
  }

  private getCpuChart = () => {
    const { groupBy, reportFetchStatus, report } = this.props;
    const { width } = this.state;

    const chartDatum = groupBy === 'cluster' ? this.getChartDatumWithCapacity() : this.getChartDatum();

    if (!report || chartDatum.usage.length === 0) {
      return null;
    }

    return (
      <div className="chartOverride">
        {reportFetchStatus === FetchStatus.inProgress ? (
          this.getSkeleton()
        ) : (
          <>
            {Boolean(groupBy === 'cluster') && this.getFreeSpace()}
            <ChartBullet
              comparativeErrorMeasureData={
                chartDatum.limit.value
                  ? [
                      {
                        tooltip: chartDatum.limit.tooltip,
                        y: chartDatum.limit.value,
                      },
                    ]
                  : []
              }
              comparativeErrorMeasureLegendData={chartDatum.limit.value ? [{ name: chartDatum.limit.legend }] : []}
              height={this.getChartHeight()}
              labels={({ datum }) => `${datum.tooltip}`}
              legendPosition="bottom-left"
              legendItemsPerRow={this.getItemsPerRow()}
              maxDomain={this.isDatumEmpty(chartDatum) ? 100 : undefined}
              minDomain={0}
              padding={{
                bottom: 75,
                left: 10,
                right: 50,
                top: 0,
              }}
              primarySegmentedMeasureData={
                chartDatum.usage.length
                  ? chartDatum.usage.map(datum => {
                      return {
                        tooltip: datum.tooltip,
                        y: datum.value,
                      };
                    })
                  : []
              }
              primarySegmentedMeasureLegendData={
                chartDatum.usage.length
                  ? chartDatum.usage.map(datum => {
                      return {
                        name: datum.legend,
                      };
                    })
                  : []
              }
              qualitativeRangeData={
                chartDatum.ranges.length
                  ? [
                      {
                        tooltip: chartDatum.ranges[0].tooltip,
                        y: chartDatum.ranges[0].value,
                      },
                    ]
                  : []
              }
              qualitativeRangeLegendData={chartDatum.ranges.length ? [{ name: chartDatum.ranges[0].legend }] : []}
              width={width}
            />
          </>
        )}
      </div>
    );
  };

  private getFreeSpace() {
    const { report, reportType, t } = this.props;
    const hasTotal = report && report.meta && report.meta.total;
    const hasCapacity = hasTotal && report.meta.total.request && report.meta.total.request !== null;
    const hasRequest = hasTotal && report.meta.total.request && report.meta.total.request !== null;
    const hasUsage = hasTotal && report.meta.total.usage && report.meta.total.usage !== null;

    const capacity = Math.trunc(hasCapacity ? report.meta.total.capacity.value : 0);
    const request = Math.trunc(hasRequest ? report.meta.total.request.value : 0);
    const requestUnits = t(`units.${unitLookupKey(hasRequest ? report.meta.total.request.units : '')}`);
    const usage = Math.trunc(hasUsage ? report.meta.total.usage.value : 0);
    const usageUnits = t(`units.${unitLookupKey(hasUsage ? report.meta.total.usage.units : '')}`);

    // Show negative values https://github.com/project-koku/koku-ui/issues/1214
    const unusedRequestCapacity = capacity - request;
    const unusedUsageCapacity = capacity - usage;

    let unusedRequestCapacityPercentage = request > 0 ? (request / capacity) * 100 : 0;
    if (unusedRequestCapacityPercentage > 100) {
      unusedRequestCapacityPercentage = 100 - unusedRequestCapacityPercentage;
    }
    let unusedUsageCapacityPercentage = capacity > usage ? (usage / capacity) * 100 : 0;
    if (unusedUsageCapacityPercentage > 100) {
      unusedUsageCapacityPercentage = 100 - unusedUsageCapacityPercentage;
    }

    return (
      <Grid hasGutter>
        <GridItem md={12} lg={6}>
          <div>{t(`details.usage.${reportType}_usage_unused_label`)}</div>
          <div style={styles.capacity}>{formatValue(unusedUsageCapacity)}</div>
          <div>
            {t(`details.usage.${reportType}_usage_unused_units`, {
              percentage: formatValue(unusedUsageCapacityPercentage, usageUnits),
              units: usageUnits,
            })}
          </div>
        </GridItem>
        <GridItem md={12} lg={6}>
          <div>{t(`details.usage.${reportType}_requests_unused_label`)}</div>
          <div style={styles.capacity}>{formatValue(unusedRequestCapacity)}</div>
          <div>
            {t(`details.usage.${reportType}_requests_unused_units`, {
              percentage: formatValue(unusedRequestCapacityPercentage, requestUnits),
              units: requestUnits,
            })}
          </div>
        </GridItem>
      </Grid>
    );
  }

  private getChartHeight = () => {
    const { groupBy } = this.props;
    const { width } = this.state;

    if (groupBy === 'cluster') {
      return width > 950 ? 115 : width > 450 ? 150 : 210;
    } else {
      return width > 700 ? 115 : width > 450 ? 150 : 180;
    }
  };

  private getItemsPerRow = () => {
    const { width } = this.state;
    return width > 950 ? 4 : width > 700 ? 3 : width > 450 ? 2 : 1;
  };

  private getSkeleton = () => {
    return (
      <>
        <Skeleton style={styles.chartSkeleton} width="66%" />
        <Skeleton style={styles.legendSkeleton} width="16%" />
      </>
    );
  };

  private isDatumEmpty = (datum: ChartDatum) => {
    let hasRange = false;
    for (const range of datum.ranges) {
      if (range.value) {
        hasRange = true;
        break;
      }
    }
    let hasUsage = false;
    for (const usage of datum.usage) {
      if (usage.value) {
        hasUsage = true;
        break;
      }
    }
    return !(datum.limit.value || hasRange || hasUsage);
  };

  public render() {
    return (
      <div className="chartOverride" ref={this.containerRef}>
        {this.getCpuChart()}
      </div>
    );
  }
}

const mapStateToProps = createMapStateToProps<UsageChartOwnProps, UsageChartStateProps>(
  (state, { reportPathsType, reportType }) => {
    const query = parseQuery<OcpQuery>(location.search);
    const groupBy = getGroupById(query);
    const groupByValue = getGroupByValue(query);

    const newQuery: Query = {
      filter: {
        time_scope_units: 'month',
        time_scope_value: -1,
        resolution: 'monthly',
      },
      filter_by: {
        // Add filters here to apply logical OR/AND
        ...(query && query.filter_by && query.filter_by),
        ...(groupBy && { [groupBy]: undefined }), // Omit filters associated with the current group_by -- see https://issues.redhat.com/browse/COST-1131
      },
      group_by: {
        ...(groupBy && { [groupBy]: groupByValue }),
      },
    };
    const queryString = getQuery(newQuery);

    const report = reportSelectors.selectReport(state, reportPathsType, reportType, queryString);
    const reportFetchStatus = reportSelectors.selectReportFetchStatus(state, reportPathsType, reportType, queryString);

    return {
      groupBy,
      report,
      reportFetchStatus,
      queryString,
    };
  }
);

const mapDispatchToProps: UsageChartDispatchProps = {
  fetchReport: reportActions.fetchReport,
};

const UsageChart = withTranslation()(connect(mapStateToProps, mapDispatchToProps)(UsageChartBase));

export { UsageChart, UsageChartProps };
