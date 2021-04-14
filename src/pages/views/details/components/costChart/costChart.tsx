import { ChartLabel, ChartLegend, ChartPie, ChartThemeColor } from '@patternfly/react-charts';
import { Skeleton } from '@patternfly/react-core';
import { Report } from 'api/reports/report';
import React from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import { FetchStatus } from 'store/common';
import { reportActions } from 'store/reports';
import { formatValue } from 'utils/formatValue';
import { skeletonWidth } from 'utils/skeleton';

import { chartStyles, styles } from './costChart.styles';

interface CostChartOwnProps {
  report: Report;
}

interface CostChartStateProps {
  report?: Report;
  reportFetchStatus?: FetchStatus;
}

interface CostChartDispatchProps {
  fetchReport?: typeof reportActions.fetchReport;
}

type CostChartProps = CostChartOwnProps & CostChartStateProps & CostChartDispatchProps & WithTranslation;

class CostChartBase extends React.Component<CostChartProps> {
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
    const { report, reportFetchStatus, t } = this.props;

    const hasCost = report && report.meta && report.meta.total && report.meta.total.cost;
    const hasMarkup = hasCost && report.meta.total.cost.markup;
    const hasRaw = hasCost && report.meta.total.cost.raw;
    const hasUsage = hasCost && report.meta.total.cost.usage;

    const markupUnits = hasMarkup ? report.meta.total.cost.markup.units : 'USD';
    const rawUnits = hasRaw ? report.meta.total.cost.raw.units : 'USD';
    const usageUnits = hasUsage ? report.meta.total.cost.usage.units : 'USD';

    const markupValue = hasMarkup ? report.meta.total.cost.markup.value : 0;
    const rawValue = hasRaw ? report.meta.total.cost.raw.value : 0;
    const usageValue = hasUsage ? report.meta.total.cost.usage.value : 0;

    const markup = formatValue(hasMarkup ? report.meta.total.cost.markup.value : 0, markupUnits);
    const raw = formatValue(hasRaw ? report.meta.total.cost.raw.value : 0, rawUnits);
    const usage = formatValue(hasUsage ? report.meta.total.cost.usage.value : 0, usageUnits);

    const markupLabel = t('breakdown.cost_chart.markup_label');
    const rawLabel = t('breakdown.cost_chart.raw_label');
    const usageLabel = t('breakdown.cost_chart.usage_label');

    // Override legend label layout
    const LegendLabel = this.getLegendLabel();
    const Legend = (
      <ChartLegend
        gutter={25}
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
            ariaDesc={t('breakdown.cost_chart.aria_desc')}
            ariaTitle={t('breakdown.cost_chart.aria_title')}
            constrainToVisibleArea
            data={[
              { x: rawLabel, y: rawValue, units: rawUnits },
              { x: markupLabel, y: markupValue, units: markupUnits },
              { x: usageLabel, y: usageValue, units: usageUnits },
            ]}
            height={chartStyles.chartHeight}
            labels={({ datum }) =>
              t('breakdown.cost_chart.tooltip', {
                name: datum.x,
                value: formatValue(datum.y, datum.units),
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
            padding={{
              bottom: 20,
              left: 0,
              right: 225, // Adjusted to accommodate legend
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

const CostChart = withTranslation()(CostChartBase);

export { CostChart, CostChartProps };
