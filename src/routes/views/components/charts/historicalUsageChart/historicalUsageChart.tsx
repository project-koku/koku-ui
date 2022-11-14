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
import { getDateRange, getUsageRangeTooltip } from 'routes/views/components/charts/common/chartDatum';
import { getUsageRangeString } from 'routes/views/components/charts/common/chartDatum';
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
import type { FormatOptions, Formatter } from 'utils/format';
import { noop } from 'utils/noop';

import { chartStyles, styles } from './historicalUsageChart.styles';

interface HistoricalUsageChartOwnProps {
  adjustContainerHeight?: boolean;
  containerHeight?: number;
  currentLimitData?: any;
  currentRequestData?: any;
  currentUsageData: any;
  formatOptions?: FormatOptions;
  formatter?: Formatter;
  height: number;
  legendItemsPerRow?: number;
  name?: string;
  padding?: any;
  previousLimitData?: any;
  previousRequestData?: any;
  previousUsageData?: any;
  title?: string;
  xAxisLabel?: string;
  yAxisLabel?: string;
}

interface State {
  cursorVoronoiContainer?: any;
  hiddenSeries: Set<number>;
  series?: ChartSeries[];
  width: number;
}

export type HistoricalUsageChartProps = HistoricalUsageChartOwnProps & WrappedComponentProps;

class HistoricalUsageChartBase extends React.Component<HistoricalUsageChartProps, State> {
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

  public componentDidUpdate(prevProps: HistoricalUsageChartProps) {
    if (
      prevProps.currentLimitData !== this.props.currentLimitData ||
      prevProps.currentRequestData !== this.props.currentRequestData ||
      prevProps.currentUsageData !== this.props.currentUsageData ||
      prevProps.previousLimitData !== this.props.previousLimitData ||
      prevProps.previousRequestData !== this.props.previousRequestData ||
      prevProps.previousUsageData !== this.props.previousUsageData
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
    const {
      currentLimitData,
      currentRequestData,
      currentUsageData,
      previousLimitData,
      previousRequestData,
      previousUsageData,
    } = this.props;

    const limitKey = messages.chartLimitLegendLabel;
    const limitTooltipKey = messages.chartLimitLegendTooltip;
    const requestKey = messages.chartRequestsLegendLabel;
    const requestTooltipKey = messages.chartRequestsLegendTooltip;
    const usageKey = messages.chartUsageLegendLabel;
    const usageTooltipKey = messages.chartUsageLegendTooltip;

    // Show all legends, regardless of length -- https://github.com/project-koku/koku-ui/issues/248

    const series: ChartSeries[] = [
      {
        childName: 'previousUsage',
        data: previousUsageData,
        legendItem: {
          name: getUsageRangeString(previousUsageData, usageKey, true, true, 1, messages.chartUsageLegendNoDataLabel),
          symbol: {
            fill: chartStyles.previousColorScale[0],
            type: 'minus',
          },
          tooltip: getUsageRangeTooltip(previousUsageData, usageTooltipKey, false, false, 1),
        },
        style: {
          data: {
            ...chartStyles.previousUsageData,
            stroke: chartStyles.previousColorScale[0],
          },
        },
      },
      {
        childName: 'currentUsage',
        data: currentUsageData,
        legendItem: {
          name: getUsageRangeString(currentUsageData, usageKey, true, false, 0, messages.chartUsageLegendNoDataLabel),
          symbol: {
            fill: chartStyles.currentColorScale[0],
            type: 'minus',
          },
          tooltip: getUsageRangeTooltip(currentUsageData, usageTooltipKey, false, false),
        },
        style: {
          data: {
            ...chartStyles.currentUsageData,
            stroke: chartStyles.currentColorScale[0],
          },
        },
      },
      {
        childName: 'previousRequest',
        data: previousRequestData,
        legendItem: {
          name: getUsageRangeString(
            previousRequestData,
            requestKey,
            true,
            true,
            1,
            messages.chartRequestsLegendNoDataLabel
          ),
          symbol: {
            fill: chartStyles.previousColorScale[1],
            type: 'dash',
          },
          tooltip: getUsageRangeTooltip(previousRequestData, requestTooltipKey, false, false, 1),
        },
        style: {
          data: {
            ...chartStyles.previousRequestData,
            stroke: chartStyles.previousColorScale[1],
          },
        },
      },
      {
        childName: 'currentRequest',
        data: currentRequestData,
        legendItem: {
          name: getUsageRangeString(
            currentRequestData,
            requestKey,
            true,
            false,
            0,
            messages.chartRequestsLegendNoDataLabel
          ),
          symbol: {
            fill: chartStyles.currentColorScale[1],
            type: 'dash',
          },
          tooltip: getUsageRangeTooltip(currentRequestData, requestTooltipKey, false, false),
        },
        style: {
          data: {
            ...chartStyles.currentRequestData,
            stroke: chartStyles.currentColorScale[1],
          },
        },
      },
      {
        childName: 'previousLimit',
        data: previousLimitData,
        legendItem: {
          name: getUsageRangeString(previousLimitData, limitKey, true, true, 1, messages.chartLimitLegendNoDataLabel),
          symbol: {
            fill: chartStyles.previousColorScale[2],
            type: 'minus',
          },
          tooltip: getUsageRangeTooltip(previousLimitData, limitTooltipKey, false, false, 1),
        },
        style: {
          data: {
            ...chartStyles.previousLimitData,
            stroke: chartStyles.previousColorScale[2],
          },
        },
      },
      {
        childName: 'currentLimit',
        data: currentLimitData,
        legendItem: {
          name: getUsageRangeString(currentLimitData, limitKey, true, false, 0, messages.chartLimitLegendNoDataLabel),
          symbol: {
            fill: chartStyles.currentColorScale[2],
            type: 'minus',
          },
          tooltip: getUsageRangeTooltip(currentLimitData, limitTooltipKey, false, false),
        },
        style: {
          data: {
            ...chartStyles.currentLimitData,
            stroke: chartStyles.currentColorScale[2],
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
          bottom: 130,
          left: 8,
          right: 8,
          top: 8,
        }}
      />
    );
  };

  private getEndDate() {
    const { currentRequestData, currentUsageData, previousRequestData, previousUsageData } = this.props;
    const currentRequestDate = currentRequestData ? getDate(getDateRange(currentRequestData, true, true)[1]) : 0;
    const currentUsageDate = currentUsageData ? getDate(getDateRange(currentUsageData, true, true)[1]) : 0;
    const previousRequestDate = previousRequestData ? getDate(getDateRange(previousRequestData, true, true)[1]) : 0;
    const previousUsageDate = previousUsageData ? getDate(getDateRange(previousUsageData, true, true)[1]) : 0;

    return currentRequestDate > 0 || currentUsageDate > 0 || previousRequestDate > 0 || previousUsageDate > 0
      ? Math.max(currentRequestDate, currentUsageDate, previousRequestDate, previousUsageDate)
      : 31;
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
    const itemsPerRow = legendItemsPerRow ? legendItemsPerRow : width > 925 ? chartStyles.itemsPerRow : 2;

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
        bottom: 130,
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
      ? width > 925
        ? containerHeight - 50
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
        })
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

const HistoricalUsageChart = injectIntl(HistoricalUsageChartBase);

export default HistoricalUsageChart;
