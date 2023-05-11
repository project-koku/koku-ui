import 'routes/views/components/charts/common/chart.scss';

import {
  Chart,
  ChartArea,
  ChartAxis,
  ChartLegend,
  ChartLegendTooltip,
  createContainer,
  getInteractiveLegendEvents,
} from '@patternfly/react-charts';
import { Title, TitleSizes } from '@patternfly/react-core';
import { getDate } from 'date-fns';
import messages from 'locales/messages';
import React from 'react';
import type { WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';
import { default as ChartTheme } from 'routes/views/components/charts/chartTheme';
import { getCostRangeString, getCostRangeTooltip } from 'routes/views/components/charts/common/chartDatum';
import { getDateRange } from 'routes/views/components/charts/common/chartDatum';
import type { ChartSeries } from 'routes/views/components/charts/common/chartUtils';
import {
  getChartNames,
  getDomain,
  getLegendData,
  getResizeObserver,
  getTooltipLabel,
  initHiddenSeries,
  isDataAvailable,
  isSeriesHidden,
} from 'routes/views/components/charts/common/chartUtils';
import { noop } from 'routes/views/utils/noop';
import type { FormatOptions, Formatter } from 'utils/format';

import { chartStyles, styles } from './historicalCostChart.styles';

interface HistoricalCostChartOwnProps {
  adjustContainerHeight?: boolean;
  containerHeight?: number;
  currentCostData?: any;
  currentInfrastructureCostData?: any;
  formatOptions?: FormatOptions;
  formatter?: Formatter;
  height: number;
  legendItemsPerRow?: number;
  name?: string;
  padding?: any;
  previousCostData?: any;
  previousInfrastructureCostData?: any;
  title?: string;
  xAxisLabel?: string;
  yAxisLabel?: string;
}

interface State {
  cursorVoronoiContainer?: any;
  hiddenSeries?: Set<number>;
  series?: ChartSeries[];
  width?: number;
}

export type HistoricalCostChartProps = HistoricalCostChartOwnProps & WrappedComponentProps;

class HistoricalCostChartBase extends React.Component<HistoricalCostChartProps, State> {
  private containerRef = React.createRef<HTMLDivElement>();
  private observer: any = noop;

  public state: State = {
    hiddenSeries: new Set(),
    width: 0,
  };

  public componentDidMount() {
    this.initDatum();
    this.observer = getResizeObserver(this.containerRef.current, this.handleResize);
  }

  public componentDidUpdate(prevProps: HistoricalCostChartProps) {
    if (
      prevProps.currentCostData !== this.props.currentCostData ||
      prevProps.currentInfrastructureCostData !== this.props.currentInfrastructureCostData ||
      prevProps.previousCostData !== this.props.previousCostData ||
      prevProps.previousInfrastructureCostData !== this.props.previousInfrastructureCostData
    ) {
      this.initDatum();
    }
  }

  public componentWillUnmount() {
    if (this.observer) {
      this.observer();
    }
  }

  private initDatum = () => {
    const { currentCostData, previousCostData } = this.props;

    const costKey = messages.chartCostLegendLabel;
    const costTooltipKey = messages.chartCostLegendTooltip;

    // Show all legends, regardless of length -- https://github.com/project-koku/koku-ui/issues/248

    const series: ChartSeries[] = [
      {
        childName: 'previousCost',
        data: previousCostData,
        legendItem: {
          name: getCostRangeString(previousCostData, costKey, true, true, 1, messages.chartCostLegendNoDataLabel),
          symbol: {
            fill: chartStyles.previousColorScale[0],
            type: 'minus',
          },
          tooltip: getCostRangeTooltip(previousCostData, costTooltipKey, false, false, 1),
        },
        style: {
          data: {
            ...chartStyles.previousCostData,
            stroke: chartStyles.previousColorScale[0],
          },
        },
      },
      {
        childName: 'currentCost',
        data: currentCostData,
        legendItem: {
          name: getCostRangeString(currentCostData, costKey, true, false, 0, messages.chartCostLegendNoDataLabel),
          symbol: {
            fill: chartStyles.currentColorScale[0],
            type: 'minus',
          },
          tooltip: getCostRangeTooltip(currentCostData, costTooltipKey, false, false),
        },
        style: {
          data: {
            ...chartStyles.currentCostData,
            stroke: chartStyles.currentColorScale[0],
          },
        },
      },
    ];
    const cursorVoronoiContainer = this.getCursorVoronoiContainer();
    this.setState({ cursorVoronoiContainer, series });
  };

  private getChart = (series: ChartSeries, index: number) => {
    const { hiddenSeries } = this.state;
    return (
      <ChartArea
        data={!hiddenSeries.has(index) ? series.data : [{ y: null }]}
        interpolation="monotoneX"
        key={series.childName}
        name={series.childName}
        style={series.style}
      />
    );
  };

  // Returns CursorVoronoiContainer component
  private getCursorVoronoiContainer = () => {
    const { formatter, formatOptions } = this.props;

    // Note: Container order is important
    const CursorVoronoiContainer: any = createContainer('voronoi', 'cursor');

    return (
      <CursorVoronoiContainer
        cursorDimension="x"
        labels={({ datum }) => getTooltipLabel(datum, formatter, formatOptions)}
        mouseFollowTooltips
        voronoiDimension="x"
        voronoiPadding={{
          bottom: 120,
          left: 8,
          right: 8,
          top: 8,
        }}
      />
    );
  };

  private getEndDate() {
    const { currentInfrastructureCostData, previousInfrastructureCostData } = this.props;
    const currentRequestDate = currentInfrastructureCostData
      ? getDate(getDateRange(currentInfrastructureCostData, true, true)[1])
      : 0;
    const previousRequestDate = previousInfrastructureCostData
      ? getDate(getDateRange(previousInfrastructureCostData, true, true)[1])
      : 0;

    return currentRequestDate > 0 || previousRequestDate > 0 ? Math.max(currentRequestDate, previousRequestDate) : 31;
  }

  // Returns onMouseOver, onMouseOut, and onClick events for the interactive legend
  private getEvents() {
    const { name = '' } = this.props;
    const { hiddenSeries, series } = this.state;

    const result = getInteractiveLegendEvents({
      chartNames: getChartNames(series),
      isHidden: index => isSeriesHidden(hiddenSeries, index),
      legendName: `${name}-legend`,
      onLegendClick: props => this.handleLegendClick(props.index),
    });
    return result;
  }

  private getLegend = () => {
    const { legendItemsPerRow, name = '' } = this.props;
    const { hiddenSeries, series, width } = this.state;

    const itemsPerRow = legendItemsPerRow ? legendItemsPerRow : width > 725 ? chartStyles.itemsPerRow : 2;

    return (
      <ChartLegend
        data={getLegendData(series, hiddenSeries)}
        height={25}
        gutter={20}
        itemsPerRow={itemsPerRow}
        name={`${name}-legend`}
      />
    );
  };

  // Hide each data series individually
  private handleLegendClick = (index: number) => {
    const hiddenSeries = initHiddenSeries(this.state.series, this.state.hiddenSeries, index);
    this.setState({ hiddenSeries });
  };

  private handleResize = () => {
    const { width } = this.state;
    const { clientWidth = 0 } = this.containerRef.current || {};

    if (clientWidth !== width) {
      this.setState({ width: clientWidth });
    }
  };

  public render() {
    const {
      adjustContainerHeight,
      height,
      containerHeight = height,
      intl,
      name,
      padding = {
        bottom: 120,
        left: 8,
        right: 8,
        top: 8,
      },
      title,
      xAxisLabel,
      yAxisLabel,
    } = this.props;
    const { cursorVoronoiContainer, hiddenSeries, series, width } = this.state;
    const domain = getDomain(series, hiddenSeries);
    const endDate = this.getEndDate();
    const midDate = Math.floor(endDate / 2);

    const adjustedContainerHeight = adjustContainerHeight
      ? width > 725
        ? containerHeight - 25
        : containerHeight
      : containerHeight;

    // Clone original container. See https://issues.redhat.com/browse/COST-762
    const container = cursorVoronoiContainer
      ? React.cloneElement(cursorVoronoiContainer, {
          disable: !isDataAvailable(series, hiddenSeries),
          labelComponent: (
            <ChartLegendTooltip
              legendData={getLegendData(series, hiddenSeries, true)}
              title={datum => intl.formatMessage(messages.chartDayOfTheMonth, { day: datum.x })}
            />
          ),
        } as any)
      : undefined;
    return (
      <div className="chartOverride" ref={this.containerRef}>
        <Title headingLevel="h2" style={styles.title} size={TitleSizes.xl}>
          {title}
        </Title>
        <div style={{ ...styles.chart, height: adjustedContainerHeight }}>
          <div style={{ height, width }} data-testid="historical-chart-wrapper">
            <Chart
              containerComponent={container}
              domain={domain}
              events={this.getEvents()}
              height={height}
              legendComponent={this.getLegend()}
              legendData={getLegendData(series, hiddenSeries)}
              legendPosition="bottom"
              name={name}
              padding={padding}
              theme={ChartTheme}
              width={width}
            >
              {series &&
                series.map((s, index) => {
                  return this.getChart(s, index);
                })}
              <ChartAxis label={xAxisLabel} style={chartStyles.xAxis} tickValues={[1, midDate, endDate]} />
              <ChartAxis dependentAxis label={yAxisLabel} style={chartStyles.yAxis} />
            </Chart>
          </div>
        </div>
      </div>
    );
  }
}

const HistoricalCostChart = injectIntl(HistoricalCostChartBase);

export default HistoricalCostChart;
