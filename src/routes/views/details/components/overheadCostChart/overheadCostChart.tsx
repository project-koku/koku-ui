import { ChartLabel, ChartLegend, ChartPie, ChartThemeColor } from '@patternfly/react-charts';
import { Skeleton } from '@patternfly/react-core';
import type { Report } from 'api/reports/report';
import messages from 'locales/messages';
import React from 'react';
import type { WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';
import { ComputedReportItemValueType } from 'routes/views/components/charts/common';
import { FetchStatus } from 'store/common';
import type { reportActions } from 'store/reports';
import { formatCurrency } from 'utils/format';
import { skeletonWidth } from 'utils/skeleton';

import { chartStyles, styles } from './overheadCostChart.styles';

interface OverheadCostChartOwnProps {
  costDistribution?: string;
  report: Report;
}

interface OverheadCostChartStateProps {
  name?: string;
  report?: Report;
  reportFetchStatus?: FetchStatus;
}

interface OverheadCostChartDispatchProps {
  fetchReport?: typeof reportActions.fetchReport;
}

type OverheadCostChartProps = OverheadCostChartOwnProps &
  OverheadCostChartStateProps &
  OverheadCostChartDispatchProps &
  WrappedComponentProps;

class OverheadCostChartBase extends React.Component<OverheadCostChartProps, any> {
  // Override legend layout
  private getLegendLabel = () => {
    return ({ values, ...props }) => (
      <ChartLabel
        {...props}
        style={[{ fontWeight: chartStyles.subTitle.fontWeight }, {}]}
        text={[values[props.index], props.text]}
      />
    );
  };

  private getSkeleton = () => {
    return (
      <>
        <Skeleton style={styles.chartSkeleton} width={skeletonWidth.md} />
      </>
    );
  };

  public render() {
    const { costDistribution, name, report, reportFetchStatus, intl } = this.props;

    const hasCost = report && report.meta && report.meta.total && report.meta.total.cost;
    const hasPlatformDistributed =
      hasCost &&
      costDistribution === ComputedReportItemValueType.distributed &&
      report.meta.total.cost.platform_distributed;
    const hasWorkerUnallocated =
      hasCost &&
      costDistribution === ComputedReportItemValueType.distributed &&
      report.meta.total.cost.worker_unallocated_distributed;
    const hasCostTotal = hasCost && report.meta.total.cost.total;

    const platformDistributedUnits = hasPlatformDistributed ? report.meta.total.cost.platform_distributed.units : 'USD';
    const workerUnallocatedUnits = hasWorkerUnallocated
      ? report.meta.total.cost.worker_unallocated_distributed.units
      : 'USD';
    const totalCostUnits = hasCostTotal ? report.meta.total.cost.total.units : 'USD';

    const platformDistributedValue =
      hasPlatformDistributed && report.meta.total.cost.platform_distributed.value > 0
        ? report.meta.total.cost.platform_distributed.value
        : 0;
    const workerUnallocatedValue =
      hasWorkerUnallocated && report.meta.total.cost.worker_unallocated_distributed.value > 0
        ? report.meta.total.cost.worker_unallocated_distributed.value
        : 0;
    const totalCostValue = hasCostTotal ? report.meta.total.cost.total.value : 0;

    const platformDistributed = formatCurrency(platformDistributedValue, platformDistributedUnits);
    const workerUnallocated = formatCurrency(workerUnallocatedValue, workerUnallocatedUnits);
    const totalCost = formatCurrency(totalCostValue, totalCostUnits);

    const platformDistributedLabel = intl.formatMessage(messages.platformDistributed);
    const workerUnallocatedLabel = intl.formatMessage(messages.workerUnallocated);
    const totalCostLabel = intl.formatMessage(messages.allOtherProjectCosts);

    // Override legend label layout
    const LegendLabel = this.getLegendLabel();
    const Legend = (
      <ChartLegend
        gutter={30} // Space (width) between legend items
        itemsPerRow={2}
        labelComponent={
          <LegendLabel dy={10} lineHeight={1.5} values={[platformDistributed, workerUnallocated, totalCost]} />
        }
        rowGutter={20}
      />
    );

    return (
      <div style={{ height: chartStyles.chartHeight, width: chartStyles.chartWidth }}>
        {reportFetchStatus === FetchStatus.inProgress ? (
          this.getSkeleton()
        ) : (
          <ChartPie
            ariaDesc={intl.formatMessage(messages.costDistributionAriaDesc)}
            ariaTitle={intl.formatMessage(messages.costDistributionTitle)}
            constrainToVisibleArea
            data={[
              { x: platformDistributedLabel, y: platformDistributedValue, units: platformDistributedUnits },
              { x: workerUnallocatedLabel, y: workerUnallocatedValue, units: workerUnallocatedUnits },
              { x: totalCostLabel, y: totalCostValue, units: totalCostUnits },
            ]}
            height={chartStyles.chartHeight}
            labels={({ datum }) =>
              intl.formatMessage(messages.costBreakdownTooltip, {
                name: datum.x,
                value: formatCurrency(datum.y, datum.units),
              })
            }
            legendComponent={Legend}
            legendData={[
              {
                name: platformDistributedLabel,
              },
              {
                name: workerUnallocatedLabel,
              },
              {
                name: totalCostLabel,
              },
            ]}
            legendOrientation="vertical"
            legendPosition="right"
            name={name}
            padding={{
              bottom: 20,
              left: 0,
              right: 325, // Adjusted to accommodate legend
              top: 20,
            }}
            themeColor={ChartThemeColor.green}
            width={chartStyles.chartWidth}
          />
        )}
      </div>
    );
  }
}

const OverheadCostChart = injectIntl(OverheadCostChartBase);

export default OverheadCostChart;
