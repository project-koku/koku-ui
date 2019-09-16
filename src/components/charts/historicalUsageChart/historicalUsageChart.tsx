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
  ChartDatum,
  getDateRangeString,
  getMaxValue,
  getMonthRangeString,
  getTooltipContent,
  getTooltipLabel,
} from 'components/charts/commonChart/chartUtils';
import { getDateRange } from 'components/charts/commonChart/chartUtils';
import getDate from 'date-fns/get_date';
import i18next from 'i18next';
import React from 'react';
import { FormatOptions, ValueFormatter } from 'utils/formatValue';
import { DomainTuple, VictoryStyleInterface } from 'victory';
import { ChartLabelTooltip } from '../chartLabelTooltip';
import { chartStyles, styles } from './historicalUsageChart.styles';

interface HistoricalUsageChartProps {
  containerHeight?: number;
  currentLimitData?: any;
  currentRequestData?: any;
  currentUsageData: any;
  formatDatumValue?: ValueFormatter;
  formatDatumOptions?: FormatOptions;
  height: number;
  legendItemsPerRow?: number;
  padding?: any;
  previousLimitData?: any;
  previousRequestData?: any;
  previousUsageData?: any;
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
  title?: string;
}

interface State {
  chartDatum?: {
    charts?: HistoricalChartDatum[];
    legend?: HistoricalLegendDatum;
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
      prevProps.currentLimitData !== this.props.currentLimitData ||
      prevProps.currentRequestData !== this.props.currentRequestData ||
      prevProps.currentUsageData !== this.props.currentUsageData ||
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
      currentLimitData,
      currentRequestData,
      currentUsageData,
      previousLimitData,
      previousRequestData,
      previousUsageData,
    } = this.props;

    const previous = [
      {
        data: previousUsageData,
        name: 'previousUsage',
        show: true,
        style: chartStyles.previousUsageData,
      },
      {
        data: previousRequestData,
        name: 'previousRequest',
        show: true,
        style: chartStyles.previousRequestData,
      },
      {
        data: previousLimitData,
        name: 'previousLimit',
        show: true,
        style: chartStyles.previousLimitData,
      },
    ];
    const current = [
      {
        data: currentUsageData,
        name: 'currentUsage',
        show: true,
        style: chartStyles.currentUsageData,
      },
      {
        data: currentRequestData,
        name: 'currentRequest',
        show: true,
        style: chartStyles.currentRequestData,
      },
      {
        data: currentLimitData,
        name: 'currentLimit',
        show: true,
        style: chartStyles.currentLimitData,
      },
    ];

    // Show all legends, regardless of length -- https://github.com/project-koku/koku-ui/issues/248
    const previousLegendData = [];
    if (previousUsageData) {
      const [start] = getMonthRangeString(
        previousUsageData,
        'chart.usage_legend_label',
        1
      );
      previousLegendData.push({
        name: start,
        symbol: {
          type: 'minus',
        },
        tooltip: getDateRangeString(previousUsageData, true, true, 1),
      });
    }
    if (previousRequestData) {
      const [start] = getMonthRangeString(
        previousRequestData,
        'chart.requests_legend_label',
        1
      );
      previousLegendData.push({
        name: start,
        symbol: {
          type: 'dash',
        },
        tooltip: getDateRangeString(previousRequestData, true, true, 1),
      });
    }
    if (previousLimitData) {
      const [start] = getMonthRangeString(
        previousLimitData,
        'chart.limit_legend_label',
        1
      );
      previousLegendData.push({
        name: start,
        symbol: {
          type: 'minus',
        },
        tooltip: getDateRangeString(previousLimitData, true, true, 1),
      });
    }

    const currentLegendData = [];
    if (currentUsageData) {
      const [start] = getMonthRangeString(
        currentLegendData,
        'chart.usage_legend_label'
      );
      currentLegendData.push({
        name: start,
        symbol: {
          type: 'minus',
        },
        tooltip: getDateRangeString(currentUsageData, true, false),
      });
    }
    if (currentRequestData) {
      const [start] = getMonthRangeString(
        currentRequestData,
        'chart.requests_legend_label'
      );
      currentLegendData.push({
        name: start,
        symbol: {
          type: 'dash',
        },
        tooltip: getDateRangeString(currentRequestData, true, false),
      });
    }
    if (currentLimitData) {
      const [start] = getMonthRangeString(
        currentLimitData,
        'chart.limit_legend_label'
      );
      currentLegendData.push({
        name: start,
        symbol: {
          type: 'minus',
        },
        tooltip: getDateRangeString(currentLimitData, true, false),
      });
    }

