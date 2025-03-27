import 'routes/components/charts/common/chart.scss';

import { Charts, ThemeColor } from '@patternfly/react-charts/echarts';
import type { Report } from 'api/reports/report';
import { SankeyChart } from 'echarts/charts';
import { TitleComponent, TooltipComponent } from 'echarts/components';
import * as echarts from 'echarts/core';
import { SVGRenderer } from 'echarts/renderers';
import messages from 'locales/messages';
import React from 'react';
import type { WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';
import { ComputedReportItemValueType, getResizeObserver } from 'routes/components/charts/common';
import { noop } from 'routes/utils/noop';
import type { reportActions } from 'store/reports';
import { formatCurrency } from 'utils/format';

import { chartStyles } from './costBreakdownChart.styles';

// Register required components
echarts.use([SankeyChart, SVGRenderer, TitleComponent, TooltipComponent]);

interface CostBreakdownChartOwnProps {
  costDistribution?: string;
  id?: string;
  report?: Report;
}

interface CostBreakdownChartStateProps {
  data?: any[];
  links?: any[];
  units?: string;
  width?: number;
}

interface CostBreakdownChartDispatchProps {
  fetchReport?: typeof reportActions.fetchReport;
}

type CostBreakdownChartProps = CostBreakdownChartOwnProps &
  CostBreakdownChartStateProps &
  CostBreakdownChartDispatchProps &
  WrappedComponentProps;

class CostBreakdownChartBase extends React.Component<CostBreakdownChartProps, any> {
  private containerRef = React.createRef<HTMLDivElement>();
  private observer: any = noop;

  public state: CostBreakdownChartStateProps = {
    units: 'USD',
    width: 0,
  };

  public componentDidMount() {
    this.observer = getResizeObserver(this.containerRef?.current, this.handleResize);
    this.initDatum();
  }

  public componentDidUpdate(prevProps: CostBreakdownChartProps) {
    if (prevProps.costDistribution !== this.props.costDistribution || prevProps.report !== this.props.report) {
      this.initDatum();
    }
  }

  public componentWillUnmount() {
    if (this.observer) {
      this.observer();
    }
  }

  private getSkeleton = () => {
    const { id } = this.props;
    const { width } = this.state;

    const data = [
      {
        name: 'raw',
      },
      {
        name: 'markup',
      },
      {
        name: 'usage',
      },
      {
        name: 'networkUnattributedDistributed',
      },
      {
        name: 'platformDistributed',
      },
      {
        name: 'storageUnattributedDistributed',
      },
      {
        name: 'workerUnallocated',
      },
      {
        name: 'workloadCost',
      },
      {
        name: 'overheadCost',
      },
      {
        name: 'totalCost',
      },
    ];

    const links = [
      {
        source: 'markup',
        target: 'workloadCost',
        value: 10,
      },
      {
        source: 'raw',
        target: 'workloadCost',
        value: 20,
      },
      {
        source: 'usage',
        target: 'workloadCost',
        value: 30,
      },
      {
        source: 'networkUnattributedDistributed',
        target: 'overheadCost',
        value: 10,
      },
      {
        source: 'platformDistributed',
        target: 'overheadCost',
        value: 20,
      },
      {
        source: 'storageUnattributedDistributed',
        target: 'overheadCost',
        value: 30,
      },
      {
        source: 'workerUnallocated',
        target: 'overheadCost',
        value: 40,
      },
      {
        source: 'workloadCost',
        target: 'totalCost',
        value: 60,
      },
      {
        source: 'overheadCost',
        target: 'totalCost',
        value: 100,
      },
    ];

    return (
      <Charts
        height={chartStyles.chartHeight}
        id={`${id}-skeleton`}
        option={{
          series: [
            {
              bottom: 25,
              data,
              left: 25,
              links,
              right: 75,
              top: 25,
              type: 'sankey',
            },
          ],
        }}
        themeColor={ThemeColor.skeleton}
        width={width}
      />
    );
  };

  private handleResize = () => {
    const { width } = this.state;
    const { clientWidth = 0 } = this.containerRef?.current || {};

    if (clientWidth !== width) {
      this.setState({ width: clientWidth });
    }
  };

  private initDatum = () => {
    const { costDistribution, report, intl } = this.props;

    if (!report) {
      return;
    }

    const hasCostTotal = report?.meta?.total?.cost?.[costDistribution];
    const hasMarkup = report?.meta?.total?.cost?.markup;
    const hasNetworkUnattributedDistributed =
      report?.meta?.total?.cost?.network_unattributed_distributed &&
      costDistribution === ComputedReportItemValueType.distributed;
    const hasPlatformDistributed =
      report?.meta?.total?.cost?.platform_distributed && costDistribution === ComputedReportItemValueType.distributed;
    const hasRaw = report?.meta?.total?.cost?.raw;
    const hasStorageUnattributedDistributed =
      report?.meta?.total?.cost?.storage_unattributed_distributed &&
      costDistribution === ComputedReportItemValueType.distributed;
    const hasUsage = report?.meta?.total?.cost?.usage;
    const hasWorkerUnallocated =
      report?.meta?.total?.cost?.worker_unallocated_distributed &&
      costDistribution === ComputedReportItemValueType.distributed;

    const markupValue = hasMarkup ? report.meta.total.cost.markup.value : 0;
    const networkUnattributedDistributedValue =
      hasNetworkUnattributedDistributed && report.meta.total.cost.network_unattributed_distributed.value > 0
        ? report.meta.total.cost.network_unattributed_distributed.value
        : 0;
    const platformDistributedValue =
      hasPlatformDistributed && report.meta.total.cost.platform_distributed.value > 0
        ? report.meta.total.cost.platform_distributed.value
        : 0;
    const rawValue = hasRaw ? report.meta.total.cost.raw.value : 0;
    const storageUnattributedDistributedValue =
      hasStorageUnattributedDistributed && report.meta.total.cost.storage_unattributed_distributed.value > 0
        ? report.meta.total.cost.storage_unattributed_distributed.value
        : 0;
    const workerUnallocatedValue =
      hasWorkerUnallocated && report.meta.total.cost.worker_unallocated_distributed.value > 0
        ? report.meta.total.cost.worker_unallocated_distributed.value
        : 0;
    const usageValue = hasUsage ? report.meta.total.cost.usage.value : 0;

    const overheadCostValue =
      networkUnattributedDistributedValue +
      platformDistributedValue +
      storageUnattributedDistributedValue +
      workerUnallocatedValue;
    const workloadCostValue = markupValue + rawValue + usageValue;

    const markupLabel = intl.formatMessage(messages.markupTitle);
    const networkUnattributedDistributedLabel = intl.formatMessage(messages.networkUnattributedDistributed);
    const overheadCostLabel = intl.formatMessage(messages.costDistributionLabel);
    const platformDistributedLabel = intl.formatMessage(messages.platformDistributed);
    const rawLabel = intl.formatMessage(messages.rawCostTitle);
    const storageUnattributedDistributedLabel = intl.formatMessage(messages.storageUnattributedDistributed);
    const totalCostLabel = intl.formatMessage(messages.totalCost);
    const usageLabel = intl.formatMessage(messages.usageCostTitle);
    const workerUnallocatedLabel = intl.formatMessage(messages.workerUnallocated);
    const workloadCostLabel = intl.formatMessage(messages.allOtherProjectCosts);

    const units = hasCostTotal ? report.meta.total.cost[costDistribution].units : 'USD';

    const data = [
      {
        name: rawLabel,
      },
      {
        name: markupLabel,
      },
      {
        name: usageLabel,
      },
      {
        name: networkUnattributedDistributedLabel,
      },
      {
        name: platformDistributedLabel,
      },
      {
        name: storageUnattributedDistributedLabel,
      },
      {
        name: workerUnallocatedLabel,
      },
      {
        name: workloadCostLabel,
      },
      {
        name: overheadCostLabel,
      },
      {
        name: totalCostLabel,
      },
    ];

    const links = [
      {
        source: rawLabel,
        target: workloadCostLabel,
        value: rawValue,
      },
      {
        source: markupLabel,
        target: workloadCostLabel,
        value: markupValue,
      },
      {
        source: usageLabel,
        target: workloadCostLabel,
        value: usageValue,
      },
      {
        source: networkUnattributedDistributedLabel,
        target: overheadCostLabel,
        value: networkUnattributedDistributedValue,
      },
      {
        source: platformDistributedLabel,
        target: overheadCostLabel,
        value: platformDistributedValue,
      },
      {
        source: storageUnattributedDistributedLabel,
        target: overheadCostLabel,
        value: storageUnattributedDistributedValue,
      },
      {
        source: workerUnallocatedLabel,
        target: overheadCostLabel,
        value: workerUnallocatedValue,
      },
      {
        source: workloadCostLabel,
        target: totalCostLabel,
        value: workloadCostValue,
      },
      {
        source: overheadCostLabel,
        target: totalCostLabel,
        value: overheadCostValue,
      },
    ];
    this.setState({ data, links, units });
  };

  public render() {
    const { id, intl } = this.props;
    const { data, links, units, width } = this.state;

    const isSkeleton = !(data && links);

    return (
      <div className="chartOverride" ref={this.containerRef}>
        <div style={{ height: chartStyles.chartHeight }}>
          {isSkeleton ? (
            this.getSkeleton()
          ) : (
            <Charts
              height={chartStyles.chartHeight}
              id={id}
              option={{
                series: [
                  {
                    bottom: 0,
                    data,
                    label: {
                      formatter: params => {
                        const value = formatCurrency(params.value as number, units);
                        return `{a|${value}}\n${params.name}`;
                      },
                      lineHeight: 12,
                      rich: {
                        a: {
                          fontWeight: 'bold',
                          fontSize: 12,
                        },
                        b: {
                          width: 12,
                        },
                      },
                    },
                    // layoutIterations: 0,
                    links,
                    left: 0,
                    nodeGap: 26,
                    right: 70,
                    top: 20,
                    type: 'sankey',
                  },
                ],
                tooltip: {
                  destinationLabel: intl.formatMessage(messages.chartDestination),
                  sourceLabel: intl.formatMessage(messages.chartSource),
                  valueFormatter: (value: number) => {
                    return `&nbsp;${formatCurrency(value, units)}`;
                  },
                },
              }}
              themeColor={ThemeColor.green}
              width={width}
            />
          )}
        </div>
      </div>
    );
  }
}

const CostBreakdownChart = injectIntl(CostBreakdownChartBase);

export default CostBreakdownChart;
