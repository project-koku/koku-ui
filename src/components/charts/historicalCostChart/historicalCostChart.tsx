import {
  Chart,
  ChartArea,
  ChartAxis,
  ChartLegend,
  ChartTooltip,
  ChartVoronoiContainer,
} from '@patternfly/react-charts';
import { css } from '@patternfly/react-styles';
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
import { chartStyles, styles } from './historicalCostChart.styles';

interface HistoricalCostChartProps {
  currentCostData?: any;
  currentInfrastructureCostData?: any;
  formatDatumValue?: ValueFormatter;
  formatDatumOptions?: FormatOptions;
  height: number;
  previousCostData?: any;
  previousInfrastructureCostData?: any;
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
  datum?: {
    charts?: HistoricalChartDatum[];
    legend?: HistoricalLegendDatum;
  };
  width: number;
}

class HistoricalCostChart extends React.Component<
  HistoricalCostChartProps,
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

  public componentDidUpdate(prevProps: HistoricalCostChartProps) {
    if (
      prevProps.currentCostData !== this.props.currentCostData ||
      prevProps.currentInfrastructureCostData !==
        this.props.currentInfrastructureCostData ||
      prevProps.previousCostData !== this.props.previousCostData ||
      prevProps.previousInfrastructureCostData !==
        this.props.previousInfrastructureCostData
    ) {
      this.initDatum();
    }
  }

  public componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }

  private initDatum = () => {
    const {
      currentCostData,
      currentInfrastructureCostData,
      previousCostData,
      previousInfrastructureCostData,
    } = this.props;

    const previous = [
      {
        data: previousCostData,
        name: 'previousCost',
        show: true,
        style: chartStyles.previousCostData,
      },
      {
        data: previousInfrastructureCostData,
        name: 'previousInfrastructureCost',
        show: true,
        style: chartStyles.previousInfrastructureCostData,
      },
    ];
    const current = [
      {
        data: currentCostData,
        name: 'currentCost',
        show: true,
        style: chartStyles.currentCostData,
      },
      {
        data: currentInfrastructureCostData,
        name: 'currentInfrastructureCost',
        show: true,
        style: chartStyles.currentInfrastructureCostData,
      },
    ];

    // Show all legends, regardless of length -- https://github.com/project-koku/koku-ui/issues/248
    const previousLegendData = [];
    if (previousCostData) {
      const [start] = getMonthRangeString(
        previousCostData,
        'chart.cost_legend_label'
      );
      previousLegendData.push({
        name: start,
        symbol: {
          type: 'minus',
        },
        tooltip: getDateRangeString(previousCostData, true, true),
      });
    }
    if (previousInfrastructureCostData) {
      const [start] = getMonthRangeString(
        previousInfrastructureCostData,
        'chart.cost_infrastructure_legend_label'
      );
      previousLegendData.push({
        name: start,
        symbol: {
          type: 'dash',
        },
        tooltip: getDateRangeString(previousInfrastructureCostData, true, true),
      });
    }

    const currentLegendData = [];
    if (currentCostData) {
      const [start] = getMonthRangeString(
        currentCostData,
        'chart.cost_legend_label'
      );
      currentLegendData.push({
        name: start,
        symbol: {
          type: 'minus',
        },
        tooltip: getDateRangeString(currentCostData, true, false),
      });
    }
    if (currentInfrastructureCostData) {
      const [start] = getMonthRangeString(
        currentInfrastructureCostData,
        'chart.cost_infrastructure_legend_label'
      );
      currentLegendData.push({
        name: start,
        symbol: {
          type: 'dash',
        },
        tooltip: getDateRangeString(currentInfrastructureCostData, true, false),
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
      datum: {
        charts,
        legend,
      },
    });
  };

  private handleLegendClick = props => {
    const { datum } = this.state;
    const newDatum = { ...datum };

    if (props.index >= 0 && newDatum.charts.length) {
      newDatum.charts[props.index].show = !newDatum.charts[props.index].show;
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
          name={datum.name}
          key={`historical-usage-chart-${index}`}
          style={datum.style}
        />
      );
    } else {
      return null;
    }
  };

  private getDomain() {
    const {
      currentCostData,
      currentInfrastructureCostData,
      previousCostData,
      previousInfrastructureCostData,
    } = this.props;
    const domain: { x: DomainTuple; y?: DomainTuple } = { x: [1, 31] };

    const maxCurrentLimit = currentCostData ? getMaxValue(currentCostData) : 0;
    const maxCurrentRequest = currentInfrastructureCostData
      ? getMaxValue(currentInfrastructureCostData)
      : 0;
    const maxPreviousLimit = previousCostData
      ? getMaxValue(previousCostData)
      : 0;
    const maxPreviousRequest = previousInfrastructureCostData
      ? getMaxValue(previousInfrastructureCostData)
      : 0;
    const maxValue = Math.max(
      maxCurrentLimit,
      maxCurrentRequest,
      maxPreviousLimit,
      maxPreviousRequest
    );
    const max = maxValue > 0 ? Math.ceil(maxValue + maxValue * 0.1) : 0;

    if (max > 0) {
      domain.y = [0, max];
    }
    return domain;
  }

  private getEndDate() {
    const {
      currentInfrastructureCostData,
      previousInfrastructureCostData,
    } = this.props;
    const currentRequestDate = currentInfrastructureCostData
      ? getDate(getDateRange(currentInfrastructureCostData, true, true)[1])
      : 0;
    const previousRequestDate = previousInfrastructureCostData
      ? getDate(getDateRange(previousInfrastructureCostData, true, true)[1])
      : 0;

    return currentRequestDate > 0 || previousRequestDate > 0
      ? Math.max(currentRequestDate, previousRequestDate)
      : 31;
  }

  private getLegend = (datum: HistoricalLegendDatum) => {
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
          gutter={0}
          height={25}
          labelComponent={<ChartLabelTooltip content={this.getLegendTooltip} />}
          style={chartStyles.legend}
        />
      );
    } else {
      return null;
    }
  };

  private getLegendTooltip = (datum: ChartDatum) => {
    return datum.tooltip ? datum.tooltip : '';
  };

  private getTooltipLabel = (datum: ChartDatum) => {
    const { formatDatumValue, formatDatumOptions } = this.props;

    const value = getTooltipLabel(
      datum,
      getTooltipContent(formatDatumValue),
      formatDatumOptions,
      'date'
    );

    if (
      datum.childName === 'currentCost' ||
      datum.childName === 'previousCost'
    ) {
      return i18next.t('chart.cost_tooltip', { value });
    } else if (
      datum.childName === 'currentInfrastructureCost' ||
      datum.childName === 'previousInfrastructureCost'
    ) {
      return i18next.t('chart.cost_infrastructure_tooltip', { value });
    }
    return value;
  };

  public render() {
    const { height, title, xAxisLabel, yAxisLabel } = this.props;
    const { datum, width } = this.state;

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
            width={width}
          >
            {Boolean(datum && datum.charts) &&
              datum.charts.map((chart, index) => {
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
        {Boolean(
          datum && datum.legend && datum.legend.data && datum.legend.data.length
        ) && (
          <div className={css(styles.legendContainer)}>
            <div className={css(styles.legend)}>
              {this.getLegend(datum.legend)}
            </div>
          </div>
        )}
      </div>
    );
  }
}

export { HistoricalCostChart, HistoricalCostChartProps };
