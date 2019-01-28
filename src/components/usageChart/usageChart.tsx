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
import { chartStyles, styles } from './usageChart.styles';

interface UsageChartProps {
  currentRequestData?: any;
  currentRequestLabel?: string;
  currentUsageData: any;
  currentUsageLabel?: string;
  formatDatumValue?: ValueFormatter;
  formatDatumOptions?: FormatOptions;
  height: number;
  previousRequestData?: any;
  previousRequestLabel?: string;
  previousUsageData?: any;
  previousUsageLabel?: string;
  title?: string;
}

interface UsageChartDatum {
  data?: any;
  show?: boolean;
  style?: VictoryStyleInterface;
}

interface UsageNameDatum {
  name: string;
}

interface UsageLegendDatum {
  colorScale?: string[];
  data?: UsageNameDatum[];
  gutter?: number;
  onClick?: (props) => void;
}

interface Data {
  charts?: UsageChartDatum[];
  legend?: UsageLegendDatum;
}

interface State {
  datum?: {
    request?: Data;
    usage?: Data;
  };
  width: number;
}

class UsageChart extends React.Component<UsageChartProps, State> {
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

  public componentDidUpdate(prevProps: UsageChartProps) {
    if (
      prevProps.currentRequestData !== this.props.currentRequestData ||
      prevProps.currentUsageData !== this.props.currentUsageData ||
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
      currentRequestData,
      currentRequestLabel,
      currentUsageData,
      currentUsageLabel,
      previousRequestData,
      previousRequestLabel,
      previousUsageData,
      previousUsageLabel,
    } = this.props;

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
        gutter: 55,
        onClick: this.handleUsageLegendClick,
      },
    };

    this.setState({
      datum: {
        request,
        usage,
      },
    });
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

  private getChart = (datum: UsageChartDatum, index: number) => {
    if (datum.data && datum.data.length && datum.show) {
      return (
        <ChartArea
          data={datum.data}
          key={`usage-chart-${index}`}
          style={datum.style}
        />
      );
    } else {
      return null;
    }
  };

  private getLegend = (
    datum: UsageLegendDatum,
    width: number,
    gutter: number = 20
  ) => {
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
          gutter={gutter}
          height={25}
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
            {Boolean(datum && datum.request) &&
              datum.request.charts.map((chart, index) => {
                return this.getChart(chart, index);
              })}
            {Boolean(datum && datum.usage) &&
              datum.usage.charts.map((chart, index) => {
                return this.getChart(chart, index);
              })}
            <VictoryAxis style={chartStyles.axis} />
            <VictoryAxis dependentAxis style={chartStyles.axis} />
          </Chart>
        </div>
        {this.getLegend(
          datum && datum.usage ? datum.usage.legend : {},
          width,
          55
        )}
        {this.getLegend(
          datum && datum.request ? datum.request.legend : {},
          width
        )}
      </div>
    );
  }
}

export { UsageChart, UsageChartProps };
