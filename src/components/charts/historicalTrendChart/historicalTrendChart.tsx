import {
  Chart,
  ChartArea,
  ChartAxis,
  ChartLegend,
  ChartTooltip,
  ChartVoronoiContainer,
} from '@patternfly/react-charts';
import { css } from '@patternfly/react-styles';
import {
  ChartDatum,
  getDateRange,
  getDateRangeString,
  getMaxValue,
  getMonthRangeString,
  getTooltipContent,
  getTooltipLabel,
} from 'components/charts/commonChart/chartUtils';
import getDate from 'date-fns/get_date';
import React from 'react';
import { FormatOptions, ValueFormatter } from 'utils/formatValue';
import { DomainTuple, VictoryStyleInterface } from 'victory';
import { ChartLabelTooltip } from '../chartLabelTooltip';
import { chartStyles, styles } from './historicalTrendChart.styles';

interface HistoricalTrendChartProps {
  currentData: any;
  height: number;
  previousData?: any;
  formatDatumValue: ValueFormatter;
  formatDatumOptions?: FormatOptions;
  legendItemsPerRow?: number;
  title?: string;
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
  datum?: {
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
    const { currentData, previousData } = this.props;

    // Show all legends, regardless of length -- https://github.com/project-koku/koku-ui/issues/248
    const legendData = [];
    if (previousData) {
      const [start] = getMonthRangeString(
        previousData,
        'chart.month_legend_label',
        1
      );
      legendData.push({
        name: start,
        symbol: {
          type: 'minus',
        },
        tooltip: getDateRangeString(previousData, true, true, 1),
      });
    }
    if (currentData) {
      const [start] = getMonthRangeString(
        currentData,
        'chart.month_legend_label'
      );
      legendData.push({
        name: start,
        symbol: {
          type: 'minus',
        },
        tooltip: getDateRangeString(currentData, true, false),
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
      datum: {
        charts,
        legend,
      },
    });
  };

  private handleCostLegendClick = props => {
    const { datum } = this.state;
    const newDatum = { ...datum };

    if (props.index >= 0 && newDatum.charts.length) {
      newDatum.charts[props.index].show = !newDatum.charts[props.index].show;
      this.setState({ datum: newDatum });
    }
  };

  private handleResize = () => {
    if (this.containerRef.current) {
      this.setState({ width: this.containerRef.current.clientWidth });
    }
  };

  private getChart = (datum: HistoricalChartDatum, index: number) => {
    if (datum.data && datum.data.length && datum.show) {
      return (
        <ChartArea
          data={datum.data}
          name={datum.name}
          key={`historical-trend-chart-${datum.name}-${index}`}
          style={datum.style}
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

  private getLegend = (datum: HistoricalLegendDatum, width: number) => {
    const { legendItemsPerRow } = this.props;

    if (datum && datum.data && datum.data.length) {
      return (
        <ChartLegend
          colorScale={datum.colorScale}
          data={datum.data}
          events={[
            {
              target: 'data',
              eventHandlers: {
                onClick: () => {
                  return [
                    {
                      target: 'data',
                      mutation: props => {
                        datum.onClick(props);
                        return null;
                      },
                    },
                  ];
                },
              },
            },
          ]}
          gutter={20}
          height={25}
          itemsPerRow={legendItemsPerRow}
          labelComponent={<ChartLabelTooltip content={this.getLegendTooltip} />}
          style={chartStyles.legend}
        />
      );
    } else {
      return null;
    }
  };

  private getLegendTooltip = (datum: ChartDatum) => {
    return datum.tooltip ? datum.tooltip : '';
  };

  private getTooltipLabel = (datum: ChartDatum) => {
    const { formatDatumValue, formatDatumOptions } = this.props;
    return getTooltipLabel(
      datum,
      getTooltipContent(formatDatumValue),
      formatDatumOptions,
      'date'
    );
  };

  public render() {
    const { height, title, xAxisLabel, yAxisLabel } = this.props;
    const { datum, width } = this.state;

    const container = (
      <ChartVoronoiContainer
        labelComponent={
          <ChartTooltip
            flyoutStyle={chartStyles.tooltip.flyoutStyle}
            pointerWidth={20}
            style={chartStyles.tooltip.style}
          />
        }
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
        <div className={css(styles.chart)}>
          <Chart
            containerComponent={container}
            domain={domain}
            height={height}
            width={width}
          >
            {Boolean(datum && datum.charts) &&
              datum.charts.map((chart, index) => {
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
        {Boolean(
          datum && datum.legend && datum.legend.data && datum.legend.data.length
        ) && (
          <div className={css(styles.legendContainer)}>
            <div className={css(styles.legend)}>
              {this.getLegend(datum.legend, width)}
            </div>
          </div>
        )}
      </div>
    );
  }
}

export { HistoricalTrendChart, HistoricalTrendChartProps };