    // Merge current and previous data into one legend row
    const charts = [];
    const colorScale = [];
    const legendData = [];
    for (let i = 0; i < current.length && previous.length; i++) {
      charts.push(previous[i]);
      charts.push(current[i]);
      legendData.push(previousLegendData[i]);
      legendData.push(currentLegendData[i]);
      colorScale.push(chartStyles.previousColorScale[i]);
      colorScale.push(chartStyles.currentColorScale[i]);
    }

    const legend = {
      colorScale,
      data: legendData,
      onClick: this.handleLegendClick,
    };

    this.setState({
      chartDatum: {
        charts,
        legend,
      },
    });
  };

  private handleLegendClick = props => {
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

  private getChart = (chartDatum: HistoricalChartDatum, index: number) => {
    if (chartDatum.data && chartDatum.data.length && chartDatum.show) {
      return (
        <ChartArea
          data={chartDatum.data}
          interpolation="basis"
          name={chartDatum.name}
          key={`historical-usage-chart-${chartDatum.name}-${index}`}
          style={chartDatum.style}
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
      currentLimitData,
      previousLimitData,
      previousRequestData,
      previousUsageData,
    } = this.props;
    const domain: { x: DomainTuple; y?: DomainTuple } = { x: [1, 31] };

    const maxCurrentLimit = currentLimitData
      ? getMaxValue(currentLimitData)
      : 0;
    const maxCurrentRequest = currentRequestData
      ? getMaxValue(currentRequestData)
      : 0;
    const maxCurrentUsage = currentUsageData
      ? getMaxValue(currentUsageData)
      : 0;
    const maxPreviousLimit = previousLimitData
      ? getMaxValue(previousLimitData)
      : 0;
    const maxPreviousRequest = previousRequestData
      ? getMaxValue(previousRequestData)
      : 0;
    const maxPreviousUsage = previousUsageData
      ? getMaxValue(previousUsageData)
      : 0;
    const maxValue = Math.max(
      maxCurrentLimit,
      maxCurrentRequest,
      maxCurrentUsage,
      maxPreviousLimit,
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

  private getLegend = (chartDatum: HistoricalLegendDatum, width: number) => {
    if (!(chartDatum && chartDatum.data && chartDatum.data.length)) {
      return null;
    }
    const { legendItemsPerRow } = this.props;
    const itemsPerRow = legendItemsPerRow
      ? legendItemsPerRow
      : width > 800
      ? chartStyles.itemsPerRow
      : 2;
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
        gutter={0}
        height={25}
        itemsPerRow={itemsPerRow}
        labelComponent={<ChartLabelTooltip content={this.getLegendTooltip} />}
        style={chartStyles.legend}
      />
    );
  };

  private getLegendTooltip = (chartDatum: ChartDatum) => {
    return chartDatum.tooltip ? chartDatum.tooltip : '';
  };

  private getTooltipLabel = ({ datum }) => {
    const { formatDatumValue, formatDatumOptions } = this.props;

    const value = getTooltipLabel(
      datum,
      getTooltipContent(formatDatumValue),
      formatDatumOptions,
      'date'
    );

    if (
      datum.childName === 'currentLimit' ||
      datum.childName === 'previousLimit'
    ) {
      return i18next.t('chart.limit_tooltip', { value });
    } else if (
      datum.childName === 'currentRequest' ||
      datum.childName === 'previousRequest'
    ) {
      return i18next.t('chart.requests_tooltip', { value });
    } else if (
      datum.childName === 'currentUsage' ||
      datum.childName === 'previousUsage'
    ) {
      return i18next.t('chart.usage_tooltip', { value });
    }
    return value;
  };

  public render() {
    const {
      height,
      containerHeight = height,
      padding,
      title,
      xAxisLabel,
      yAxisLabel,
    } = this.props;
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

    return (
      <div className={css(styles.chartContainer)} ref={this.containerRef}>
        <div className={css(styles.title)}>{title}</div>
        <div className={css(styles.chart)} style={{ height: containerHeight }}>
          <Chart
            containerComponent={container}
            domain={domain}
            height={height}
            legendComponent={
              chartDatum ? this.getLegend(chartDatum.legend, width) : undefined
            }
            legendData={chartDatum ? chartDatum.legend.data : undefined}
            legendPosition="bottom"
            padding={padding}
            theme={ChartTheme}
            width={width}
          >
            {Boolean(chartDatum && chartDatum.charts) &&
              chartDatum.charts.map((chart, index) => {
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
      </div>
    );
  }
}

export { HistoricalUsageChart, HistoricalUsageChartProps };
