import 'routes/components/charts/common/chart.scss';

import { Charts, ThemeColor } from '@patternfly/react-charts/echarts';
import { Switch } from '@patternfly/react-core';
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
  isChecked?: boolean;
  links?: any[];
  minNodeHeight?: number;
  totalCostHeight?: number;
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
    isChecked: false,
    minNodeHeight: 0,
    totalCostHeight: 0,
    units: 'USD',
    width: 0,
  };

  public componentDidMount() {
    this.observer = getResizeObserver(this.containerRef?.current, this.handleResize);
    this.initDatum();
  }

  public componentDidUpdate(prevProps: CostBreakdownChartProps, prevState: CostBreakdownChartStateProps) {
    if (
      prevProps.costDistribution !== this.props.costDistribution ||
      prevProps.report !== this.props.report ||
      prevState.isChecked !== this.state.isChecked
    ) {
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

  private handleChange = (_event, checked: boolean) => {
    this.setState({ isChecked: checked });
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
    const { isChecked } = this.state;

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
    const totalCostValue = overheadCostValue + workloadCostValue;

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

    const minNodeHeight = totalCostValue / 7;
    const getMinNodeHeight = value => (isChecked && minNodeHeight > value ? minNodeHeight : 0);
    const units = hasCostTotal ? report.meta.total.cost[costDistribution].units : 'USD';

    const rawHeight = rawValue + getMinNodeHeight(rawValue);
    const markupHeight = markupValue + getMinNodeHeight(markupValue);
    const usageHeight = usageValue + getMinNodeHeight(usageValue);
    const networkUnattributedDistributedHeight =
      networkUnattributedDistributedValue + getMinNodeHeight(networkUnattributedDistributedValue);
    const platformDistributedHeight = platformDistributedValue + getMinNodeHeight(platformDistributedValue);
    const storageUnattributedDistributedHeight =
      storageUnattributedDistributedValue + getMinNodeHeight(storageUnattributedDistributedValue);
    const workerUnallocatedHeight = workerUnallocatedValue + getMinNodeHeight(workerUnallocatedValue);

    const overheadCostHeight =
      networkUnattributedDistributedHeight +
      platformDistributedHeight +
      storageUnattributedDistributedHeight +
      workerUnallocatedHeight;
    const workloadCostHeight = markupHeight + rawHeight + usageHeight;
    const totalCostHeight = overheadCostHeight + workloadCostHeight;

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
        value: rawHeight,
        _value: rawValue,
      },
      {
        source: markupLabel,
        target: workloadCostLabel,
        value: markupHeight,
        _value: markupValue,
      },
      {
        source: usageLabel,
        target: workloadCostLabel,
        value: usageHeight,
        _value: usageValue,
      },
      {
        source: networkUnattributedDistributedLabel,
        target: overheadCostLabel,
        value: networkUnattributedDistributedHeight,
        _value: networkUnattributedDistributedValue,
      },
      {
        source: platformDistributedLabel,
        target: overheadCostLabel,
        value: platformDistributedHeight,
        _value: platformDistributedValue,
      },
      {
        source: storageUnattributedDistributedLabel,
        target: overheadCostLabel,
        value: storageUnattributedDistributedHeight,
        _value: storageUnattributedDistributedValue,
      },
      {
        source: workerUnallocatedLabel,
        target: overheadCostLabel,
        value: workerUnallocatedHeight,
        _value: workerUnallocatedValue,
      },
      {
        source: workloadCostLabel,
        target: totalCostLabel,
        value: workloadCostHeight,
        _value: workloadCostValue,
      },
      {
        source: overheadCostLabel,
        target: totalCostLabel,
        value: overheadCostHeight,
        _value: overheadCostValue,
      },
      {
        source: totalCostLabel,
        value: totalCostHeight,
        _value: totalCostValue,
      },
    ];
    this.setState({ data, links, minNodeHeight, totalCostHeight, units });
  };

  public render() {
    const { id, intl } = this.props;
    const { data, isChecked, links, minNodeHeight, totalCostHeight, units, width } = this.state;

    const isSkeleton = !(data && links);

    return (
      <div className="chartOverride" ref={this.containerRef}>
        <Switch label="Toggle minimum node height" isChecked={isChecked} onChange={this.handleChange} />
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
                    bottom: 25,
                    data,
                    label: {
                      formatter: params => {
                        const value = formatCurrency(links[params.dataIndex]?._value, units);
                        const percent = ((params.value as number) / totalCostHeight) * 100;

                        if (links[params.dataIndex]?.value > minNodeHeight && percent > 15) {
                          return `{a|${value}}\n${params.name}`;
                        } else {
                          return `{a|${value}}{b|}${params.name}`;
                        }
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
                    layoutIterations: 0,
                    left: 25,
                    links,
                    nodeGap: 20,
                    right: 75,
                    top: 25,
                    type: 'sankey',
                  },
                ],
                tooltip: {
                  destinationLabel: intl.formatMessage(messages.chartDestination),
                  sourceLabel: intl.formatMessage(messages.chartSource),
                  valueFormatter: (value, index) => {
                    return `&nbsp;${formatCurrency(links[index] ? links[index]._value : value, units)}`;
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
