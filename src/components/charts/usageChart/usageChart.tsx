import {
  Chart,
  ChartArea,
  ChartAxis,
  ChartContainer,
  ChartLegend,
  ChartTheme,
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
import i18next from 'i18next';
import React from 'react';
import { FormatOptions, ValueFormatter } from 'utils/formatValue';
import { DomainTuple, VictoryStyleInterface } from 'victory';
import { chartStyles, styles } from './usageChart.styles';

interface UsageChartProps {
  currentRequestData?: any;
  currentUsageData: any;
  formatDatumValue?: ValueFormatter;
  formatDatumOptions?: FormatOptions;
  height?: number;
  previousRequestData?: any;
  previousUsageData?: any;
}

interface UsageChartDatum {
  data?: any;
  show?: boolean;
  style?: VictoryStyleInterface;
}

interface UsageNameDatum {
  name?: string;
}

interface UsageLegendDatum {
  colorScale?: string[];
  data?: UsageNameDatum[];
  gutter?: number;
  onClick?: (props) => void;
  title?: string;
}

interface Data {
  charts?: UsageChartDatum[];
  legend?: UsageLegendDatum;
}

interface State {
  datum?: {
    current?: Data;
    previous?: Data;
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
      currentUsageData,
      previousRequestData,
      previousUsageData,
    } = this.props;

    // Show all legends, regardless of length -- https://github.com/project-koku/koku-ui/issues/248
    const previousLegendData = [];
    if (previousUsageData) {
      previousLegendData.push({
        name: i18next.t(`chart.used`),
        symbol: {
          type: 'minus',
        },
      });
    }
    if (previousRequestData) {
      previousLegendData.push({
        name: i18next.t(`chart.requested`),
        symbol: {
          type: 'dash',
        },
      });
    }

    const previous = {
      charts: [
        {
          data: previousUsageData,
          show: true,
          style: chartStyles.previousUsageData,
        },
        {
          data: previousRequestData,
          show: true,
          style: chartStyles.previousRequestData,
        },
      ],
      legend: {
        colorScale: chartStyles.previousColorScale,
        data: previousLegendData,
        onClick: this.handlePreviousLegendClick,
        title: getDateRangeString(previousUsageData, true, true),
      },
    };

    const currentLegendData = [];
    if (currentUsageData) {
      currentLegendData.push({
        name: i18next.t(`chart.used`),
        symbol: {
          type: 'minus',
        },
      });
    }
    if (currentRequestData) {
      currentLegendData.push({
        name: i18next.t(`chart.requested`),
        symbol: {
          type: 'dash',
        },
      });
    }
    const current = {
      charts: [
        {
          data: currentUsageData,
          show: true,
          style: chartStyles.currentUsageData,
        },
        {
          data: currentRequestData,
          show: true,
          style: chartStyles.currentRequestData,
        },
      ],
      legend: {
        colorScale: chartStyles.currentColorScale,
        data: currentLegendData,
        gutter: 55,
        onClick: this.handleCurrentLegendClick,
        title: getDateRangeString(currentUsageData, true, false),
      },
    };

    this.setState({
      datum: {
        previous,
        current,
      },
    });
  };

  private handleCurrentLegendClick = props => {
    const { datum } = this.state;
    const newDatum = { ...datum };

    if (props.index >= 0 && newDatum.current.charts.length) {
      newDatum.current.charts[props.index].show = !newDatum.current.charts[
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

  private handlePreviousLegendClick = props => {
    const { datum } = this.state;
    const newDatum = { ...datum };

    if (props.index >= 0 && newDatum.previous.charts.length) {
      newDatum.previous.charts[props.index].show = !newDatum.previous.charts[
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

  private getDomain() {
    const {
      currentRequestData,
      currentUsageData,
      previousRequestData,
      previousUsageData,
    } = this.props;
    const domain: { x: DomainTuple; y?: DomainTuple } = { x: [1, 31] };

    const maxCurrentRequest = currentRequestData
      ? getMaxValue(currentRequestData)
      : 0;
    const maxCurrentUsage = currentUsageData
      ? getMaxValue(currentUsageData)
      : 0;
    const maxPreviousRequest = previousRequestData
      ? getMaxValue(previousRequestData)
      : 0;
    const maxPreviousUsage = previousUsageData
      ? getMaxValue(previousUsageData)
      : 0;
    const maxValue = Math.max(
      maxCurrentRequest,
      maxCurrentUsage,
      maxPreviousRequest,
      maxPreviousUsage
    );
    const max = maxValue > 0 ? Math.ceil(maxValue + maxValue * 0.1) : 0;

    if (max > 0) {
      domain.y = [0, max];
    }
    return domain;
  }

  private getEndDate() {
    const {
      currentRequestData,
      currentUsageData,
      previousRequestData,
      previousUsageData,
    } = this.props;
    const currentRequestDate = currentRequestData
      ? getDate(getDateRange(currentRequestData, true, true)[1])
      : 0;
    const currentUsageDate = currentUsageData
      ? getDate(getDateRange(currentUsageData, true, true)[1])
      : 0;
    const previousRequestDate = previousRequestData
      ? getDate(getDateRange(previousRequestData, true, true)[1])
      : 0;
    const previousUsageDate = previousUsageData
      ? getDate(getDateRange(previousUsageData, true, true)[1])
      : 0;

    return currentRequestDate > 0 ||
      currentUsageDate > 0 ||
      previousRequestDate > 0 ||
      previousUsageDate > 0
      ? Math.max(
          currentRequestDate,
          currentUsageDate,
          previousRequestDate,
          previousUsageDate
        )
      : 31;
  }

  private getLegend = (datum: UsageLegendDatum, width: number) => {
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
          height={25}
          orientation="horizontal"
          style={chartStyles.legend}
          theme={ChartTheme.light.blue}
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

  private isCurrentLegendVisible() {
    const { datum } = this.state;

    let result = false;
    if (datum && datum.current.legend && datum.current.legend.data) {
      datum.current.legend.data.forEach(data => {
        if (data.name && data.name.trim() !== '') {
          result = true;
          return;
        }
      });
    }
    return result;
  }

  private isPreviousLegendVisible() {
    const { datum } = this.state;

    let result = false;
    if (datum && datum.previous.legend && datum.previous.legend.data) {
      datum.previous.legend.data.forEach(data => {
        if (data.name && data.name.trim() !== '') {
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
      chartStyles.legend.minWidth > width / 2
        ? chartStyles.legend.minWidth
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
          {Boolean(datum && datum.previous) &&
            datum.previous.charts.map((chart, index) => {
              return this.getChart(chart, index);
            })}
          {Boolean(datum && datum.current) &&
            datum.current.charts.map((chart, index) => {
              return this.getChart(chart, index);
            })}
          <ChartAxis
            style={chartStyles.xAxis}
            tickValues={[1, midDate, endDate]}
          />
          <ChartAxis dependentAxis style={chartStyles.yAxis} />
        </Chart>
        {Boolean(this.isPreviousLegendVisible()) && (
          <div className={css(styles.legend)}>
            {Boolean(datum.previous.legend.title) && (
              <div>{datum.previous.legend.title}</div>
            )}
            {this.getLegend(datum.previous.legend, legendWidth)}
          </div>
        )}
        {Boolean(this.isCurrentLegendVisible()) && (
          <div className={css(styles.legend)}>
            {Boolean(datum.current.legend.title) && (
              <div>{datum.current.legend.title}</div>
            )}
            {this.getLegend(datum.current.legend, legendWidth)}
          </div>
        )}
      </div>
    );
  }
}

export { UsageChart, UsageChartProps };
