import {
  Chart,
  ChartArea,
  ChartAxis,
  ChartLegend,
  ChartVoronoiContainer,
} from '@patternfly/react-charts';
import { css } from '@patternfly/react-styles';
import { default as ChartTheme } from 'components/charts/chartTheme';
import {
  getCostRangeString,
  getDateRange,
  getMaxValue,
  getTooltipContent,
  getTooltipLabel,
} from 'components/charts/commonChart/chartUtils';
import getDate from 'date-fns/get_date';
import React from 'react';
import { FormatOptions, ValueFormatter } from 'utils/formatValue';
import { DomainTuple, VictoryStyleInterface } from 'victory';
import { chartStyles, styles } from './historicalTrendChart.styles';

interface HistoricalTrendChartProps {
  containerHeight?: number;
  currentData: any;
  height: number;
  padding?: any;
  previousData?: any;
  formatDatumValue: ValueFormatter;
  formatDatumOptions?: FormatOptions;
  legendItemsPerRow?: number;
  title?: string;
  showUsageLegendLabel?: boolean;
  xAxisLabel?: string;
  yAxisLabel?: string;
}

interface HistoricalChartDatum {
  data?: any;
  name?: string;
  show?: boolean;
  style?: VictoryStyleInterface;
}

interface HistoricalNameDatum {
  name?: string;
}

interface HistoricalLegendDatum {
  colorScale?: string[];
  data?: HistoricalNameDatum[];
  onClick?: (props) => void;
}

interface State {
  chartDatum?: {
    charts?: HistoricalChartDatum[];
    legend?: HistoricalLegendDatum;
  };
  width: number;
}

class HistoricalTrendChart extends React.Component<
  HistoricalTrendChartProps,
  State
> {
  private containerRef = React.createRef<HTMLDivElement>();
  public state: State = {
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

  public componentDidUpdate(prevProps: HistoricalTrendChartProps) {
    if (
      prevProps.currentData !== this.props.currentData ||
      prevProps.previousData !== this.props.previousData
    ) {
      this.initDatum();
    }
  }

  public componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }

  private initDatum = () => {
    const {
      currentData,
      previousData,
      showUsageLegendLabel = false,
    } = this.props;

    // Show all legends, regardless of length -- https://github.com/project-koku/koku-ui/issues/248
    const legendData = [];
    const key = showUsageLegendLabel
      ? 'chart.usage_legend_label'
      : 'chart.cost_legend_label';

    if (previousData) {
      const label = getCostRangeString(previousData, key, true, true, 1);
      legendData.push({
        name: label,
        symbol: {
          type: 'minus',
        },
      });
    }
    if (currentData) {
      const label = getCostRangeString(currentData, key, true, false);
      legendData.push({
        name: label,
        symbol: {
          type: 'minus',
        },
      });
    }

    const charts = [
      {
        data: previousData,
        name: 'previous',
        show: true,
        style: chartStyles.previousMonth,
      },
      {
        data: currentData,
        name: 'current',
        show: true,
        style: chartStyles.currentMonth,
      },
    ];

    const legend = {
      colorScale: chartStyles.colorScale,
      data: legendData,
      onClick: this.handleCostLegendClick,
    };

    this.setState({
      chartDatum: {
        charts,
        legend,
      },
    });
  };

  private handleCostLegendClick = props => {
    const { chartDatum } = this.state;
    const newDatum = { ...chartDatum };

    if (props.index >= 0 && newDatum.charts.length) {
      newDatum.charts[props.index].show = !newDatum.charts[props.index].show;
      this.setState({ chartDatum: newDatum });
    }
  };

  private handleResize = () => {
    if (this.containerRef.current) {
      this.setState({ width: this.containerRef.current.clientWidth });
    }
  };

  private getChart = (chartDatum: HistoricalChartDatum, index: number) => {
    if (chartDatum.data && chartDatum.data.length && chartDatum.show) {
      return (
        <ChartArea
          data={chartDatum.data}
          interpolation="basis"
          name={chartDatum.name}
          key={`historical-trend-chart-${chartDatum.name}-${index}`}
          style={chartDatum.style}
        />
      );
    } else {
      return null;
    }
  };

  private getDomain() {
    const { currentData, previousData } = this.props;
    const domain: { x: DomainTuple; y?: DomainTuple } = { x: [1, 31] };

    const maxCurrent = currentData ? getMaxValue(currentData) : 0;
    const maxPrevious = previousData ? getMaxValue(previousData) : 0;
    const maxValue = Math.max(maxCurrent, maxPrevious);
    const max = maxValue > 0 ? Math.ceil(maxValue + maxValue * 0.1) : 0;

    if (max > 0) {
      domain.y = [0, max];
    }
    return domain;
  }

  private getEndDate() {
    const { currentData, previousData } = this.props;
    const previousDate = previousData
      ? getDate(getDateRange(previousData, true, true)[1])
      : 0;
    const currentDate = currentData
      ? getDate(getDateRange(currentData, true, true)[1])
      : 0;

    return currentDate > 0 || previousDate > 0
      ? Math.max(currentDate, previousDate)
      : 31;
  }

  private getLegend = (chartDatum: HistoricalLegendDatum, width: number) => {
    const { legendItemsPerRow } = this.props;

    if (chartDatum && chartDatum.data && chartDatum.data.length) {
      const eventHandlers = {
        onClick: () => {
          return [
            {
              target: 'data',
              mutation: props => {
                chartDatum.onClick(props);
                return null;
              },
            },
          ];
        },
      };
      return (
        <ChartLegend
          colorScale={chartDatum.colorScale}
          data={chartDatum.data}
          events={
            [
              {
                target: 'data',
                eventHandlers,
              },
              {
                target: 'labels',
                eventHandlers,
              },
            ] as any
          }
          gutter={20}
          height={25}
          itemsPerRow={legendItemsPerRow}
          style={chartStyles.legend}
        />
      );
    } else {
      return null;
    }
  };

  private getTooltipLabel = ({ datum }) => {
    const { formatDatumValue, formatDatumOptions } = this.props;
    return getTooltipLabel(
      datum,
      getTooltipContent(formatDatumValue),
      formatDatumOptions,
      'date'
    );
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
    const { chartDatum, width } = this.state;

    const container = (
      <ChartVoronoiContainer
        constrainToVisibleArea
        labels={this.getTooltipLabel}
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
            height={height}
            legendComponent={
              chartDatum ? this.getLegend(chartDatum.legend, width) : undefined
            }
            legendData={chartDatum ? chartDatum.legend.data : undefined}
            legendPosition="bottom"
            padding={padding}
            theme={ChartTheme}
            width={width}
          >
            {Boolean(chartDatum && chartDatum.charts) &&
              chartDatum.charts.map((chart, index) => {
                return this.getChart(chart, index);
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

export { HistoricalTrendChart, HistoricalTrendChartProps };
