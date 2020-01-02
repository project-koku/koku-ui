import {
  Chart,
  ChartArea,
  ChartAxis,
  ChartLegend,
  ChartVoronoiContainer,
  getInteractiveLegendEvents,
  getInteractiveLegendItemStyles,
} from '@patternfly/react-charts';
import { css } from '@patternfly/react-styles';
import { default as ChartTheme } from 'components/charts/chartTheme';
import {
  getMaxValue,
  getTooltipContent,
  getTooltipLabel,
  getUsageRangeString,
} from 'components/charts/commonChart/chartUtils';
import { getDateRange } from 'components/charts/commonChart/chartUtils';
import getDate from 'date-fns/get_date';
import i18next from 'i18next';
import React from 'react';
import { FormatOptions, ValueFormatter } from 'utils/formatValue';
import { DomainTuple, VictoryStyleInterface } from 'victory';
import { chartStyles, styles } from './historicalUsageChart.styles';

interface HistoricalUsageChartProps {
  containerHeight?: number;
  currentLimitData?: any;
  currentRequestData?: any;
  currentUsageData: any;
  formatDatumValue?: ValueFormatter;
  formatDatumOptions?: FormatOptions;
  height: number;
  legendItemsPerRow?: number;
  padding?: any;
  previousLimitData?: any;
  previousRequestData?: any;
  previousUsageData?: any;
  title?: string;
  xAxisLabel?: string;
  yAxisLabel?: string;
}

interface HistoricalTrendChartData {
  name?: string;
}

interface HistoricalTrendChartLegendItem {
  name?: string;
  symbol?: any;
}

interface HistoricalTrendChartSeries {
  data?: [HistoricalTrendChartData];
  legendItem?: HistoricalTrendChartLegendItem;
  style?: VictoryStyleInterface;
}

interface State {
  hiddenSeries: Set<number>;
  series?: HistoricalTrendChartSeries[];
  width: number;
}

class HistoricalUsageChart extends React.Component<
  HistoricalUsageChartProps,
  State
