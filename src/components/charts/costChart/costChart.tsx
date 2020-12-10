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
import { getCostRangeString, getDateRange, getMaxValue, getTooltipContent } from 'components/charts/common/chartUtils';
import getDate from 'date-fns/get_date';
import i18next from 'i18next';
import React from 'react';
import { FormatOptions, ValueFormatter } from 'utils/formatValue';
import { DomainTuple, VictoryStyleInterface } from 'victory-core';

import { chartStyles } from './costChart.styles';

interface CostChartProps {
  adjustContainerHeight?: boolean;
  containerHeight?: number;
  currentCostData: any;
  currentInfrastructureCostData?: any;
  forecastData?: any;
  forecastConeData?: any;
  formatDatumValue?: ValueFormatter;
  formatDatumOptions?: FormatOptions;
  height?: number;
  legendItemsPerRow?: number;
  padding?: any;
  previousInfrastructureCostData?: any;
  previousCostData?: any;
  showForecast?: boolean; // Show forecast legend regardless if data is available
  title?: string;
}

interface CostChartData {
  name?: string;
}

interface CostChartLegendItem {
  childName?: string;
  name?: string;
  symbol?: any;
  tooltip?: string;
}

interface CostChartSeries {
  childName?: string;
  data?: [CostChartData];
  legendItem?: CostChartLegendItem;
  style?: VictoryStyleInterface;
}

interface State {
  cursorVoronoiContainer?: any;
  hiddenSeries: Set<number>;
  series?: CostChartSeries[];
  width: number;
}

