import 'components/charts/common/charts-common.scss';

import {
  Chart,
  ChartArea,
  ChartAxis,
  ChartLegend,
  ChartLegendTooltip,
  createContainer,
  getInteractiveLegendEvents,
  getInteractiveLegendItemStyles,
} from '@patternfly/react-charts';
import { Title } from '@patternfly/react-core';
import { default as ChartTheme } from 'components/charts/chartTheme';
import { getCostRangeString, getMaxValue, getTooltipContent } from 'components/charts/common/chartUtils';
import { getDateRange } from 'components/charts/common/chartUtils';
import getDate from 'date-fns/get_date';
import i18next from 'i18next';
import React from 'react';
import { FormatOptions, ValueFormatter } from 'utils/formatValue';
import { DomainTuple, VictoryStyleInterface } from 'victory-core';

import { chartStyles, styles } from './historicalCostChart.styles';

interface HistoricalCostChartProps {
  adjustContainerHeight?: boolean;
  containerHeight?: number;
  currentCostData?: any;
  currentInfrastructureCostData?: any;
  formatDatumValue?: ValueFormatter;
  formatDatumOptions?: FormatOptions;
  height: number;
  legendItemsPerRow?: number;
  padding?: any;
  previousCostData?: any;
  previousInfrastructureCostData?: any;
  title?: string;
  xAxisLabel?: string;
  yAxisLabel?: string;
}

interface HistoricalCostChartData {
  name?: string;
}

interface HistoricalCostChartLegendItem {
  name?: string;
  symbol?: any;
  tooltip?: string;
}

interface HistoricalCostChartSeries {
  childName?: string;
  data?: [HistoricalCostChartData];
  legendItem?: HistoricalCostChartLegendItem;
  style?: VictoryStyleInterface;
}

interface State {
  CursorVoronoiContainer?: any;
  hiddenSeries: Set<number>;
  series?: HistoricalCostChartSeries[];
  width: number;
}

class HistoricalCostChart extends React.Component<HistoricalCostChartProps, State> {
  private containerRef = React.createRef<HTMLDivElement>();
  public state: State = {
    hiddenSeries: new Set(),
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
      prevProps.currentInfrastructureCostData !== this.props.currentInfrastructureCostData ||
      prevProps.previousCostData !== this.props.previousCostData ||
      prevProps.previousInfrastructureCostData !== this.props.previousInfrastructureCostData
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

    const costKey = 'chart.cost_legend_label';
    const costInfrastructureKey = 'chart.cost_infrastructure_legend_label';
    const costInfrastructureTooltipKey = 'chart.cost_infrastructure_legend_tooltip';
    const costTooltipKey = 'chart.cost_legend_tooltip';

    // Show all legends, regardless of length -- https://github.com/project-koku/koku-ui/issues/248

    this.setState({
      // Note: Container order is important
      CursorVoronoiContainer: createContainer('cursor', 'voronoi'),
      series: [
        {
          childName: 'previousCost',
          data: previousCostData,
          legendItem: {
            name: getCostRangeString(previousCostData, costKey, true, true, 1),
            symbol: {
              fill: chartStyles.previousColorScale[0],
              type: 'minus',
            },
            tooltip: getCostRangeString(previousCostData, costTooltipKey, false, false, 1),
          },
          style: {
            data: {
              ...chartStyles.previousCostData,
              stroke: chartStyles.previousColorScale[0],
            },
          },
        },
        {
          childName: 'currentCost',
          data: currentCostData,
          legendItem: {
            name: getCostRangeString(currentCostData, costKey, true, false),
            symbol: {
              fill: chartStyles.currentColorScale[0],
              type: 'minus',
            },
            tooltip: getCostRangeString(currentCostData, costTooltipKey, false, false),
          },
          style: {
            data: {
              ...chartStyles.currentCostData,
              stroke: chartStyles.currentColorScale[0],
            },
          },
        },
        {
          childName: 'previousInfrastructureCost',
          data: previousInfrastructureCostData,
          legendItem: {
            name: getCostRangeString(previousInfrastructureCostData, costInfrastructureKey, true, true, 1),
            symbol: {
              fill: chartStyles.previousColorScale[1],
              type: 'dash',
            },
            tooltip: getCostRangeString(previousInfrastructureCostData, costInfrastructureTooltipKey, false, false, 1),
          },
          style: {
            data: {
              ...chartStyles.previousInfrastructureCostData,
              stroke: chartStyles.previousColorScale[1],
            },
          },
        },
        {
          childName: 'currentInfrastructureCost',
          data: currentInfrastructureCostData,
          legendItem: {
            name: getCostRangeString(currentInfrastructureCostData, costInfrastructureKey, true, false),
            symbol: {
              fill: chartStyles.currentColorScale[1],
              type: 'dash',
            },
            tooltip: getCostRangeString(currentInfrastructureCostData, costInfrastructureTooltipKey, false, false),
          },
          style: {
            data: {
              ...chartStyles.currentInfrastructureCostData,
              stroke: chartStyles.currentColorScale[1],
            },
          },
        },
      ],
    });
  };

