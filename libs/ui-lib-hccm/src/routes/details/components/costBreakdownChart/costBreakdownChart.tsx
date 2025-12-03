import '../../../components/charts/common/chart.scss';

import type { Report } from '@koku-ui/api/reports/report';
import messages from '@koku-ui/i18n/locales/messages';
import { Charts, ThemeColor } from '@patternfly/react-charts/echarts';
import { SankeyChart } from 'echarts/charts';
import { TitleComponent, TooltipComponent } from 'echarts/components';
import * as echarts from 'echarts/core';
import { SVGRenderer } from 'echarts/renderers';
import React from 'react';
import type { WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';

import type { reportActions } from '../../../../store/reports';
import { formatCurrency } from '../../../../utils/format';
import { ComputedReportItemValueType, getResizeObserver } from '../../../components/charts/common';
import { noop } from '../../../utils/noop';
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
    const { costDistribution, id } = this.props;
    const { width } = this.state;

    const data = costDistribution
      ? [
          {
            name: 'a1',
          },
          {
            name: 'a2',
          },
          {
            name: 'a3',
          },
          {
            name: 'b1',
          },
          {
            name: 'b2',
          },
          {
            name: 'b3',
          },
          {
            name: 'b4',
          },
          {
            name: 'c1',
          },
          {
            name: 'c2',
          },
          {
            name: 'd1',
          },
        ]
      : [
          {
            name: 'a1',
          },
          {
            name: 'a2',
          },
          {
            name: 'a3',
          },
          {
            name: 'd1',
          },
        ];

    const links = costDistribution
      ? [
          {
            source: 'a1',
            target: 'c1',
            value: 20,
          },
          {
            source: 'a2',
            target: 'c1',
            value: 10,
          },
          {
            source: 'a3',
            target: 'c1',
            value: 30,
          },
          {
            source: 'b1',
            target: 'c2',
            value: 60,
          },
          {
            source: 'b2',
            target: 'c2',
            value: 20,
          },
          {
            source: 'b3',
            target: 'c2',
            value: 10,
          },
          {
            source: 'b4',
            target: 'c2',
            value: 10,
          },
          {
            source: 'c1',
            target: 'd1',
            value: 60,
          },
          {
            source: 'c2',
            target: 'd1',
            value: 100,
          },
        ]
      : [
          {
            source: 'a1',
            target: 'c1',
            value: 20,
          },
          {
            source: 'a2',
            target: 'c1',
            value: 10,
          },
          {
            source: 'a3',
            target: 'c1',
            value: 30,
          },
          {
            source: 'c1',
            target: 'd1',
            value: 60,
          },
        ];

    return (
      <Charts
        height={chartStyles.chartHeight}
        id={`${id}-skeleton`}
        option={{
          series: [
            {
              bottom: 0,
              data,
              layoutIterations: 0,
              left: 0,
              links,
              right: 70,
              top: 20,
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

    const isDistributed = costDistribution === ComputedReportItemValueType.distributed;
    const hasCredit = report?.meta?.total?.cost?.credit !== undefined;

    const creditValue = hasCredit ? report.meta.total.cost.credit.value : 0;
    const markupValue = report?.meta?.total?.cost?.markup ? report.meta.total.cost.markup.value : 0;
    const networkUnattributedDistributedValue =
      report?.meta?.total?.cost?.network_unattributed_distributed && isDistributed
        ? report.meta.total.cost.network_unattributed_distributed.value
        : 0;
    const platformDistributedValue =
      report?.meta?.total?.cost?.platform_distributed && isDistributed
        ? report.meta.total.cost.platform_distributed.value
        : 0;
    const rawValue = report?.meta?.total?.cost?.raw ? report.meta.total.cost.raw.value : 0;
    const storageUnattributedDistributedValue =
      report?.meta?.total?.cost?.storage_unattributed_distributed && isDistributed
        ? report.meta.total.cost.storage_unattributed_distributed.value
        : 0;
    const workerUnallocatedValue =
      report?.meta?.total?.cost?.worker_unallocated_distributed && isDistributed
        ? report.meta.total.cost.worker_unallocated_distributed.value
        : 0;
    const usageValue = report?.meta?.total?.cost?.usage ? report.meta.total.cost.usage.value : 0;

    // Only add positive values for Sankey node heights
    const overheadCostValue =
      Math.abs(networkUnattributedDistributedValue) +
      Math.abs(platformDistributedValue) +
      Math.abs(storageUnattributedDistributedValue) +
      Math.abs(workerUnallocatedValue);
    // Actual value shown for labels and tooltips
    const _overheadCostValue =
      networkUnattributedDistributedValue +
      platformDistributedValue +
      storageUnattributedDistributedValue +
      workerUnallocatedValue;

    // Only add positive values for Sankey node heights
    const workloadCostValue = Math.abs(markupValue) + Math.abs(rawValue) + Math.abs(usageValue) + Math.abs(creditValue);
    // Actual value shown for labels and tooltips
    const _workloadCostValue = markupValue + rawValue + usageValue + creditValue;

    const creditLabel = intl.formatMessage(messages.credit);
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

    const reportItemValue = costDistribution ? costDistribution : 'total';
    const units = report.meta.total.cost?.[reportItemValue] ? report.meta.total.cost[reportItemValue].units : 'USD';

    const data = costDistribution
      ? [
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
        ]
      : hasCredit
        ? [
            {
              name: creditLabel,
            },
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
              name: totalCostLabel,
            },
          ]
        : [
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
              name: totalCostLabel,
            },
          ];

    const links = costDistribution
      ? [
          {
            source: rawLabel,
            target: workloadCostLabel,
            value: Math.abs(rawValue),
            _value: rawValue,
          },
          {
            source: markupLabel,
            target: workloadCostLabel,
            value: Math.abs(markupValue),
            _value: markupValue,
          },
          {
            source: usageLabel,
            target: workloadCostLabel,
            value: Math.abs(usageValue),
            _value: usageValue,
          },
          {
            source: networkUnattributedDistributedLabel,
            target: overheadCostLabel,
            value: Math.abs(networkUnattributedDistributedValue),
            _value: networkUnattributedDistributedValue,
          },
          {
            source: platformDistributedLabel,
            target: overheadCostLabel,
            value: Math.abs(platformDistributedValue),
            _value: platformDistributedValue,
          },
          {
            source: storageUnattributedDistributedLabel,
            target: overheadCostLabel,
            value: Math.abs(storageUnattributedDistributedValue),
            _value: storageUnattributedDistributedValue,
          },
          {
            source: workerUnallocatedLabel,
            target: overheadCostLabel,
            value: Math.abs(workerUnallocatedValue),
            _value: workerUnallocatedValue,
          },
          {
            source: workloadCostLabel,
            target: totalCostLabel,
            value: workloadCostValue,
            _value: _workloadCostValue,
          },
          {
            source: overheadCostLabel,
            target: totalCostLabel,
            value: overheadCostValue,
            _value: _overheadCostValue,
          },
          {
            source: totalCostLabel,
            value: overheadCostValue + workloadCostValue,
            _value: _overheadCostValue + _workloadCostValue,
          },
        ]
      : hasCredit
        ? [
            {
              source: creditLabel,
              target: totalCostLabel,
              value: Math.abs(creditValue),
              _value: creditValue,
            },
            {
              source: rawLabel,
              target: totalCostLabel,
              value: Math.abs(rawValue),
              _value: rawValue,
            },
            {
              source: markupLabel,
              target: totalCostLabel,
              value: Math.abs(markupValue),
              _value: markupValue,
            },
            {
              source: usageLabel,
              target: totalCostLabel,
              value: Math.abs(usageValue),
              _value: usageValue,
            },
            {
              source: totalCostLabel,
              value: workloadCostValue,
              _value: _workloadCostValue,
            },
          ]
        : [
            {
              source: rawLabel,
              target: totalCostLabel,
              value: Math.abs(rawValue),
              _value: rawValue,
            },
            {
              source: markupLabel,
              target: totalCostLabel,
              value: Math.abs(markupValue),
              _value: markupValue,
            },
            {
              source: usageLabel,
              target: totalCostLabel,
              value: Math.abs(usageValue),
              _value: usageValue,
            },
            {
              source: totalCostLabel,
              value: workloadCostValue,
              _value: _workloadCostValue,
            },
          ];

    // Workaround for https://echarts.apache.org/en/option.html#series-sankey.tooltip.valueFormatter
    const dataIndexWorkaround = (source: string) => {
      const countDecimals = (value: number) => {
        if (value % 1 !== 0) {
          return value.toString().split('.')[1].length;
        }
        return 0;
      };

      const link = links.find(item => item.source === source);
      if (link.value > 0) {
        // Want most decimals here, so value is still unique
        const count = countDecimals(link.value);
        if (count > 0) {
          link.value = Number(link.value.toFixed(count - 1));
          return link.value;
        }
      }
      return 0;
    };
    if (costDistribution) {
      const newNetworkUnattributedDistributedValue = dataIndexWorkaround(networkUnattributedDistributedLabel);
      const newPlatformDistributedValue = dataIndexWorkaround(platformDistributedLabel);
      const newStorageUnattributedDistributedValue = dataIndexWorkaround(storageUnattributedDistributedLabel);
      const newWorkerUnallocatedValue = dataIndexWorkaround(workerUnallocatedLabel);

      // Recalculate overhead cost
      const newOverheadCostValue =
        newNetworkUnattributedDistributedValue +
        newPlatformDistributedValue +
        newStorageUnattributedDistributedValue +
        newWorkerUnallocatedValue;

      const overheadCostLink = links.find(item => item.source === overheadCostLabel);
      overheadCostLink.value = newOverheadCostValue;

      // Recalculate total cost
      const totalCostLink = links.find(item => item.source === totalCostLabel);
      totalCostLink.value = newOverheadCostValue + workloadCostValue;
    }

    this.setState({ data, links, units });
  };

  public render() {
    const { id, intl } = this.props;
    const { data, links, units, width } = this.state;

    const isSkeleton = !(data && links) || !links.find(link => link.value !== 0);

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
                    bottom: 20,
                    data,
                    label: {
                      formatter: params => {
                        const value = formatCurrency(links[params.dataIndex]._value, units);
                        return `{a|${value}}\n${params.name}`;
                      },
                      lineHeight: 12,
                      rich: {
                        a: {
                          fontWeight: 'bold',
                          fontSize: 12,
                        },
                      },
                    },
                    layoutIterations: 0,
                    links,
                    left: 0,
                    nodeGap: 26,
                    right: 110,
                    top: 20,
                    type: 'sankey',
                  },
                ],
                tooltip: {
                  destinationLabel: intl.formatMessage(messages.chartDestination),
                  sourceLabel: intl.formatMessage(messages.chartSource),
                  valueFormatter: (value: number) => {
                    // Workaround for missing dataIndex param -- see https://echarts.apache.org/en/option.html#series-sankey.tooltip.valueFormatter
                    const link = links.find(val => val.value === value);
                    return `&nbsp;${formatCurrency(link ? link._value : value, units)}`;
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
