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
import i18next from 'i18next';
import React from 'react';
import { FormatOptions, ValueFormatter } from 'utils/formatValue';
import { DomainTuple, VictoryStyleInterface } from 'victory';
import { chartStyles, styles } from './costChart.styles';

interface CostChartProps {
  containerHeight?: number;
  currentCostData: any;
  currentInfrastructureCostData?: any;
  formatDatumValue?: ValueFormatter;
  formatDatumOptions?: FormatOptions;
  height?: number;
  legendItemsPerRow?: number;
  padding?: any;
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
  chartDatum?: Data;
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
    } = this.props;

    // Show all legends, regardless of length -- https://github.com/project-koku/koku-ui/issues/248
    const legendData = [];
    const legendColorScale = [];
    const costKey = 'chart.cost_legend_label';
    const costInfrastructureKey = 'chart.cost_infrastructure_legend_label';

    if (previousCostData) {
      const label = getCostRangeString(
        previousCostData,
        costKey,
        true,
        true,
        1
      );
      legendData.push({
        name: label,
        symbol: {
          type: 'minus',
        },
      });
      legendColorScale.push(chartStyles.previousColorScale[0]);
    }
    if (currentCostData) {
      const label = getCostRangeString(currentCostData, costKey, true, false);
      legendData.push({
        name: label,
        symbol: {
          type: 'minus',
        },
      });
      legendColorScale.push(chartStyles.currentColorScale[0]);
    }
    if (previousInfrastructureCostData) {
      const label = getCostRangeString(
        previousInfrastructureCostData,
        costInfrastructureKey,
        true,
        true,
        1
      );
      legendData.push({
        name: label,
        symbol: {
          type: 'dash',
        },
      });
      legendColorScale.push(chartStyles.previousColorScale[1]);
    }
    if (currentInfrastructureCostData) {
      const label = getCostRangeString(
        currentInfrastructureCostData,
        costInfrastructureKey,
        true,
        false
      );
      legendData.push({
        name: label,
        symbol: {
          type: 'dash',
        },
      });
      legendColorScale.push(chartStyles.currentColorScale[1]);
    }

    this.setState({
      chartDatum: {
        charts: [
          {
            data: previousCostData,
            name: 'previousCost',
            show: true,
            style: chartStyles.previousCostData,
          },
          {
            data: currentCostData,
            name: 'currentCost',
            show: true,
            style: chartStyles.currentCostData,
          },
          {
            data: previousInfrastructureCostData,
            name: 'previousInfrastructureCost',
            show: true,
            style: chartStyles.previousInfrastructureCostData,
          },
          {
            data: currentInfrastructureCostData,
            name: 'currentInfrastructureCost',
            show: true,
            style: chartStyles.currentInfrastructureCostData,
          },
        ],
        legend: {
          colorScale: legendColorScale,
          data: legendData,
          gutter: 55,
          onClick: this.handleLegendClick,
        },
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

  private getChart = (chartDatum: CostChartDatum, index: number) => {
    if (chartDatum.data && chartDatum.data.length && chartDatum.show) {
      return (
        <ChartArea
          data={chartDatum.data}
          interpolation="basis"
          name={chartDatum.name}
          key={`usage-chart-${chartDatum.name}-${index}`}
          style={chartDatum.style}
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

  private getLegend = (chartDatum: UsageLegendDatum, width: number) => {
    if (!(chartDatum && chartDatum.data && chartDatum.data.length)) {
      return null;
    }
    const { legendItemsPerRow, title } = this.props;
    const itemsPerRow = legendItemsPerRow
      ? legendItemsPerRow
      : width > 400
      ? chartStyles.itemsPerRow
      : 1;
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
        height={25}
        itemsPerRow={itemsPerRow}
        responsive={false}
        style={chartStyles.legend}
        title={title}
      />
    );
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

  private isLegendVisible() {
    const { chartDatum } = this.state;

    let result = false;
    if (chartDatum && chartDatum.legend && chartDatum.legend.data) {
      chartDatum.legend.data.forEach(data => {
        if (data.name && data.name.trim() !== '') {
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
        style={{ height: width > 400 ? containerHeight : containerHeight + 75 }}
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
          {Boolean(chartDatum && chartDatum) &&
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

export { CostChart, CostChartProps };