> {
  private containerRef = React.createRef<HTMLDivElement>();
  public state: State = {
    hiddenSeries: new Set(),
    width: 0,
  };

  public componentDidMount() {
    setTimeout(() => {
      if (this.containerRef.current) {
        this.setState({ width: this.containerRef.current.clientWidth });
      }
      window.addEventListener('resize', this.handleResize);
    });
    this.initDatum();
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
    window.removeEventListener('resize', this.handleResize);
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

    const limitKey = 'chart.limit_legend_label';
    const usageKey = 'chart.usage_legend_label';
    const requestKey = 'chart.requests_legend_label';

    // Show all legends, regardless of length -- https://github.com/project-koku/koku-ui/issues/248

    this.setState({
      series: [
        {
          data: previousUsageData,
          legendItem: {
            name: getUsageRangeString(
              previousUsageData,
              usageKey,
              true,
              true,
              1
            ),
            symbol: {
              type: 'minus',
            },
          },
          style: chartStyles.previousUsageData,
        },
        {
          data: currentUsageData,
          legendItem: {
            name: getUsageRangeString(currentUsageData, usageKey, true, false),
            symbol: {
              type: 'minus',
            },
          },
          style: chartStyles.currentUsageData,
        },
        {
          data: previousRequestData,
          legendItem: {
            name: getUsageRangeString(
              previousRequestData,
              requestKey,
              true,
              true,
              1
            ),
            symbol: {
              type: 'dash',
            },
          },
          style: chartStyles.previousRequestData,
        },
        {
          data: currentRequestData,
          legendItem: {
            name: getUsageRangeString(
              currentRequestData,
              requestKey,
              true,
              false
            ),
            symbol: {
              type: 'dash',
            },
          },
          style: chartStyles.currentRequestData,
        },
        {
          data: previousLimitData,
          legendItem: {
            name: getUsageRangeString(
              previousLimitData,
              limitKey,
              true,
              true,
              1
            ),
            symbol: {
              type: 'minus',
            },
          },
          style: chartStyles.previousLimitData,
        },
        {
          data: currentLimitData,
          legendItem: {
            name: getUsageRangeString(currentLimitData, limitKey, true, false),
            symbol: {
              type: 'minus',
            },
          },
          style: chartStyles.currentLimitData,
        },
      ],
    });
  };

  private handleResize = () => {
    if (this.containerRef.current) {
      this.setState({ width: this.containerRef.current.clientWidth });
    }
  };

  private getChart = (series: HistoricalTrendChartSeries, index: number) => {
    const { hiddenSeries } = this.state;
    return (
      <ChartArea
        data={!hiddenSeries.has(index) ? series.data : [{ y: null }]}
        interpolation="monotoneX"
        key={'area-' + index}
        name={'area-' + index}
        style={series.style}
      />
    );
  };

  private getDomain() {
    const {
      currentRequestData,
      currentUsageData,
      currentLimitData,
      previousLimitData,
      previousRequestData,
      previousUsageData,
    } = this.props;
    const domain: { x: DomainTuple; y?: DomainTuple } = { x: [1, 31] };

    const maxCurrentLimit = currentLimitData
      ? getMaxValue(currentLimitData)
      : 0;
    const maxCurrentRequest = currentRequestData
      ? getMaxValue(currentRequestData)
      : 0;
    const maxCurrentUsage = currentUsageData
      ? getMaxValue(currentUsageData)
      : 0;
    const maxPreviousLimit = previousLimitData
      ? getMaxValue(previousLimitData)
      : 0;
    const maxPreviousRequest = previousRequestData
      ? getMaxValue(previousRequestData)
      : 0;
    const maxPreviousUsage = previousUsageData
      ? getMaxValue(previousUsageData)
      : 0;
    const maxValue = Math.max(
      maxCurrentLimit,
      maxCurrentRequest,
      maxCurrentUsage,
      maxPreviousLimit,
      maxPreviousRequest,
      maxPreviousUsage
    );
    const max = maxValue > 0 ? Math.ceil(maxValue + maxValue * 0.1) : 0;

    if (max > 0) {
      domain.y = [0, max];
    }
    return domain;
  }

  private getEndDate() {
    const {
      currentRequestData,
      currentUsageData,
      previousRequestData,
      previousUsageData,
    } = this.props;
    const currentRequestDate = currentRequestData
      ? getDate(getDateRange(currentRequestData, true, true)[1])
      : 0;
    const currentUsageDate = currentUsageData
      ? getDate(getDateRange(currentUsageData, true, true)[1])
      : 0;
    const previousRequestDate = previousRequestData
      ? getDate(getDateRange(previousRequestData, true, true)[1])
      : 0;
    const previousUsageDate = previousUsageData
      ? getDate(getDateRange(previousUsageData, true, true)[1])
      : 0;

    return currentRequestDate > 0 ||
      currentUsageDate > 0 ||
      previousRequestDate > 0 ||
      previousUsageDate > 0
      ? Math.max(
          currentRequestDate,
          currentUsageDate,
          previousRequestDate,
          previousUsageDate
        )
      : 31;
  }

  private getLegend = () => {
    const { width } = this.state;
    const { legendItemsPerRow } = this.props;
    const itemsPerRow = legendItemsPerRow
      ? legendItemsPerRow
      : width > 800
      ? chartStyles.itemsPerRow
      : 2;

    return (
      <ChartLegend
        colorScale={chartStyles.legendColorScale}
        data={this.getLegendData()}
        gutter={0}
        height={25}
        itemsPerRow={itemsPerRow}
        name="legend"
        style={chartStyles.legend}
      />
    );
  };

  private getTooltipLabel = ({ datum }) => {
    if (!(datum.childName.includes('area-') && datum.y !== null)) {
      return null;
    }

    const { formatDatumValue, formatDatumOptions } = this.props;
    const value = getTooltipLabel(
      datum,
      getTooltipContent(formatDatumValue),
      formatDatumOptions,
      'date'
    );

    if (
      datum.childName === 'currentLimit' ||
      datum.childName === 'previousLimit'
    ) {
      return i18next.t('chart.limit_tooltip', { value });
    } else if (
      datum.childName === 'currentRequest' ||
      datum.childName === 'previousRequest'
    ) {
      return i18next.t('chart.requests_tooltip', { value });
    } else if (
      datum.childName === 'currentUsage' ||
      datum.childName === 'previousUsage'
    ) {
      return i18next.t('chart.usage_tooltip', { value });
    }
    return value;
  };

  // Interactive legend

  // Hide each data series individually
  private handleLegendClick = props => {
    if (!this.state.hiddenSeries.delete(props.index)) {
      this.state.hiddenSeries.add(props.index);
    }
    this.setState({ hiddenSeries: new Set(this.state.hiddenSeries) });
  };

  // Returns true if data series is hidden
  private isHidden = index => {
    const { hiddenSeries } = this.state; // Skip if already hidden
    return hiddenSeries.has(index);
  };

  // Returns groups of chart names associated with each data series
  private getChartNames = () => {
    const { series } = this.state;
    const result = [];
    if (series) {
      series.map((_, index) => {
        // Each group of chart names are hidden / shown together
        result.push(`area-${index}`);
      });
    }
    return result as any;
  };

  // Returns onMouseOver, onMouseOut, and onClick events for the interactive legend
  private getEvents = () => {
    const result = getInteractiveLegendEvents({
      chartNames: this.getChartNames(),
      isHidden: this.isHidden,
      legendName: 'legend',
      onLegendClick: this.handleLegendClick,
    });
    return result;
  };

  // Returns legend data styled per hiddenSeries
  private getLegendData = () => {
    const { hiddenSeries, series } = this.state;
    if (series) {
      const result = series.map((s, index) => {
        return {
          ...s.legendItem, // name property
          ...getInteractiveLegendItemStyles(hiddenSeries.has(index)), // hidden styles
        };
      });
      return result;
    }
  };

  public render() {
    const {
      height,
      containerHeight = height,
      padding,
      title,
      xAxisLabel,
      yAxisLabel,
    } = this.props;
    const { hiddenSeries, series, width } = this.state;

    const allHidden =
      (hiddenSeries ? hiddenSeries.size : 0) === (series ? series.length : 0);

    const container = (
      <ChartVoronoiContainer
        allowTooltip={!allHidden}
        constrainToVisibleArea
        labels={!allHidden ? this.getTooltipLabel : undefined}
        voronoiDimension="x"
      />
    );
    const domain = this.getDomain();
    const endDate = this.getEndDate();
    const midDate = Math.floor(endDate / 2);

    return (
      <div className={css(styles.chartContainer)} ref={this.containerRef}>
        <div className={css(styles.title)}>{title}</div>
        <div className={css(styles.chart)} style={{ height: containerHeight }}>
          <Chart
            containerComponent={container}
            domain={domain}
            events={this.getEvents()}
            height={height}
            legendComponent={this.getLegend()}
            legendData={this.getLegendData()}
            legendPosition="bottom"
            padding={padding}
            theme={ChartTheme}
            width={width}
          >
            {series &&
              series.map((s, index) => {
                return this.getChart(s, index);
              })}
            <ChartAxis
              label={xAxisLabel}
              style={chartStyles.xAxis}
              tickValues={[1, midDate, endDate]}
            />
            <ChartAxis
              dependentAxis
              label={yAxisLabel}
              style={chartStyles.yAxis}
            />
          </Chart>
        </div>
      </div>
    );
  }
}

export { HistoricalUsageChart, HistoricalUsageChartProps };
