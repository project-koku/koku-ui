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
import { chartStyles, styles } from './trendChart.styles';

interface TrendChartProps {
  containerHeight?: number;
  currentData: any;
  height?: number;
  previousData?: any;
  formatDatumValue: ValueFormatter;
  formatDatumOptions?: FormatOptions;
  padding?: any;
  showUsageLegendLabel?: boolean; // The cost legend label is shown by default
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
      const label = getCostRangeString(currentData, key, true, true, 1);
      legendData.push({
        name: label,
        symbol: {
          type: 'minus',
        },
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
        orientation={width > 150 ? 'horizontal' : 'vertical'}
        style={chartStyles.legend}
      />
    );
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
    const { height, containerHeight = height, padding, title } = this.props;
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
        <div>{title}</div>
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
