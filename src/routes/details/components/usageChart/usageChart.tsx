import 'routes/components/charts/common/chart.scss';

import { ChartBullet } from '@patternfly/react-charts';
import { Grid, GridItem, Skeleton } from '@patternfly/react-core';
import type { OcpQuery } from 'api/queries/ocpQuery';
import { parseQuery } from 'api/queries/ocpQuery';
import type { Query } from 'api/queries/query';
import { getQuery, parseQueryState } from 'api/queries/query';
import type { Report, ReportPathsType } from 'api/reports/report';
import { ReportType } from 'api/reports/report';
import messages from 'locales/messages';
import React from 'react';
import type { WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { getResizeObserver } from 'routes/components/charts/common/chartUtils';
import { getGroupById, getGroupByValue } from 'routes/utils/groupBy';
import { noop } from 'routes/utils/noop';
import { skeletonWidth } from 'routes/utils/skeleton';
import { createMapStateToProps, FetchStatus } from 'store/common';
import { reportActions, reportSelectors } from 'store/reports';
import { formatPercentage, formatUnits, unitsLookupKey } from 'utils/format';
import { platformCategoryKey } from 'utils/props';
import type { RouterComponentProps } from 'utils/router';
import { withRouter } from 'utils/router';

import { styles } from './usageChart.styles';

export interface ChartDatum {
  limit: any;
  ranges: any[];
  usage: any[];
}

interface UsageChartOwnProps extends RouterComponentProps, WrappedComponentProps {
  name?: string;
  reportPathsType: ReportPathsType;
  reportType: ReportType; // cpu or memory
}

interface UsageChartStateProps {
  groupBy?: string;
  query?: Query;
  report?: Report;
  reportFetchStatus?: FetchStatus;
  reportQueryString?: string;
}

interface UsageChartDispatchProps {
  fetchReport?: typeof reportActions.fetchReport;
}

interface UsageChartState {
  width: number;
}

type UsageChartProps = UsageChartOwnProps & UsageChartStateProps & UsageChartDispatchProps;

class UsageChartBase extends React.Component<UsageChartProps, UsageChartState> {
  private containerRef = React.createRef<HTMLDivElement>();
  private observer: any = noop;
  public state: UsageChartState = {
    width: 0,
  };

  public componentDidMount() {
    this.observer = getResizeObserver(this.containerRef.current, this.handleResize);
    this.updateReport();
  }

  public componentDidUpdate(prevProps: UsageChartProps) {
    const { reportQueryString } = this.props;
    if (prevProps.reportQueryString !== reportQueryString) {
      this.updateReport();
    }
  }

  public componentWillUnmount() {
    if (this.observer) {
      this.observer();
    }
  }

  private handleResize = () => {
    const { width } = this.state;
    const { clientWidth = 0 } = this.containerRef.current || {};

    if (clientWidth !== width) {
      this.setState({ width: clientWidth });
    }
  };

  private getChartDatum(): ChartDatum {
    const { groupBy, intl, report, reportType } = this.props;
    const datum: ChartDatum = {
      limit: {},
      ranges: [],
      usage: [],
    };

    const {
      hasCapacityUnits,
      hasCapacityValue,
      hasLimitUnits,
      hasLimitValue,
      hasRequestUnits,
      hasRequestValue,
      hasUsageUnits,
      hasUsageValue,
    } = this.getHasData();

    // Always show bullet chart legends https://github.com/project-koku/koku-ui/issues/963
    const limit = Math.trunc(hasLimitValue ? report.meta.total.limit.value : 0);
    const limitUnits = intl.formatMessage(messages.units, {
      units: unitsLookupKey(hasLimitUnits ? report.meta.total.limit.units : undefined),
    });
    datum.limit = {
      legend: intl.formatMessage(messages.detailsUsageLimit, {
        value: limit,
        units: limitUnits,
      }),
      tooltip: intl.formatMessage(messages.detailsUsageLimit, {
        value: limit,
        units: limitUnits,
      }),
      value: Math.trunc(limit),
    };

    // Qualitative range included when grouped by cluster and volume usage
    if (groupBy === 'cluster' || groupBy === 'node' || reportType === ReportType.volume) {
      const capacity = Math.trunc(hasCapacityValue ? report.meta.total.capacity.value : 0);
      const capacityUnits = intl.formatMessage(messages.units, {
        units: unitsLookupKey(hasCapacityUnits ? report.meta.total.capacity.units : undefined),
      });
      datum.ranges = [
        {
          legend: intl.formatMessage(messages.detailsUsageCapacity, {
            value: capacity,
            units: capacityUnits,
          }),
          tooltip: intl.formatMessage(messages.detailsUsageCapacity, {
            value: capacity,
            units: capacityUnits,
          }),
          value: Math.trunc(capacity),
        },
      ];
    }

    const request = Math.trunc(hasRequestValue ? report.meta.total.request.value : 0);
    const requestUnits = intl.formatMessage(messages.units, {
      units: unitsLookupKey(hasRequestUnits ? report.meta.total.request.units : undefined),
    });
    const usage = Math.trunc(hasUsageValue ? report.meta.total.usage.value : 0);
    const usageUnits = intl.formatMessage(messages.units, {
      units: unitsLookupKey(hasUsageUnits ? report.meta.total.usage.units : undefined),
    });
    datum.usage = [
      {
        legend: intl.formatMessage(messages.detailsUsageUsage, {
          value: usage,
          units: usageUnits,
        }),
        tooltip: intl.formatMessage(messages.detailsUsageUsage, {
          value: usage,
          units: usageUnits,
        }),
        value: Math.trunc(usage),
      },
      {
        legend: intl.formatMessage(messages.detailsUsageRequests, {
          value: request,
          units: requestUnits,
        }),
        tooltip: intl.formatMessage(messages.detailsUsageRequests, {
          value: request,
          units: requestUnits,
        }),
        value: Math.trunc(request),
      },
    ];
    return datum;
  }

  private getChart = () => {
    const { name, reportFetchStatus, report } = this.props;
    const { width } = this.state;

    const chartDatum = this.getChartDatum();
    if (!report || chartDatum.usage.length === 0) {
      return null;
    }

    return (
      <>
        {reportFetchStatus === FetchStatus.inProgress ? (
          this.getSkeleton()
        ) : (
          <>
            {this.getFreeSpace()}
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
              name={name}
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
      </>
    );
  };

  private getFreeSpace() {
    const { groupBy, intl, report } = this.props;

    if (!report || !(groupBy === 'cluster' || groupBy === 'node')) {
      return null;
    }

    const {
      hasCapacityCount,
      hasCapacityCountUnits,
      hasCapacityUnits,
      hasCapacityUnused,
      hasCapacityUnusedPercent,
      hasRequestUnits,
      hasRequestUnused,
      hasRequestUnusedPercent,
    } = this.getHasData();

    if (!(hasCapacityUnused && hasRequestUnused)) {
      return null;
    }

    // Show negative values https://github.com/project-koku/koku-ui/issues/1214
    const capacityUnits = intl.formatMessage(messages.units, {
      units: unitsLookupKey(hasCapacityUnits ? report.meta.total.capacity.units : undefined),
    });
    const capacityUnused = Math.trunc(hasCapacityUnused ? report.meta.total.capacity.unused : 0);
    const capacityUnusedPercent = Math.trunc(hasCapacityUnusedPercent ? report.meta.total.capacity.unused_percent : 0);

    const requestUnits = intl.formatMessage(messages.units, {
      units: unitsLookupKey(hasRequestUnits ? report.meta.total.request.units : undefined),
    });
    const requestUnused = Math.trunc(hasRequestUnused ? report.meta.total.request.unused : 0);
    const requestUnusedPercent = Math.trunc(hasRequestUnusedPercent ? report.meta.total.request.unused_percent : 0);

    const chartContainer =
      groupBy === 'node' && !(hasCapacityCount && hasCapacityCountUnits) ? styles.chartContainer : undefined;

    return (
      <Grid hasGutter style={chartContainer}>
        <GridItem md={12} lg={6}>
          <div>{intl.formatMessage(messages.detailsUnusedCapacityLabel)}</div>
          <div style={styles.capacity}>{formatUnits(capacityUnused, capacityUnits)}</div>
          <div>
            {intl.formatMessage(messages.detailsUnusedUnits, {
              percentage: formatPercentage(capacityUnusedPercent, {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              }),
              units: capacityUnits,
            })}
          </div>
        </GridItem>
        <GridItem md={12} lg={6}>
          <div>{intl.formatMessage(messages.detailsUnusedRequestsLabel)}</div>
          <div style={styles.capacity}>{formatUnits(requestUnused, requestUnits)}</div>
          <div>
            {intl.formatMessage(messages.detailsUnusedUnits, {
              percentage: formatPercentage(requestUnusedPercent, {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              }),
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

    if (groupBy === 'cluster' || groupBy === 'node') {
      return width > 950 ? 115 : width > 450 ? 150 : 210;
    } else {
      return width > 700 ? 115 : width > 450 ? 150 : 180;
    }
  };

  private getHasData = () => {
    const { report } = this.props;

    // Note: When APIs return an empty data array, units are unknown. Likewise, when "platform projects" are applied,
    // there is no "platform" project. As a workaround, we obtain values from the meta data.

    const hasMeta = report && report.meta !== undefined;
    const hasTotal = hasMeta && report.meta.total !== undefined;
    const hasCapacity = hasTotal && report.meta.total.capacity !== undefined;
    const hasCapacityCount = hasCapacity && report.meta.total.capacity.count !== undefined;
    const hasCapacityCountUnits = hasCapacity && report.meta.total.capacity.count_units !== undefined;
    const hasCapacityUnits = hasCapacity && report.meta.total.capacity.units !== undefined;
    const hasCapacityUnused = hasCapacity && report.meta.total.capacity.unused !== undefined;
    const hasCapacityUnusedPercent = hasCapacity && report.meta.total.capacity.unused_percent !== undefined;
    const hasCapacityValue = hasCapacity && report.meta.total.capacity.value !== undefined;
    const hasLimit = hasTotal && report.meta.total.limit;
    const hasLimitUnits = hasLimit && report.meta.total.limit.value !== undefined;
    const hasLimitValue = hasLimit && report.meta.total.limit.units !== undefined;
    const hasRequest = hasTotal && report.meta.total.request !== undefined;
    const hasRequestUnits = hasRequest && report.meta.total.request.units !== undefined;
    const hasRequestUnused = hasRequest && report.meta.total.request.unused !== undefined;
    const hasRequestUnusedPercent = hasRequest && report.meta.total.request.unused_percent !== undefined;
    const hasRequestValue = hasRequest && report.meta.total.request.value !== undefined;
    const hasUsage = hasTotal && report.meta.total.usage !== undefined;
    const hasUsageUnits = hasUsage && report.meta.total.usage.units !== undefined;
    const hasUsageValue = hasUsage && report.meta.total.usage.value !== undefined;

    return {
      hasCapacity,
      hasCapacityCount,
      hasCapacityCountUnits,
      hasCapacityUnits,
      hasCapacityUnused,
      hasCapacityUnusedPercent,
      hasCapacityValue,
      hasLimit,
      hasLimitUnits,
      hasLimitValue,
      hasMeta,
      hasRequest,
      hasRequestUnits,
      hasRequestUnused,
      hasRequestUnusedPercent,
      hasRequestValue,
      hasTotal,
      hasUsage,
      hasUsageUnits,
      hasUsageValue,
    };
  };

  private getItemsPerRow = () => {
    const { width } = this.state;
    return width > 950 ? 4 : width > 700 ? 3 : width > 450 ? 2 : 1;
  };

  private getSkeleton = () => {
    return (
      <>
        <Skeleton style={styles.chartSkeleton} width={skeletonWidth.md} />
        <Skeleton style={styles.legendSkeleton} width={skeletonWidth.xs} />
      </>
    );
  };

  private getSubTitle() {
    const { groupBy, intl, report } = this.props;

    if (!report || !(groupBy === 'cluster' || groupBy === 'node')) {
      return null;
    }

    const { hasCapacityCount, hasCapacityCountUnits } = this.getHasData();
    const units = intl.formatMessage(messages.units, {
      units: unitsLookupKey(hasCapacityCountUnits ? report.meta.total.capacity.count_units : undefined),
    });
    const value = formatUnits(hasCapacityCount ? report.meta.total.capacity.count : 0, units);

    if (hasCapacityCount && hasCapacityCountUnits) {
      return <div style={styles.subtitle}>{intl.formatMessage(messages.usageSubtitle, { value, units })}</div>;
    }
    return null;
  }

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

  private updateReport = () => {
    const { fetchReport, reportPathsType, reportType, reportQueryString } = this.props;
    fetchReport(reportPathsType, reportType, reportQueryString);
  };

  public render() {
    return (
      <div className="chartOverride" ref={this.containerRef}>
        {this.getSubTitle()}
        {this.getChart()}
      </div>
    );
  }
}

const mapStateToProps = createMapStateToProps<UsageChartOwnProps, UsageChartStateProps>(
  (state, { reportPathsType, reportType, router }) => {
    const queryFromRoute = parseQuery<OcpQuery>(router.location.search);
    const queryState = parseQueryState<Query>(queryFromRoute);

    const groupBy = getGroupById(queryFromRoute);
    const groupByValue = getGroupByValue(queryFromRoute);

    const query = { ...queryFromRoute };
    const reportQuery: Query = {
      filter: {
        time_scope_units: 'month',
        time_scope_value: -1,
        resolution: 'monthly',
      },
      filter_by: {
        // Add filters here to apply logical OR/AND
        ...(queryState && queryState.filter_by && queryState.filter_by),
        ...(queryFromRoute && queryFromRoute.isPlatformCosts && { category: platformCategoryKey }),
        // Omit filters associated with the current group_by -- see https://issues.redhat.com/browse/COST-1131 and https://issues.redhat.com/browse/COST-3642
        ...(groupBy && groupByValue !== '*' && { [groupBy]: undefined }),
      },
      exclude: {
        ...(queryState && queryState.exclude && queryState.exclude),
      },
      group_by: {
        ...(groupBy && { [groupBy]: groupByValue }),
      },
    };

    const reportQueryString = getQuery(reportQuery);
    const report = reportSelectors.selectReport(state, reportPathsType, reportType, reportQueryString);
    const reportFetchStatus = reportSelectors.selectReportFetchStatus(
      state,
      reportPathsType,
      reportType,
      reportQueryString
    );

    return {
      groupBy,
      query,
      report,
      reportFetchStatus,
      reportQueryString,
    };
  }
);

const mapDispatchToProps: UsageChartDispatchProps = {
  fetchReport: reportActions.fetchReport,
};

const UsageChart = injectIntl(withRouter(connect(mapStateToProps, mapDispatchToProps)(UsageChartBase)));

export default UsageChart;
