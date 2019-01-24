import {
  Chart,
  ChartArea,
  // ChartLegend,
  ChartTheme,
  ChartVoronoiContainer,
} from '@patternfly/react-charts';
import { css } from '@patternfly/react-styles';
import {
  ChartDatum,
  getDateRangeString,
  getTooltipContent,
  getTooltipLabel,
} from 'components/commonChart/chartUtils';
import React from 'react';
import { FormatOptions, ValueFormatter } from 'utils/formatValue';
import { VictoryAxis, VictoryLegend, VictoryStyleInterface } from 'victory';
import { chartStyles, styles } from './historicalTrendChart.styles';

interface HistoricalTrendChartProps {
  title?: string;
  height: number;
  currentData: any;
  previousData?: any;
  formatDatumValue: ValueFormatter;
  formatDatumOptions?: FormatOptions;
  xAxisLabel?: string;
  yAxisLabel?: string;
}

interface HistoricalChartDatum {
  data?: any;
  show?: boolean;
  style?: VictoryStyleInterface;
}

interface HistoricalNameDatum {
  name: string;
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

    const legendData = [];
    if (previousData && previousData.length) {
      legendData.push({
        name: getDateRangeString(previousData, true, true),
      });
    }
    if (currentData && currentData.length) {
      legendData.push({
        name: getDateRangeString(currentData),
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
    this.setState({ width: this.containerRef.current.clientWidth });
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

  private getLegend = (datum: HistoricalLegendDatum, width: number) => {
    if (datum && datum.data && datum.data.length) {
      return (
        <VictoryLegend
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
          height={50}
          theme={ChartTheme.light.blue}
          width={width}
        />
      );
    } else {
      return null;
    }
  };

  public render() {
    const { title, height, xAxisLabel, yAxisLabel } = this.props;
    const { datum, width } = this.state;

    const container = <ChartVoronoiContainer labels={this.getTooltipLabel} />;

    return (
      <div className={css(styles.reportSummaryTrend)} ref={this.containerRef}>
        <span>{title}</span>
        <Chart containerComponent={container} height={height} width={width}>
          {Boolean(datum && datum.cost) &&
            datum.cost.charts.map((chart, index) => {
              return this.getChart(chart, index);
            })}
          <VictoryAxis label={xAxisLabel} style={chartStyles.axis} />
          <VictoryAxis
            dependentAxis
            label={yAxisLabel}
            style={chartStyles.axis}
          />
        </Chart>
        <div className={css(styles.legendContainer)}>
          {this.getLegend(datum && datum.cost ? datum.cost.legend : {}, width)}
        </div>
      </div>
    );
  }
}

export { HistoricalTrendChart, HistoricalTrendChartProps };