  private handleResize = () => {
    if (this.containerRef.current) {
      this.setState({ width: this.containerRef.current.clientWidth });
    }
  };

  private getChart = (series: HistoricalCostChartSeries, index: number) => {
    const { hiddenSeries } = this.state;
    return (
      <ChartArea
        data={!hiddenSeries.has(index) ? series.data : [{ y: null }]}
        interpolation="monotoneX"
        key={series.childName}
        name={series.childName}
        style={series.style}
      />
    );
  };

  // Returns CursorVoronoiContainer component
  private getContainer = () => {
    const { CursorVoronoiContainer } = this.state;

    if (!CursorVoronoiContainer) {
      return undefined;
    }

    return (
      <CursorVoronoiContainer
        cursorDimension="x"
        labels={this.isDataAvailable() ? this.getTooltipLabel : undefined}
        labelComponent={
          <ChartLegendTooltip
            legendData={this.getLegendData(true)}
            title={datum => i18next.t('chart.day_of_month_title', { day: datum.x })}
          />
        }
        mouseFollowTooltips
        voronoiDimension="x"
        voronoiPadding={{
          bottom: 120,
          left: 8,
          right: 8,
          top: 8,
        }}
      />
    );
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
    const maxCurrentRequest = currentInfrastructureCostData ? getMaxValue(currentInfrastructureCostData) : 0;
    const maxPreviousLimit = previousCostData ? getMaxValue(previousCostData) : 0;
    const maxPreviousRequest = previousInfrastructureCostData ? getMaxValue(previousInfrastructureCostData) : 0;
    const maxValue = Math.max(maxCurrentLimit, maxCurrentRequest, maxPreviousLimit, maxPreviousRequest);
    const max = maxValue > 0 ? Math.ceil(maxValue + maxValue * 0.1) : 0;

    if (max > 0) {
      domain.y = [0, max];
    }
    return domain;
  }

  private getEndDate() {
    const { currentInfrastructureCostData, previousInfrastructureCostData } = this.props;
    const currentRequestDate = currentInfrastructureCostData
      ? getDate(getDateRange(currentInfrastructureCostData, true, true)[1])
      : 0;
    const previousRequestDate = previousInfrastructureCostData
      ? getDate(getDateRange(previousInfrastructureCostData, true, true)[1])
      : 0;

    return currentRequestDate > 0 || previousRequestDate > 0 ? Math.max(currentRequestDate, previousRequestDate) : 31;
  }

  private getLegend = () => {
    const { legendItemsPerRow } = this.props;
    const { width } = this.state;

    const itemsPerRow = legendItemsPerRow ? legendItemsPerRow : width > 700 ? chartStyles.itemsPerRow : 2;

    return <ChartLegend data={this.getLegendData()} height={25} itemsPerRow={itemsPerRow} name="legend" />;
  };

