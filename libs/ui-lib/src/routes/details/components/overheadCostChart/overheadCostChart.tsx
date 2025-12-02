import type { Report } from '@koku-ui/api/reports/report';
import messages from '@koku-ui/i18n/locales/messages';
import { ChartLabel, ChartLegend, ChartPie, ChartThemeColor } from '@patternfly/react-charts/victory';
import { Skeleton } from '@patternfly/react-core';
import React from 'react';
import type { WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';

import { FetchStatus } from '../../../../store/common';
import type { reportActions } from '../../../../store/reports';
import { formatCurrency } from '../../../../utils/format';
import { ComputedReportItemValueType } from '../../../components/charts/common';
import { skeletonWidth } from '../../../utils/skeleton';
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

    const hasNetworkUnattributedDistributed =
      report?.meta?.total?.cost?.network_unattributed_distributed &&
      costDistribution === ComputedReportItemValueType.distributed;
    const hasPlatformDistributed =
      report?.meta?.total?.cost?.platform_distributed && costDistribution === ComputedReportItemValueType.distributed;
    const hasStorageUnattributedDistributed =
      report?.meta?.total?.cost?.storage_unattributed_distributed &&
      costDistribution === ComputedReportItemValueType.distributed;
    const hasWorkerUnallocated =
      report?.meta?.total?.cost?.worker_unallocated_distributed &&
      costDistribution === ComputedReportItemValueType.distributed;
    const hasCostTotal = report?.meta?.total?.cost?.total;

    const networkUnattributedDistributedUnits = hasNetworkUnattributedDistributed
      ? report.meta.total.cost.network_unattributed_distributed.units
      : 'USD';
    const platformDistributedUnits = hasPlatformDistributed ? report.meta.total.cost.platform_distributed.units : 'USD';
    const storageUnattributedDistributedUnits = hasStorageUnattributedDistributed
      ? report.meta.total.cost.storage_unattributed_distributed.units
      : 'USD';
    const workerUnallocatedUnits = hasWorkerUnallocated
      ? report.meta.total.cost.worker_unallocated_distributed.units
      : 'USD';
    const totalCostUnits = hasCostTotal ? report.meta.total.cost.total.units : 'USD';

    const networkUnattributedDistributedValue =
      hasPlatformDistributed && report.meta.total.cost.network_unattributed_distributed.value > 0
        ? report.meta.total.cost.network_unattributed_distributed.value
        : 0;
    const platformDistributedValue =
      hasPlatformDistributed && report.meta.total.cost.platform_distributed.value > 0
        ? report.meta.total.cost.platform_distributed.value
        : 0;
    const storageUnattributedDistributedValue =
      hasPlatformDistributed && report.meta.total.cost.storage_unattributed_distributed.value > 0
        ? report.meta.total.cost.storage_unattributed_distributed.value
        : 0;
    const workerUnallocatedValue =
      hasWorkerUnallocated && report.meta.total.cost.worker_unallocated_distributed.value > 0
        ? report.meta.total.cost.worker_unallocated_distributed.value
        : 0;
    const totalCostValue = hasCostTotal ? report.meta.total.cost.total.value : 0;

    const networkUnattributedDistributed = formatCurrency(
      networkUnattributedDistributedValue,
      networkUnattributedDistributedUnits
    );
    const platformDistributed = formatCurrency(platformDistributedValue, platformDistributedUnits);
    const storageUnattributedDistributed = formatCurrency(
      storageUnattributedDistributedValue,
      storageUnattributedDistributedUnits
    );
    const workerUnallocated = formatCurrency(workerUnallocatedValue, workerUnallocatedUnits);
    const totalCost = formatCurrency(totalCostValue, totalCostUnits);

    const networkUnattributedDistributedLabel = intl.formatMessage(messages.networkUnattributedDistributed);
    const platformDistributedLabel = intl.formatMessage(messages.platformDistributed);
    const storageUnattributedDistributedLabel = intl.formatMessage(messages.storageUnattributedDistributed);
    const workerUnallocatedLabel = intl.formatMessage(messages.workerUnallocated);
    const totalCostLabel = intl.formatMessage(messages.allOtherProjectCosts);

    // Override legend label layout
    const LegendLabel = this.getLegendLabel();
    const Legend = (
      <ChartLegend
        gutter={30} // Space (width) between legend items
        itemsPerRow={3}
        labelComponent={
          <LegendLabel
            dy={10}
            lineHeight={1.5}
            values={[
              networkUnattributedDistributed,
              platformDistributed,
              storageUnattributedDistributed,
              workerUnallocated,
              totalCost,
            ]}
          />
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
              {
                x: networkUnattributedDistributedLabel,
                y: networkUnattributedDistributedValue,
                units: networkUnattributedDistributedUnits,
              },
              { x: platformDistributedLabel, y: platformDistributedValue, units: platformDistributedUnits },
              {
                x: storageUnattributedDistributedLabel,
                y: storageUnattributedDistributedValue,
                units: storageUnattributedDistributedUnits,
              },
              { x: workerUnallocatedLabel, y: workerUnallocatedValue, units: workerUnallocatedUnits },
              { x: totalCostLabel, y: totalCostValue, units: totalCostUnits },
            ]}
            height={chartStyles.chartHeight}
            labels={({ datum }) =>
              intl.formatMessage(messages.costBreakdownTooltip, {
                name: datum.x,
                value: formatCurrency(datum.y, datum.units),
              }) as string
            }
            legendComponent={Legend}
            legendData={[
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
                name: totalCostLabel,
              },
            ]}
            legendOrientation="vertical"
            legendPosition="right"
            name={name}
            padding={{
              bottom: 20,
              left: 0,
              right: 375, // Adjusted to accommodate legend
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
