import 'routes/components/charts/common/chart.scss';
import './pvc.scss';

import { ChartBullet } from '@patternfly/react-charts/victory';
import { Content, ContentVariants, Divider, Skeleton, Tooltip } from '@patternfly/react-core';
import type { OcpQuery } from 'api/queries/ocpQuery';
import { parseQuery } from 'api/queries/ocpQuery';
import type { Query } from 'api/queries/query';
import { getQuery } from 'api/queries/query';
import type { OcpReport, OcpReportItem } from 'api/reports/ocpReports';
import type { Report, ReportPathsType } from 'api/reports/report';
import type { ReportType } from 'api/reports/report';
import messages from 'locales/messages';
import React from 'react';
import type { WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { getResizeObserver } from 'routes/components/charts/common/chartUtils';
import { getUnsortedComputedReportItems } from 'routes/utils/computedReport/getComputedReportItems';
import { getGroupById, getGroupByValue } from 'routes/utils/groupBy';
import { noop } from 'routes/utils/noop';
import { getQueryState } from 'routes/utils/queryState';
import { skeletonWidth } from 'routes/utils/skeleton';
import { getTimeScopeValue } from 'routes/utils/timeScope';
import { createMapStateToProps, FetchStatus } from 'store/common';
import { reportActions, reportSelectors } from 'store/reports';
import { formatUsage, unitsLookupKey } from 'utils/format';
import { platformCategoryKey } from 'utils/props';
import type { RouterComponentProps } from 'utils/router';
import { withRouter } from 'utils/router';

import { PvcModal } from './modal/pvcModal';
import { styles } from './pvcChart.styles';

export interface ChartDatum {
  usage: any[];
}

interface PvcChartOwnProps extends RouterComponentProps, WrappedComponentProps {
  name?: string;
  reportPathsType: ReportPathsType;
  reportType: ReportType;
}

interface PvcChartStateProps {
  groupBy?: string;
  query?: Query;
  report?: Report;
  reportFetchStatus?: FetchStatus;
  reportQueryString?: string;
}

interface PvcChartDispatchProps {
  fetchReport?: typeof reportActions.fetchReport;
}

interface PvcChartState {
  extraHeight?: number;
  isOpen?: boolean;
  width?: number;
}

type PvcChartProps = PvcChartOwnProps & PvcChartStateProps & PvcChartDispatchProps;

const baseQuery: OcpQuery = {
  filter: {
    limit: 2, // Render 2 items max
    offset: 0,
  },
  order_by: {
    request: 'desc',
  },
};

class PvcChartBase extends React.Component<PvcChartProps, PvcChartState> {
  private containerRef = React.createRef<HTMLDivElement>();
  private observer: any = noop;
  public state: PvcChartState = {
    extraHeight: 0,
    isOpen: false,
    width: 0,
  };

  public componentDidMount() {
    this.observer = getResizeObserver(this.containerRef?.current, this.handleResize);
    this.updateReport();
  }

  public componentDidUpdate(prevProps: PvcChartProps) {
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
    const { clientWidth = 0 } = this.containerRef?.current || {};

    if (clientWidth !== width) {
      this.setState({ width: clientWidth });
    }
  };

  private getChartDatum(item): ChartDatum {
    const { intl } = this.props;
    const datum: ChartDatum = {
      usage: [],
    };

    const request = item.request ? item.request.value : 0;
    const requestValue = formatUsage(request);
    const requestUnits = intl.formatMessage(messages.units, {
      units: unitsLookupKey(item.request ? item.request.units : undefined),
    });

    const usage = item.usage ? item.usage.value : 0;
    const usageValue = formatUsage(usage);
    const usageUnits = intl.formatMessage(messages.units, {
      units: unitsLookupKey(item.usage ? item.usage.units : undefined),
    });

    datum.usage = [
      {
        legend: intl.formatMessage(messages.detailsUsageUsage, {
          value: usageValue,
          units: usageUnits,
        }),
        tooltip: intl.formatMessage(messages.detailsUsageUsage, {
          value: usageValue,
          units: usageUnits,
        }),
        value: this.getRoundValue(usage),
      },
      {
        legend: intl.formatMessage(messages.requestedCapacityValue, {
          value: requestValue,
          units: requestUnits,
        }),
        tooltip: intl.formatMessage(messages.detailsUsageRequests, {
          value: requestValue,
          units: requestUnits,
        }),
        value: this.getRoundValue(request),
      },
    ];
    return datum;
  }

  private getChart = (item, index) => {
    const { name, reportFetchStatus } = this.props;
    const { width } = this.state;

    const chartDatum = this.getChartDatum(item);
    if (!item || chartDatum.usage.length === 0) {
      return null;
    }
    return (
      <>
        {reportFetchStatus === FetchStatus.inProgress ? (
          this.getSkeleton()
        ) : (
          <ChartBullet
            height={this.getHeight(115)}
            labels={({ datum }) => `${datum.tooltip}`}
            legendAllowWrap={this.handleLegendAllowWrap}
            legendPosition="bottom-left"
            maxDomain={this.isDatumEmpty(chartDatum) ? 100 : undefined}
            minDomain={0}
            name={`${name}-${index}`}
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
            width={width}
          />
        )}
      </>
    );
  };

  private getClusterName = item => {
    const { width } = this.state;

    // Cluster name may be up to 256 chars, while the ID is 50
    let maxCharsPerName = 50;
    const clusterName = item?.clusters ? item.clusters[0] : null;

    // Max (non-whitespace) characters that fit without overlapping card
    if (width < 475) {
      maxCharsPerName = 25; // Provide more space for tooltip at smallest window size
    } else if (width < 800) {
      const k = 100 + (800 - width) / 8;
      maxCharsPerName = (width / k) * 5;
    }

    if (clusterName?.length > maxCharsPerName) {
      return (
        <Tooltip content={clusterName} enableFlip>
          <span>{clusterName.slice(0, maxCharsPerName).trim().concat('...')}</span>
        </Tooltip>
      );
    }
    return clusterName;
  };

  private getDescription = item => {
    const { intl } = this.props;

    return (
      <div style={styles.description}>
        <Content className="textContentOverride">
          <Content component={ContentVariants.dl}>
            <Content component={ContentVariants.dt}>{intl.formatMessage(messages.names, { count: 1 })}</Content>
            <Content component={ContentVariants.dd}>{item.persistent_volume_claim}</Content>
            <Content component={ContentVariants.dt}>{intl.formatMessage(messages.cluster)}</Content>
            <Content component={ContentVariants.dd}>{this.getClusterName(item)}</Content>
          </Content>
        </Content>
        <Content className="textContentOverride">
          <Content component={ContentVariants.dl}>
            <Content component={ContentVariants.dt}>&nbsp;</Content>
            <Content component={ContentVariants.dd}>&nbsp;</Content>
            <Content component={ContentVariants.dt}>{intl.formatMessage(messages.storageClass)}</Content>
            <Content component={ContentVariants.dd}>{item.storage_class ? item.storage_class[0] : null}</Content>
          </Content>
        </Content>
      </div>
    );
  };

  private getHeight = baseHeight => {
    const { extraHeight } = this.state;

    return baseHeight + extraHeight;
  };

  private getMoreLink = () => {
    const { intl, report } = this.props;
    const { isOpen } = this.state;

    const count = report?.meta ? report.meta.count : 0;
    const remaining = Math.max(0, count - baseQuery.filter.limit);

    if (remaining > 0) {
      return (
        <>
          <a data-testid="pvc-lnk" href="#/" onClick={this.handleOpen}>
            {intl.formatMessage(messages.detailsMore, { value: remaining })}
          </a>
          <PvcModal isOpen={isOpen} onClose={this.handleClose} title={intl.formatMessage(messages.pvcTitle)} />
        </>
      );
    }
    return null;
  };

  private getRoundValue = (value: number) => {
    return Math.round((value + Number.EPSILON) * 100) / 100;
  };

  private getSkeleton = () => {
    return (
      <>
        <Skeleton style={styles.chartSkeleton} width={skeletonWidth.md} />
        <Skeleton style={styles.legendSkeleton} width={skeletonWidth.xs} />
      </>
    );
  };

  private getPvcCharts = computedItems => {
    const { report } = this.props;

    const items = computedItems.slice(0, baseQuery.filter.limit);
    const count = report?.meta ? report.meta.count : 0;

    return items.map((item, index) => {
      const showDivider = count - index - 1 > 0;
      return (
        <div key={`pvc-${index}`}>
          {this.getDescription(item)}
          {this.getChart(item, index)}
          {showDivider && <Divider style={styles.divider} />}
        </div>
      );
    });
  };

  private handleClose = (isOpen: boolean) => {
    this.setState({ isOpen });
  };

  private handleLegendAllowWrap = extraHeight => {
    if (extraHeight !== this.state.extraHeight) {
      this.setState({ extraHeight });
    }
  };

  public handleOpen = event => {
    this.setState({ isOpen: true });
    event.preventDefault();
    return false;
  };

  private isDatumEmpty = (datum: ChartDatum) => {
    let hasUsage = false;
    for (const usage of datum.usage) {
      if (usage.value) {
        hasUsage = true;
        break;
      }
    }
    return !hasUsage;
  };

  private updateReport = () => {
    const { fetchReport, reportPathsType, reportType, reportQueryString } = this.props;
    fetchReport(reportPathsType, reportType, reportQueryString);
  };

  public render() {
    const { report } = this.props;

    const computedItems = getUnsortedComputedReportItems<OcpReport, OcpReportItem>({
      report,
      idKey: 'persistentvolumeclaim' as any,
    });

    return (
      <div className="chartOverride" ref={this.containerRef}>
        {this.getPvcCharts(computedItems)}
        {this.getMoreLink()}
      </div>
    );
  }
}

const mapStateToProps = createMapStateToProps<PvcChartOwnProps, PvcChartStateProps>(
  (state, { reportPathsType, reportType, router }) => {
    const queryFromRoute = parseQuery<OcpQuery>(router.location.search);
    const queryState = getQueryState(router.location, 'details');

    const groupBy = getGroupById(queryFromRoute);
    const groupByValue = getGroupByValue(queryFromRoute);

    const isFilterByExact = groupBy && groupByValue !== '*';
    const timeScopeValue = getTimeScopeValue(queryState);

    const query = { ...queryFromRoute };
    const reportQuery: Query = {
      filter: {
        ...baseQuery.filter,
        resolution: 'monthly',
        time_scope_units: 'month',
        time_scope_value: timeScopeValue,
      },
      filter_by: {
        // Add filters here to apply logical OR/AND
        ...(queryState?.filter_by && queryState.filter_by),
        ...(queryFromRoute?.isPlatformCosts && { category: platformCategoryKey }),
        // Omit filters associated with the current group_by -- see https://issues.redhat.com/browse/COST-1131 and https://issues.redhat.com/browse/COST-3642
        // Note: We're not inserting PVC information for the 'Platform' project
        ...(isFilterByExact && {
          [groupBy]: undefined, // Replace with "exact:" filter below -- see https://issues.redhat.com/browse/COST-6659
          [`exact:${groupBy}`]: groupByValue,
        }),
      },
      exclude: {
        ...(queryState?.exclude && queryState.exclude),
      },
      group_by: { persistentvolumeclaim: '*' },
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

const mapDispatchToProps: PvcChartDispatchProps = {
  fetchReport: reportActions.fetchReport,
};

const PvcChart = injectIntl(withRouter(connect(mapStateToProps, mapDispatchToProps)(PvcChartBase)));

export default PvcChart;
