import {
  Chart,
  ChartArea,
  ChartAxis,
  ChartLegend,
  ChartTooltip,
  ChartVoronoiContainer,
} from '@patternfly/react-charts';
import { css } from '@patternfly/react-styles';
import { ChartLabelTooltip } from 'components/charts/chartLabelTooltip';
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
import i18next from 'i18next';
import React from 'react';
import { FormatOptions, ValueFormatter } from 'utils/formatValue';
import { DomainTuple, VictoryStyleInterface } from 'victory';
import { chartStyles, styles } from './costChart.styles';

interface CostChartProps {
  currentCostData: any;
  currentInfrastructureCostData?: any;
  formatDatumValue?: ValueFormatter;
  formatDatumOptions?: FormatOptions;
  height?: number;
  previousInfrastructureCostData?: any;
  previousCostData?: any;
  title?: string;
}

interface CostChartDatum {
  data?: any;
  name?: string;
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
  charts?: CostChartDatum[];
  legend?: UsageLegendDatum;
}

interface State {
  datum?: {
    current?: Data;
    previous?: Data;
  };
  width: number;
}

class CostChart extends React.Component<CostChartProps, State> {
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

  public componentDidUpdate(prevProps: CostChartProps) {
    if (
      prevProps.currentInfrastructureCostData !==
        this.props.currentInfrastructureCostData ||
      prevProps.currentCostData !== this.props.currentCostData ||
      prevProps.previousInfrastructureCostData !==
        this.props.previousInfrastructureCostData ||
      prevProps.previousCostData !== this.props.previousCostData
    ) {
      this.initDatum();
    }
  }

  public componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }

  private initDatum = () => {
    const {
      currentInfrastructureCostData,
      currentCostData,
      previousInfrastructureCostData,
      previousCostData,
      title,
    } = this.props;

    // Show all legends, regardless of length -- https://github.com/project-koku/koku-ui/issues/248
    const previousLegendData = [];
    if (previousCostData) {
      const [start] = getMonthRangeString(previousCostData, 'chart.cost');
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
        'chart.infrastructure_cost'
      );
      previousLegendData.push({
        name: start,
        symbol: {
          type: 'dash',
        },
        tooltip: getDateRangeString(previousInfrastructureCostData, true, true),
      });
    }

    const previous = {
      charts: [
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
      ],
      legend: {
        colorScale: chartStyles.previousColorScale,
        data: previousLegendData,
        onClick: this.handlePreviousLegendClick,
        title,
      },
    };

    const currentLegendData = [];
    if (currentCostData) {
      const [start] = getMonthRangeString(currentCostData, 'chart.cost');
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
        'chart.infrastructure_cost'
      );
      currentLegendData.push({
        name: start,
        symbol: {
          type: 'dash',
        },
        tooltip: getDateRangeString(currentInfrastructureCostData, true, false),
      });
    }
    const current = {
      charts: [
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
      ],
      legend: {
        colorScale: chartStyles.currentColorScale,
        data: currentLegendData,
        gutter: 55,
        onClick: this.handleCurrentLegendClick,
        title,
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

  private getChart = (datum: CostChartDatum, index: number) => {
    if (datum.data && datum.data.length && datum.show) {
      return (
        <ChartArea
          data={datum.data}
          name={datum.name}
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
      currentInfrastructureCostData,
      currentCostData,
      previousInfrastructureCostData,
      previousCostData,
    } = this.props;
    const domain: { x: DomainTuple; y?: DomainTuple } = { x: [1, 31] };

    const maxCurrentInfrastructure = currentInfrastructureCostData
      ? getMaxValue(currentInfrastructureCostData)
      : 0;
    const maxCurrentUsage = currentCostData ? getMaxValue(currentCostData) : 0;
    const maxPreviousInfrastructure = previousInfrastructureCostData
      ? getMaxValue(previousInfrastructureCostData)
      : 0;
    const maxPreviousUsage = previousCostData
      ? getMaxValue(previousCostData)
      : 0;
    const maxValue = Math.max(
      maxCurrentInfrastructure,
      maxCurrentUsage,
      maxPreviousInfrastructure,
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
      currentInfrastructureCostData,
      currentCostData,
      previousInfrastructureCostData,
      previousCostData,
    } = this.props;
    const currentInfrastructureDate = currentInfrastructureCostData
      ? getDate(getDateRange(currentInfrastructureCostData, true, true)[1])
      : 0;
    const currentUsageDate = currentCostData
      ? getDate(getDateRange(currentCostData, true, true)[1])
      : 0;
    const previousInfrastructureDate = previousInfrastructureCostData
      ? getDate(getDateRange(previousInfrastructureCostData, true, true)[1])
      : 0;
    const previousUsageDate = previousCostData
      ? getDate(getDateRange(previousCostData, true, true)[1])
      : 0;

    return currentInfrastructureDate > 0 ||
      currentUsageDate > 0 ||
      previousInfrastructureDate > 0 ||
      previousUsageDate > 0
      ? Math.max(
          currentInfrastructureDate,
          currentUsageDate,
          previousInfrastructureDate,
          previousUsageDate
        )
      : 31;
  }

  private getLegend = (datum: UsageLegendDatum, width: number) => {
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
          height={25}
          itemsPerRow={1}
          labelComponent={<ChartLabelTooltip content={this.getLegendTooltip} />}
          orientation="horizontal"
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
          <div className={css(styles.legendTitle)}>
            {datum.previous.legend.title}
          </div>
        )}
        {Boolean(
          this.isCurrentLegendVisible() && !this.isPreviousLegendVisible()
        ) && (
          <div className={css(styles.legendTitle)}>
            {datum.current.legend.title}
          </div>
        )}
        {Boolean(this.isPreviousLegendVisible()) && (
          <div className={css(styles.legend)}>
            {this.getLegend(datum.previous.legend, legendWidth)}
          </div>
        )}
        {Boolean(this.isCurrentLegendVisible()) && (
          <div className={css(styles.legend)}>
            {this.getLegend(datum.current.legend, legendWidth)}
          </div>
        )}
      </div>
    );
  }
}

export { CostChart, CostChartProps };
