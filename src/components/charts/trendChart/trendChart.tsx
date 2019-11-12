import {
  Chart,
  ChartArea,
  ChartAxis,
  ChartLegend,
  ChartVoronoiContainer,
} from '@patternfly/react-charts';
import { css } from '@patternfly/react-styles';
import { ChartLabelTooltip } from 'components/charts/chartLabelTooltip';
import { default as ChartTheme } from 'components/charts/chartTheme';
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
import { chartStyles, styles } from './trendChart.styles';

interface TrendChartProps {
  containerHeight?: number;
  currentData: any;
  height?: number;
  previousData?: any;
  formatDatumValue: ValueFormatter;
  formatDatumOptions?: FormatOptions;
  padding?: any;
  title?: string;
  units?: string;
}

interface TrendChartDatum {
  data?: any;
  name?: string;
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
  chartDatum?: Data;
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

    this.setState({
      chartDatum: {
        charts: [
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
        ],
        legend: {
          colorScale: chartStyles.colorScale,
          data: legendData,
          onClick: this.handleCostLegendClick,
        },
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

  private getChart = (chartDatum: TrendChartDatum, index: number) => {
    if (chartDatum.data && chartDatum.data.length && chartDatum.show) {
      return (
        <ChartArea
          data={chartDatum.data}
          interpolation="basis"
          name={chartDatum.name}
          key={`trend-chart-${chartDatum.name}-${index}`}
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

  private getLegend = (chartDatum: TrendLegendDatum, width: number) => {
    if (!(chartDatum && chartDatum.data && chartDatum.data.length)) {
      return null;
    }
    const { title } = this.props;
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
        labelComponent={<ChartLabelTooltip content={this.getLegendTooltip} />}
        orientation={width > 150 ? 'horizontal' : 'vertical'}
        style={chartStyles.legend}
        title={title}
      />
    );
  };

  private getLegendTooltip = (chartDatum: ChartDatum) => {
    return chartDatum.tooltip ? chartDatum.tooltip : '';
  };

  private getTooltipLabel = ({ datum }) => {
    const { formatDatumValue, formatDatumOptions, units } = this.props;
    return getTooltipLabel(
      datum,
      getTooltipContent(formatDatumValue),
      formatDatumOptions,
      'date',
      units
    );
  };

  private isLegendVisible() {
    const { chartDatum } = this.state;

    let result = false;
    if (chartDatum && chartDatum.legend && chartDatum.legend.data) {
      chartDatum.legend.data.forEach(item => {
        if (item.name && item.name.trim() !== '') {
          result = true;
          return;
        }
      });
    }
    return result;
  }

  public render() {
    const { height, containerHeight = height, padding } = this.props;
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
    const legendVisible = this.isLegendVisible();

    return (
      <div
        className={css(styles.chartContainer)}
        ref={this.containerRef}
        style={{ height: containerHeight }}
      >
        <Chart
          containerComponent={container}
          domain={domain}
          height={height}
          legendComponent={
            legendVisible ? this.getLegend(chartDatum.legend, width) : undefined
          }
          legendData={legendVisible ? chartDatum.legend.data : undefined}
          legendPosition="bottom-left"
          padding={padding}
          theme={ChartTheme}
          width={width}
        >
          {Boolean(chartDatum) &&
            chartDatum.charts.map((chart, index) => {
              return this.getChart(chart, index);
            })}
          <ChartAxis
            style={chartStyles.xAxis}
            tickValues={[1, midDate, endDate]}
          />
          <ChartAxis dependentAxis style={chartStyles.yAxis} />
        </Chart>
      </div>
    );
  }
}

export { TrendChart, TrendChartProps };