  private getTooltipLabel = ({ datum }) => {
    const { formatDatumValue, formatDatumOptions } = this.props;
    const formatter = getTooltipContent(formatDatumValue);
    return datum.y !== null ? formatter(datum.y, datum.units, formatDatumOptions) : i18next.t('chart.no_data');
  };

  // Interactive legend

  // Hide each data series individually
  private handleLegendClick = props => {
    if (!this.state.hiddenSeries.delete(props.index)) {
      this.state.hiddenSeries.add(props.index);
    }
    this.setState({ hiddenSeries: new Set(this.state.hiddenSeries) });
  };

  // Returns true if at least one data series is available
  private isDataAvailable = () => {
    const { series } = this.state;

    // API data may not be available (e.g., on 1st of month)
    const unavailable = [];
    if (series) {
      series.forEach((s: any, index) => {
        if (this.isSeriesHidden(index) || (s.data && s.data.length === 0)) {
          unavailable.push(index);
        }
      });
    }
    return unavailable.length !== (series ? series.length : 0);
  };

  // Returns true if data series is hidden
  private isSeriesHidden = index => {
    const { hiddenSeries } = this.state; // Skip if already hidden
    return hiddenSeries.has(index);
  };

  // Returns groups of chart names associated with each data series
  private getChartNames = () => {
    const { series } = this.state;
    const result = [];
    if (series) {
      series.map(serie => {
        // Each group of chart names are hidden / shown together
        result.push(serie.childName);
      });
    }
    return result as any;
  };

  // Returns onMouseOver, onMouseOut, and onClick events for the interactive legend
  private getEvents = () => {
    const result = getInteractiveLegendEvents({
      chartNames: this.getChartNames(),
      isHidden: this.isSeriesHidden,
      legendName: 'legend',
      onLegendClick: this.handleLegendClick,
    });
    return result;
  };

  // Returns legend data styled per hiddenSeries
  private getLegendData = (tooltip: boolean = false) => {
    const { hiddenSeries, series } = this.state;
    if (series) {
      const result = series.map((s, index) => {
        return {
          childName: s.childName,
          ...s.legendItem, // name property
          ...(tooltip && { name: s.legendItem.tooltip }), // Override name property for tooltip
          ...getInteractiveLegendItemStyles(hiddenSeries.has(index)), // hidden styles
        };
      });
      return result;
    }
  };

  public render() {
    const {
      adjustContainerHeight,
      height,
      containerHeight = height,
      padding = {
        bottom: 120,
        left: 8,
        right: 8,
        top: 8,
      },
      title,
      xAxisLabel,
      yAxisLabel,
    } = this.props;
    const { series, width } = this.state;

    const domain = this.getDomain();
    const endDate = this.getEndDate();
    const midDate = Math.floor(endDate / 2);

    const adjustedContainerHeight = adjustContainerHeight
      ? width > 700
        ? containerHeight - 25
        : containerHeight
      : containerHeight;

    return (
      <div className="chartOverride" ref={this.containerRef}>
        <Title headingLevel="h2" style={styles.title} size="xl">
          {title}
        </Title>
        <div style={{ ...styles.chart, height: adjustedContainerHeight }}>
          <Chart
            containerComponent={this.getContainer()}
            domain={domain}
            events={this.getEvents()}
            height={height}
            legendComponent={this.getLegend()}
            legendData={this.getLegendData()}
            legendPosition="bottom"
            padding={padding}
            theme={ChartTheme}
            width={width}
          >
            {series &&
              series.map((s, index) => {
                return this.getChart(s, index);
              })}
            <ChartAxis label={xAxisLabel} style={chartStyles.xAxis} tickValues={[1, midDate, endDate]} />
            <ChartAxis dependentAxis label={yAxisLabel} style={chartStyles.yAxis} />
          </Chart>
        </div>
      </div>
    );
  }
}

export { HistoricalCostChart, HistoricalCostChartProps };
