import {
  Chart,
  ChartArea,
  ChartAxis,
  ChartLegend,
  ChartTheme,
  ChartTooltip,
  ChartVoronoiContainer,
} from '@patternfly/react-charts';
import { css } from '@patternfly/react-styles';
import {
  ChartDatum,
  getDateRange,
  getDateRangeString,
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
  currentData: any;
  height: number;
  previousData?: any;
  formatDatumValue: ValueFormatter;
  formatDatumOptions?: FormatOptions;
  title?: string;
  xAxisLabel?: string;
  yAxisLabel?: string;
}

interface HistoricalChartDatum {
  data?: any;
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

interface Data {
  charts?: HistoricalChartDatum[];
  legend?: HistoricalLegendDatum;
}

interface State {
  datum?: {
    cost?: Data;
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
      legendData.push({
        name: getDateRangeString(previousData, true, true),
        symbol: {
          type: 'minus',
        },
      });
    }
    if (previousData) {
      legendData.push({
        name: getDateRangeString(currentData),
        symbol: {
          type: 'minus',
        },
      });
    }

    const cost = {
      charts: [
        {
          data: previousData,
          show: true,
          style: chartStyles.previousMonth,
        },
        {
          data: currentData,
          show: true,
          style: chartStyles.currentMonth,
        },
      ],
      legend: {
        colorScale: chartStyles.colorScale,
        data: legendData,
        onClick: this.handleCostLegendClick,
      },
    };

    this.setState({
      datum: {
        cost,
      },
    });
  };

  private handleCostLegendClick = props => {
    const { datum } = this.state;
    const newDatum = { ...datum };

    if (props.index >= 0 && newDatum.cost.charts.length) {
      newDatum.cost.charts[props.index].show = !newDatum.cost.charts[
        props.index
      ].show;
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
          key={`historical-trend-chart-${index}`}
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
          height={55}
          orientation="vertical"
          style={chartStyles.legend}
          theme={ChartTheme.light.blue}
          width={width}
        />
      );
    } else {
      return null;
    }
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

  private isLegendVisible() {
    const { datum } = this.state;

    let result = false;
    if (datum && datum.cost.legend && datum.cost.legend.data) {
      datum.cost.legend.data.forEach(data => {
        if (data.name && data.name.trim() !== '') {
          result = true;
          return;
        }
      });
    }
    return result;
  }

  public render() {
    const { height, title, xAxisLabel, yAxisLabel } = this.props;
    const { datum } = this.state;

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
            width={chartStyles.chartWidth}
          >
            {Boolean(datum && datum.cost) &&
              datum.cost.charts.map((chart, index) => {
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
        {Boolean(this.isLegendVisible()) && (
          <div className={css(styles.legend)}>
            {this.getLegend(datum.cost.legend, chartStyles.legendWidth)}
          </div>
        )}
      </div>
    );
  }
}

export { HistoricalTrendChart, HistoricalTrendChartProps };
