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
  getTooltipContent,
  getTooltipLabel,
} from 'components/commonChart/chartUtils';
import React from 'react';
import { FormatOptions, ValueFormatter } from 'utils/formatValue';
import { VictoryAxis, VictoryLegend, VictoryStyleInterface } from 'victory';
import { chartStyles, styles } from './historicalUsageChart.styles';

interface HistoricalUsageChartProps {
  currentCapacityData?: any;
  currentCapacityLabel?: string;
  currentLimitData?: any;
  currentLimitLabel?: string;
  currentRequestData?: any;
  currentRequestLabel?: string;
  currentUsageData: any;
  currentUsageLabel?: string;
  formatDatumValue?: ValueFormatter;
  formatDatumOptions?: FormatOptions;
  height: number;
  previousCapacityData?: any;
  previousCapacityLabel?: string;
  previousLimitData?: any;
  previousLimitLabel?: string;
  previousRequestData?: any;
  previousRequestLabel?: string;
  previousUsageData?: any;
  previousUsageLabel?: string;
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
    capacity?: Data;
    limit?: Data;
    request?: Data;
    usage?: Data;
  };
  width: number;
}

class HistoricalUsageChart extends React.Component<
  HistoricalUsageChartProps,
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

  public componentDidUpdate(prevProps: HistoricalUsageChartProps) {
    if (
      prevProps.currentCapacityData !== this.props.currentCapacityData ||
      prevProps.currentLimitData !== this.props.currentLimitData ||
      prevProps.currentRequestData !== this.props.currentRequestData ||
      prevProps.currentUsageData !== this.props.currentUsageData ||
      prevProps.previousCapacityData !== this.props.previousCapacityData ||
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
      currentCapacityData,
      currentCapacityLabel,
      currentLimitData,
      currentLimitLabel,
      currentRequestData,
      currentRequestLabel,
      currentUsageData,
      currentUsageLabel,
      previousCapacityData,
      previousCapacityLabel,
      previousLimitData,
      previousLimitLabel,
      previousRequestData,
      previousRequestLabel,
      previousUsageData,
      previousUsageLabel,
    } = this.props;

    const capacityLegendData = [];
    if (previousCapacityLabel) {
      capacityLegendData.push({
        name: previousCapacityLabel,
      });
    }
    if (currentCapacityLabel) {
      capacityLegendData.push({
        name: currentCapacityLabel,
      });
    }
    const capacity = {
      charts: [
        {
          data: previousCapacityData,
          show: true,
          style: chartStyles.previousCapacityData,
        },
        {
          data: currentCapacityData,
          show: true,
          style: chartStyles.currentCapacityData,
        },
      ],
      legend: {
        colorScale: chartStyles.capacityColorScale,
        data: capacityLegendData,
        onClick: this.handleCapacityLegendClick,
      },
    };

    const limitLegendData = [];
    if (previousLimitLabel) {
      limitLegendData.push({
        name: previousLimitLabel,
      });
    }
    if (currentLimitLabel) {
      limitLegendData.push({
        name: currentLimitLabel,
      });
    }
    const limit = {
      charts: [
        {
          data: previousLimitData,
          show: true,
          style: chartStyles.previousLimitData,
        },
        {
          data: currentLimitData,
          show: true,
          style: chartStyles.currentLimitData,
        },
      ],
      legend: {
        colorScale: chartStyles.limitColorScale,
        data: limitLegendData,
        onClick: this.handleLimitLegendClick,
      },
    };

    const requestLegendData = [];
    if (previousRequestLabel) {
      requestLegendData.push({
        name: previousRequestLabel,
      });
    }
    if (currentRequestLabel) {
      requestLegendData.push({
        name: currentRequestLabel,
      });
    }
    const request = {
      charts: [
        {
          data: previousRequestData,
          show: true,
          style: chartStyles.previousRequestData,
        },
        {
          data: currentRequestData,
          show: true,
          style: chartStyles.currentRequestData,
        },
      ],
      legend: {
        colorScale: chartStyles.requestColorScale,
        data: requestLegendData,
        onClick: this.handleRequestLegendClick,
      },
    };

    const usageLegendData = [];
    if (previousUsageLabel) {
      usageLegendData.push({
        name: previousUsageLabel,
      });
    }
    if (currentUsageLabel) {
      usageLegendData.push({
        name: currentUsageLabel,
      });
    }
    const usage = {
      charts: [
        {
          data: previousUsageData,
          show: true,
          style: chartStyles.previousUsageData,
        },
        {
          data: currentUsageData,
          show: true,
          style: chartStyles.currentUsageData,
        },
      ],
      legend: {
        colorScale: chartStyles.usageColorScale,
        data: usageLegendData,
        onClick: this.handleUsageLegendClick,
      },
    };

    this.setState({
      datum: {
        capacity,
        limit,
        request,
        usage,
      },
    });
  };

  private handleCapacityLegendClick = props => {
    const { datum } = this.state;
    const newDatum = { ...datum };

    if (props.index >= 0 && newDatum.capacity.charts.length) {
      newDatum.capacity.charts[props.index].show = !newDatum.capacity.charts[
        props.index
      ].show;
      this.setState({ datum: newDatum });
    }
  };

  private handleLimitLegendClick = props => {
    const { datum } = this.state;
    const newDatum = { ...datum };

    if (props.index >= 0 && newDatum.limit.charts.length) {
      newDatum.limit.charts[props.index].show = !newDatum.limit.charts[
        props.index
      ].show;
      this.setState({ datum: newDatum });
    }
  };

  private handleRequestLegendClick = props => {
    const { datum } = this.state;
    const newDatum = { ...datum };

    if (props.index >= 0 && newDatum.request.charts.length) {
      newDatum.request.charts[props.index].show = !newDatum.request.charts[
        props.index
      ].show;
      this.setState({ datum: newDatum });
    }
  };

  private handleResize = () => {
    this.setState({ width: this.containerRef.current.clientWidth });
  };

  private handleUsageLegendClick = props => {
    const { datum } = this.state;
    const newDatum = { ...datum };

    if (props.index >= 0 && newDatum.usage.charts.length) {
      newDatum.usage.charts[props.index].show = !newDatum.usage.charts[
        props.index
      ].show;
      this.setState({ datum: newDatum });
    }
  };

  private getChart = (datum: HistoricalChartDatum, index: number) => {
    if (datum.data && datum.data.length && datum.show) {
      return (
        <ChartArea
          data={datum.data}
          key={`historical-usage-chart-${index}`}
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
          height={25}
          orientation="vertical"
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

  public render() {
    const { height, title, xAxisLabel, yAxisLabel } = this.props;
    const { datum, width } = this.state;
    const legendWidth = width * 0.25;

    const container = <ChartVoronoiContainer labels={this.getTooltipLabel} />;

    return (
      <div className={css(styles.reportSummaryTrend)} ref={this.containerRef}>
        <span className={css(styles.title)}>{title}</span>
        <Chart containerComponent={container} height={height} width={width}>
          {Boolean(datum && datum.capacity) &&
            datum.capacity.charts.map((chart, index) => {
              return this.getChart(chart, index);
            })}
          {Boolean(datum && datum.limit) &&
            datum.limit.charts.map((chart, index) => {
              return this.getChart(chart, index);
            })}
          {Boolean(datum && datum.request) &&
            datum.request.charts.map((chart, index) => {
              return this.getChart(chart, index);
            })}
          {Boolean(datum && datum.usage) &&
            datum.usage.charts.map((chart, index) => {
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
          {this.getLegend(
            datum && datum.usage ? datum.usage.legend : {},
            legendWidth
          )}
          {this.getLegend(
            datum && datum.request ? datum.request.legend : {},
            legendWidth
          )}
          {this.getLegend(
            datum && datum.limit ? datum.limit.legend : {},
            legendWidth
          )}
          {this.getLegend(
            datum && datum.capacity ? datum.capacity.legend : {},
            legendWidth
          )}
        </div>
      </div>
    );
  }
}

export { HistoricalUsageChart, HistoricalUsageChartProps };
