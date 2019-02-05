import {
  Chart,
  ChartArea,
  ChartContainer,
  ChartLegend,
  ChartTheme,
  ChartVoronoiContainer,
} from '@patternfly/react-charts';
import { css } from '@patternfly/react-styles';
import {
  ChartDatum,
  getDateRangeString,
  getMaxValue,
  getTooltipContent,
  getTooltipLabel,
} from 'components/commonChart/chartUtils';
import getDate from 'date-fns/get_date';
import React from 'react';
import { FormatOptions, ValueFormatter } from 'utils/formatValue';
import { DomainTuple, VictoryAxis, VictoryStyleInterface } from 'victory';
import { getDateRange } from '../commonChart/chartUtils';
import { chartStyles, styles } from './trendChart.styles';

interface TrendChartProps {
  title?: string;
  height: number;
  currentData: any;
  previousData?: any;
  formatDatumValue: ValueFormatter;
  formatDatumOptions?: FormatOptions;
}

interface TrendChartDatum {
  data?: any;
  show?: boolean;
  style?: VictoryStyleInterface;
}

interface TrendNameDatum {
  name?: string;
}

interface TrendLegendDatum {
  colorScale?: string[];
  data?: TrendNameDatum[];
  onClick?: (props) => void;
  title?: string;
}

interface Data {
  charts?: TrendChartDatum[];
  legend?: TrendLegendDatum;
}

interface State {
  datum?: {
    cost?: Data;
  };
  width: number;
}

class TrendChart extends React.Component<TrendChartProps, State> {
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

  public componentDidUpdate(prevProps: TrendChartProps) {
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
    const { currentData, previousData, title } = this.props;

    const legendData = [];
    if (previousData && previousData.length) {
      legendData.push({
        name: getDateRangeString(previousData, true, true),
        symbol: {
          type: 'minus',
        },
      });
    }
    if (currentData && currentData.length) {
      legendData.push({
        name: getDateRangeString(currentData, true, false, true),
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
        title,
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

  private getChart = (datum: TrendChartDatum, index: number) => {
    if (datum.data && datum.data.length && datum.show) {
      return (
        <ChartArea
          data={datum.data}
          key={`trend-chart-${index}`}
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

  private getLegend = (datum: TrendLegendDatum, width: number) => {
    if (datum && datum.data && datum.data.length) {
      return (
        <ChartLegend
          colorScale={datum.colorScale}
          containerComponent={<ChartContainer responsive={false} />}
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
          gutter={5}
          height={50}
          orientation={width > 150 ? 'horizontal' : 'vertical'}
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
      datum.cost.legend.data.forEach(item => {
        if (item.name && item.name.trim() !== '') {
          result = true;
          return;
        }
      });
    }
    return result;
  }

  public render() {
    const { height } = this.props;
    const { datum, width } = this.state;

    const container = <ChartVoronoiContainer labels={this.getTooltipLabel} />;
    const legendWidth =
      styles.legend.minWidth > width / 2
        ? styles.legendContainer.minWidth
        : width / 2;
    const domain = this.getDomain();

    const endDate = this.getEndDate();
    const midDate = Math.floor(endDate / 2);

    return (
      <div className={css(styles.chartContainer)} ref={this.containerRef}>
        <Chart
          containerComponent={container}
          domain={domain}
          height={height}
          width={width}
        >
          {Boolean(datum && datum.cost) &&
            datum.cost.charts.map((chart, index) => {
              return this.getChart(chart, index);
            })}
          <VictoryAxis
            style={chartStyles.xAxis}
            tickValues={[1, midDate, endDate]}
          />
          <VictoryAxis dependentAxis style={chartStyles.yAxis} />
        </Chart>
        {Boolean(this.isLegendVisible()) && (
          <div className={css(styles.legend)}>
            {Boolean(datum.cost.legend.title) && (
              <div>{datum.cost.legend.title}</div>
            )}
            {this.getLegend(datum.cost.legend, legendWidth)}
          </div>
        )}
      </div>
    );
  }
}

export { TrendChart, TrendChartProps };
