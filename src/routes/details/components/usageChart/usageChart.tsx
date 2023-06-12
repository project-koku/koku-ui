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
import { getUnsortedComputedReportItems } from 'routes/utils/computedReport/getComputedReportItems';
import { getGroupById, getGroupByTagKey, getGroupByValue } from 'routes/utils/groupBy';
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
  groupByValue?: string;
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

  private getChartDatum(computedItem): ChartDatum {
    const { groupBy, intl, reportType } = this.props;
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
    } = this.getHasData(computedItem);

    // Always show bullet chart legends https://github.com/project-koku/koku-ui/issues/963
    const limit = Math.trunc(hasLimitValue ? computedItem.limit.value : 0);
    const limitUnits = intl.formatMessage(messages.units, {
      units: unitsLookupKey(hasLimitUnits ? computedItem.limit.units : undefined),
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
    if (groupBy === 'cluster' || reportType === ReportType.volume) {
      const capacity = Math.trunc(hasCapacityValue ? computedItem.capacity.value : 0);
      const capacityUnits = intl.formatMessage(messages.units, {
        units: unitsLookupKey(hasCapacityUnits ? computedItem.capacity.units : undefined),
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

    const request = Math.trunc(hasRequestValue ? computedItem.request.value : 0);
    const requestUnits = intl.formatMessage(messages.units, {
      units: unitsLookupKey(hasRequestUnits ? computedItem.request.units : undefined),
    });
    const usage = Math.trunc(hasUsageValue ? computedItem.usage.value : 0);
    const usageUnits = intl.formatMessage(messages.units, {
      units: unitsLookupKey(hasUsageUnits ? computedItem.usage.units : undefined),
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

  private getChart = computedItem => {
    const { name, reportFetchStatus } = this.props;
    const { width } = this.state;

    const chartDatum = this.getChartDatum(computedItem);
    if (chartDatum.usage.length === 0) {
      return null;
    }

    return (
      <>
        {reportFetchStatus === FetchStatus.inProgress ? (
          this.getSkeleton()
        ) : (
          <>
            {this.getFreeSpace(computedItem)}
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

  private getComputedItems = () => {
    const { query, report } = this.props;

    const groupById = getGroupById(query);
    const groupByTagKey = getGroupByTagKey(query);

    return getUnsortedComputedReportItems({
      report,
      idKey: (groupByTagKey as any) || groupById,
    });
  };

  private getFreeSpace(computedItem) {
    const { groupBy, intl } = this.props;

    if (!computedItem || !(groupBy === 'cluster' || groupBy === 'node')) {
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
    } = this.getHasData(computedItem);

    if (!(hasCapacityUnused && hasRequestUnused)) {
      return null;
    }

    // Show negative values https://github.com/project-koku/koku-ui/issues/1214
    const capacityUnits = intl.formatMessage(messages.units, {
      units: unitsLookupKey(hasCapacityUnits ? computedItem.capacity.units : undefined),
    });
    const capacityUnused = Math.trunc(hasCapacityUnused ? computedItem.capacity.unused : 0);
    const capacityUnusedPercent = Math.trunc(hasCapacityUnusedPercent ? computedItem.capacity.unused_percent : 0);

    const requestUnits = intl.formatMessage(messages.units, {
      units: unitsLookupKey(hasRequestUnits ? computedItem.request.units : undefined),
    });
    const requestUnused = Math.trunc(hasRequestUnused ? computedItem.request.unused : 0);
    const requestUnusedPercent = Math.trunc(hasRequestUnusedPercent ? computedItem.request.unused_percent : 0);

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

    if (groupBy === 'cluster') {
      return width > 950 ? 115 : width > 450 ? 150 : 210;
    } else {
      return width > 700 ? 115 : width > 450 ? 150 : 180;
    }
  };

  private getHasData = computedItem => {
    const hasCapacity = computedItem && computedItem.capacity !== undefined;
    const hasCapacityCount = hasCapacity && computedItem.capacity.count !== undefined;
    const hasCapacityCountUnits = hasCapacity && computedItem.capacity.count_units !== undefined;
    const hasCapacityUnits = hasCapacity && computedItem.units !== undefined;
    const hasCapacityUnused = hasCapacity && computedItem.capacity.unused !== undefined;
    const hasCapacityUnusedPercent = hasCapacity && computedItem.unused_percent !== undefined;
    const hasCapacityValue = hasCapacity && computedItem.capacity.value !== undefined;
    const hasLimit = computedItem && computedItem.limit;
    const hasLimitUnits = hasLimit && computedItem.limit.value !== undefined;
    const hasLimitValue = hasLimit && computedItem.limit.units !== undefined;
    const hasRequest = computedItem && computedItem.request !== undefined;
    const hasRequestUnits = hasRequest && computedItem.request.units !== undefined;
    const hasRequestUnused = hasRequest && computedItem.request.unused !== undefined;
    const hasRequestUnusedPercent = hasRequest && computedItem.request.unused_percent !== undefined;
    const hasRequestValue = hasRequest && computedItem.request.value !== undefined;
    const hasUsage = computedItem && computedItem.usage !== undefined;
    const hasUsageUnits = hasUsage && computedItem.usage.units !== undefined;
    const hasUsageValue = hasUsage && computedItem.usage.value !== undefined;

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
      hasRequest,
      hasRequestUnits,
      hasRequestUnused,
      hasRequestUnusedPercent,
      hasRequestValue,
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

  private getSubTitle(computedItem) {
    const { intl } = this.props;

    if (!computedItem) {
      return null;
    }

    const { hasCapacityCount, hasCapacityCountUnits } = this.getHasData(computedItem);

    const count = hasCapacityCount ? computedItem.capacity.count : 0;
    const countUnits = intl.formatMessage(messages.units, {
      units: unitsLookupKey(hasCapacityCountUnits ? computedItem.capacity.count_units : undefined),
    });

    if (hasCapacityCount && hasCapacityCountUnits) {
      return <div style={styles.subtitle}>{intl.formatMessage(messages.usageSubtitle, { count, countUnits })}</div>;
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
    const { groupByValue } = this.props;

    const computedItems = this.getComputedItems().filter(item => item.id === groupByValue);
    const computedItem = computedItems && computedItems.length > 0 ? computedItems[0] : undefined;

    return (
      <div className="chartOverride" ref={this.containerRef}>
        {this.getSubTitle(computedItem)}
        {this.getChart(computedItem)}
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
      groupByValue,
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
