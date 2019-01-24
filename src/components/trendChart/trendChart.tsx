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
  name: string;
}

interface TrendLegendDatum {
  colorScale?: string[];
  data?: TrendNameDatum[];
  onClick?: (props) => void;
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

  private getLegend = (datum: TrendLegendDatum, width: number) => {
    const { title } = this.props;

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
          title={title}
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

  public render() {
    const { height } = this.props;
    const { datum, width } = this.state;

    const container = <ChartVoronoiContainer labels={this.getTooltipLabel} />;

    return (
      <div className={css(styles.reportSummaryTrend)} ref={this.containerRef}>
        <div>
          <Chart containerComponent={container} height={height} width={width}>
            {Boolean(datum && datum.cost) &&
              datum.cost.charts.map((chart, index) => {
                return this.getChart(chart, index);
              })}
            <VictoryAxis style={chartStyles.axis} />
            <VictoryAxis dependentAxis style={chartStyles.axis} />
          </Chart>
        </div>
        {this.getLegend(datum && datum.cost ? datum.cost.legend : {}, width)}
      </div>
    );
  }
}

export { TrendChart, TrendChartProps };