class CostChart extends React.Component<CostChartProps, State> {
  private containerRef = React.createRef<HTMLDivElement>();
  public navToggle: any;
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
      this.navToggle = insights.chrome.on('NAVIGATION_TOGGLE', this.handleNavToggle);
    });
    this.initDatum();
  }

  public componentDidUpdate(prevProps: CostChartProps) {
    if (
      prevProps.currentInfrastructureCostData !== this.props.currentInfrastructureCostData ||
      prevProps.currentCostData !== this.props.currentCostData ||
      prevProps.forecastData !== this.props.forecastData ||
      prevProps.forecastConeData !== this.props.forecastConeData ||
      prevProps.previousInfrastructureCostData !== this.props.previousInfrastructureCostData ||
      prevProps.previousCostData !== this.props.previousCostData
    ) {
      this.initDatum();
    }
  }

  public componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
    if (this.navToggle) {
      this.navToggle();
    }
  }

  private initDatum = () => {
    const {
      currentInfrastructureCostData,
      currentCostData,
      forecastData,
      forecastConeData,
      previousInfrastructureCostData,
      previousCostData,
      showForecast,
    } = this.props;

    const costKey = 'chart.cost_legend_label';
    const costInfrastructureKey = 'chart.cost_infrastructure_legend_label';
    const costInfrastructureTooltipKey = 'chart.cost_infrastructure_legend_tooltip';
    const costTooltipKey = 'chart.cost_legend_tooltip';

    // Show all legends, regardless of length -- https://github.com/project-koku/koku-ui/issues/248

    const series: CostChartSeries[] = [
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
    ];

    if (showForecast) {
      series.push({
        childName: 'forecast',
        data: forecastData,
        legendItem: {
          name: getCostRangeString(forecastData, 'chart.cost_forecast_legend_label', false, false),
          symbol: {
            fill: chartStyles.forecastColorScale[0],
            type: 'minus',
          },
          tooltip: getCostRangeString(forecastData, 'chart.cost_forecast_legend_tooltip', false, false),
        },
        style: {
          data: {
            ...chartStyles.forecastData,
            stroke: chartStyles.forecastColorScale[0],
          },
        },
      });
      series.push({
        childName: 'forecastCone',
        data: forecastConeData,
        legendItem: {
          name: getCostRangeString(forecastConeData, 'chart.cost_forecast_cone_legend_label', false, false),
          symbol: {
            fill: chartStyles.forecastConeColorScale[0],
            type: 'triangleUp',
          },
          tooltip: getCostRangeString(forecastConeData, 'chart.cost_forecast_cone_legend_tooltip', false, false),
        },
        style: {
          data: {
            ...chartStyles.forecastConeData,
            stroke: chartStyles.forecastConeColorScale[0],
          },
        },
      });
    }
    const cursorVoronoiContainer = this.getCursorVoronoiContainer();
    this.setState({ cursorVoronoiContainer, series });
  };

  private handleNavToggle = () => {
    setTimeout(this.handleResize, 500);
  };

  private handleResize = () => {
    if (this.containerRef.current) {
      this.setState({ width: this.containerRef.current.clientWidth });
    }
  };

  private getChart = (series: CostChartSeries, index: number) => {
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
  private getCursorVoronoiContainer = () => {
    // Note: Container order is important
    const CursorVoronoiContainer: any = createContainer('voronoi', 'cursor');

    return (
      <CursorVoronoiContainer
        cursorDimension="x"
        labels={this.getTooltipLabel}
        mouseFollowTooltips
        voronoiDimension="x"
        voronoiPadding={{
          bottom: 75,
          left: 8,
          right: 8,
          top: 8,
        }}
      />
    );
  };

  private getDomain() {
    const { series } = this.state;

    const domain: { x: DomainTuple; y?: DomainTuple } = { x: [1, 31] };
    let maxValue = 0;

    if (series) {
      series.forEach((s: any, index) => {
        if (!this.isSeriesHidden(index) && s.data && s.data.length !== 0) {
          const max = getMaxValue(s.data);
          maxValue = Math.max(maxValue, max);
        }
      });
    }

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
      forecastData,
      previousInfrastructureCostData,
      previousCostData,
    } = this.props;
    const currentInfrastructureDate = currentInfrastructureCostData
      ? getDate(getDateRange(currentInfrastructureCostData, true, true)[1])
      : 0;
    const currentCostDate = currentCostData ? getDate(getDateRange(currentCostData, true, true)[1]) : 0;
    const forecastCostDate = forecastData ? getDate(getDateRange(forecastData, true, true)[1]) : 0;
    const previousInfrastructureDate = previousInfrastructureCostData
      ? getDate(getDateRange(previousInfrastructureCostData, true, true)[1])
      : 0;
    const previousUsageDate = previousCostData ? getDate(getDateRange(previousCostData, true, true)[1]) : 0;

    return currentInfrastructureDate > 0 ||
      currentCostDate > 0 ||
      previousInfrastructureDate > 0 ||
      previousUsageDate > 0
      ? Math.max(
          currentInfrastructureDate,
          currentCostDate,
          forecastCostDate,
          previousInfrastructureDate,
          previousUsageDate
        )
      : 31;
  }

  private getLegend = () => {
    return <ChartLegend data={this.getLegendData()} height={25} gutter={20} name="legend" responsive={false} />;
  };

  private getTooltipLabel = ({ datum }) => {
    const { formatDatumValue, formatDatumOptions } = this.props;
    const formatter = getTooltipContent(formatDatumValue);
    const dy =
      datum.y !== undefined && datum.y !== null ? formatter(datum.y, datum.units, formatDatumOptions) : undefined;
    const dy0 =
      datum.y0 !== undefined && datum.y0 !== null ? formatter(datum.y0, datum.units, formatDatumOptions) : undefined;

    if (dy !== undefined && dy0 !== undefined) {
      return i18next.t('chart.cost_forecast_cone_tooltip', { value0: dy0, value1: dy });
    }
    return dy !== undefined ? dy : i18next.t('chart.no_data');
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
    const unavailable = []; // API data may not be available (e.g., on 1st of month)

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

  private getAdjustedContainerHeight = () => {
    const { adjustContainerHeight, height, containerHeight = height, showForecast } = this.props;
    const { width } = this.state;

    let adjustedContainerHeight = containerHeight;
    if (adjustContainerHeight) {
      if (showForecast) {
        if (width > 650 && width < 1130) {
          adjustedContainerHeight += 25;
        } else if (width > 450 && width < 650) {
          adjustedContainerHeight += 50;
        } else if (width <= 450) {
          adjustedContainerHeight += 75;
        }
      } else {
        if (width > 450 && width < 725) {
          adjustedContainerHeight += 25;
        } else if (width <= 450) {
          adjustedContainerHeight += 50;
        }
      }
    }
    return adjustedContainerHeight;
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
        const data = {
          childName: s.childName,
          ...s.legendItem, // name property
          ...(tooltip && { name: s.legendItem.tooltip }), // Override name property for tooltip
          ...getInteractiveLegendItemStyles(hiddenSeries.has(index)), // hidden styles
        };
        return data;
      });
      return result;
    }
    return undefined;
  };

  public render() {
    const {
      height,
      padding = {
        bottom: 50,
        left: 8,
        right: 8,
        top: 8,
      },
      title,
    } = this.props;
    const { cursorVoronoiContainer, series, width } = this.state;

    const domain = this.getDomain();
    const endDate = this.getEndDate();
    const midDate = Math.floor(endDate / 2);

    // Clone original container. See https://issues.redhat.com/browse/COST-762
    const container = cursorVoronoiContainer
      ? React.cloneElement(cursorVoronoiContainer, {
          disable: !this.isDataAvailable(),
          labelComponent: (
            <ChartLegendTooltip
              legendData={this.getLegendData(true)}
              title={datum => i18next.t('chart.day_of_month_title', { day: datum.x })}
            />
          ),
        })
      : undefined;

    return (
      <>
        <Title headingLevel="h3" size="md">
          {title}
        </Title>
        <div className="chartOverride" ref={this.containerRef} style={{ height: this.getAdjustedContainerHeight() }}>
          <div style={{ height, width }}>
            <Chart
              containerComponent={container}
              domain={domain}
              events={this.getEvents()}
              height={height}
              legendAllowWrap
              legendComponent={this.getLegend()}
              legendData={this.getLegendData()}
              legendPosition="bottom-left"
              padding={padding}
              theme={ChartTheme}
              width={width}
            >
              {series &&
                series.map((s, index) => {
                  return this.getChart(s, index);
                })}
              <ChartAxis style={chartStyles.xAxis} tickValues={[1, midDate, endDate]} />
              <ChartAxis dependentAxis style={chartStyles.yAxis} />
            </Chart>
          </div>
        </div>
      </>
    );
  }
}

export { CostChart, CostChartProps };
