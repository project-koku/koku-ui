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
import { skeletonWidth } from '../../../utils/skeleton';
import { chartStyles, styles } from './costChart.styles';

interface CostChartOwnProps {
  report: Report;
}

interface CostChartStateProps {
  name?: string;
  report?: Report;
  reportFetchStatus?: FetchStatus;
}

interface CostChartDispatchProps {
  fetchReport?: typeof reportActions.fetchReport;
}

type CostChartProps = CostChartOwnProps & CostChartStateProps & CostChartDispatchProps & WrappedComponentProps;

class CostChartBase extends React.Component<CostChartProps, any> {
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
    const { name, report, reportFetchStatus, intl } = this.props;

    const hasMarkup = report?.meta?.total?.cost?.markup;
    const hasRaw = report?.meta?.total?.cost?.raw;
    const hasUsage = report?.meta?.total?.cost?.usage;

    const markupUnits = hasMarkup ? report.meta.total.cost.markup.units : 'USD';
    const rawUnits = hasRaw ? report.meta.total.cost.raw.units : 'USD';
    const usageUnits = hasUsage ? report.meta.total.cost.usage.units : 'USD';

    const markupValue = hasMarkup ? report.meta.total.cost.markup.value : 0;
    const rawValue = hasRaw ? report.meta.total.cost.raw.value : 0;
    const usageValue = hasUsage ? report.meta.total.cost.usage.value : 0;

    const markup = formatCurrency(hasMarkup ? report.meta.total.cost.markup.value : 0, markupUnits);
    const raw = formatCurrency(hasRaw ? report.meta.total.cost.raw.value : 0, rawUnits);
    const usage = formatCurrency(hasUsage ? report.meta.total.cost.usage.value : 0, usageUnits);

    const markupLabel = intl.formatMessage(messages.markupTitle);
    const rawLabel = intl.formatMessage(messages.rawCostTitle);
    const usageLabel = intl.formatMessage(messages.usageCostTitle);

    // Override legend label layout
    const LegendLabel = this.getLegendLabel();
    const Legend = (
      <ChartLegend
        gutter={80} // Space (width) between legend items
        itemsPerRow={2}
        labelComponent={<LegendLabel dy={10} lineHeight={1.5} values={[raw, markup, usage]} />}
        rowGutter={20}
      />
    );

    return (
      <div style={{ height: chartStyles.chartHeight, width: chartStyles.chartWidth }}>
        {reportFetchStatus === FetchStatus.inProgress ? (
          this.getSkeleton()
        ) : (
          <ChartPie
            ariaDesc={intl.formatMessage(messages.costBreakdownAriaDesc)}
            ariaTitle={intl.formatMessage(messages.costBreakdownTitle)}
            constrainToVisibleArea
            data={[
              { x: rawLabel, y: rawValue, units: rawUnits },
              { x: markupLabel, y: markupValue, units: markupUnits },
              { x: usageLabel, y: usageValue, units: usageUnits },
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
                name: rawLabel,
              },
              {
                name: markupLabel,
              },
              {
                name: usageLabel,
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

const CostChart = injectIntl(CostChartBase);

export default CostChart;
