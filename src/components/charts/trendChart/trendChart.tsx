import 'components/charts/common/charts-common.scss';

import {
  Chart,
  ChartArea,
  ChartAxis,
  ChartLegend,
  ChartLegendTooltip,
  createContainer,
  getInteractiveLegendEvents,
} from '@patternfly/react-charts';
import { Title } from '@patternfly/react-core';
import { default as ChartTheme } from 'components/charts/chartTheme';
import { getCostRangeString, getDateRange } from 'components/charts/common/chartDatumUtils';
import {
  ChartSeries,
  getChartNames,
  getDomain,
  getLegendData,
  getResizeObserver,
  getTooltipLabel,
  initHiddenSeries,
  isDataAvailable,
  isSeriesHidden,
} from 'components/charts/common/chartUtils';
import { getDate } from 'date-fns';
import i18next from 'i18next';
import React from 'react';
import { FormatOptions, ValueFormatter } from 'utils/formatValue';
import { noop } from 'utils/noop';

import { chartStyles } from './trendChart.styles';

interface TrendChartProps {
  adjustContainerHeight?: boolean;
  containerHeight?: number;
  currentData: any;
  forecastData?: any;
  forecastConeData?: any;
  height?: number;
  legendItemsPerRow?: number;
  previousData?: any;
  formatDatumValue: ValueFormatter;
  formatDatumOptions?: FormatOptions;
  padding?: any;
  showForecast?: boolean; // Show forecast legend regardless if data is available
  showSupplementaryLabel?: boolean; // Show supplementary cost labels
  showUsageLegendLabel?: boolean; // The cost legend label is shown by default
  title?: string;
  units?: string;
}

interface State {
  cursorVoronoiContainer?: any;
  hiddenSeries: Set<number>;
  series?: ChartSeries[];
  width: number;
}

class TrendChart extends React.Component<TrendChartProps, State> {
  private containerRef = React.createRef<HTMLDivElement>();
  private resizeObserver: any = noop;
  private navToggle: any = noop;
  public state: State = {
    hiddenSeries: new Set(),
    width: 0,
  };

  public componentDidMount() {
    this.initDatum();
    this.initResizeObserve();
  }

  public componentDidUpdate(prevProps: TrendChartProps) {
    if (
      prevProps.currentData !== this.props.currentData ||
      prevProps.forecastData !== this.props.forecastData ||
      prevProps.forecastConeData !== this.props.forecastConeData ||
      prevProps.previousData !== this.props.previousData
    ) {
      this.initDatum();
    }
  }

  public componentWillUnmount() {
    if (this.resizeObserver) {
      this.resizeObserver();
    }
    if (this.navToggle) {
      this.navToggle();
    }
  }

  private initDatum = () => {
    const {
      currentData,
      forecastData,
      forecastConeData,
      previousData,
      showForecast,
      showSupplementaryLabel = false,
      showUsageLegendLabel = false,
    } = this.props;

    const key = showUsageLegendLabel
      ? 'chart.usage_legend_label'
      : showSupplementaryLabel
      ? 'chart.cost_supplementary_legend_label'
      : 'chart.cost_legend_label';

    const tooltipKey = showUsageLegendLabel
      ? 'chart.usage_legend_tooltip'
      : showSupplementaryLabel
      ? 'chart.cost_supplementary_legend_tooltip'
      : 'chart.cost_legend_tooltip';

    // Show all legends, regardless of length -- https://github.com/project-koku/koku-ui/issues/248

    const series: ChartSeries[] = [
      {
        childName: 'previousCost',
        data: previousData,
        legendItem: {
          name: getCostRangeString(previousData, key, true, true, 1),
          symbol: {
            fill: chartStyles.previousColorScale[0],
            type: 'minus',
          },
          tooltip: getCostRangeString(previousData, tooltipKey, false, false, 1),
        },
        style: {
          data: {
            ...chartStyles.previousMonthData,
            stroke: chartStyles.previousColorScale[0],
          },
        },
      },
      {
        childName: 'currentCost',
        data: currentData,
        legendItem: {
          name: getCostRangeString(currentData, key, true, false),
          symbol: {
            fill: chartStyles.currentColorScale[0],
            type: 'minus',
          },
          tooltip: getCostRangeString(currentData, tooltipKey, false, false),
        },
        style: {
          data: {
            ...chartStyles.currentMonthData,
            stroke: chartStyles.currentColorScale[0],
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
            fill: chartStyles.forecastDataColorScale[0],
            type: 'minus',
          },
          tooltip: getCostRangeString(forecastData, 'chart.cost_forecast_legend_tooltip', false, false),
        },
        style: {
          data: {
            ...chartStyles.forecastData,
            stroke: chartStyles.forecastDataColorScale[0],
          },
        },
      });
      series.push({
        childName: 'forecastCone',
        data: forecastConeData,
        legendItem: {
          name: getCostRangeString(forecastConeData, 'chart.cost_forecast_cone_legend_label', false, false),
          symbol: {
            fill: chartStyles.forecastConeDataColorScale[0],
            type: 'triangleUp',
          },
          tooltip: getCostRangeString(forecastConeData, 'chart.cost_forecast_cone_legend_tooltip', false, false),
        },
        style: {
          data: {
            ...chartStyles.forecastConeData,
            stroke: chartStyles.forecastConeDataColorScale[0],
          },
        },
      });
    }
    const cursorVoronoiContainer = this.getCursorVoronoiContainer();
    this.setState({ cursorVoronoiContainer, series });
  };

  private initResizeObserve = () => {
    const containerElement = this.containerRef.current;

    if (containerElement) {
      const resizeObserver = getResizeObserver(this.handleResize);
      resizeObserver.observe(containerElement);
      this.resizeObserver = () => resizeObserver.unobserve(containerElement);
    } else {
      this.handleResize();
      window.addEventListener('resize', this.handleResize);
      this.resizeObserver = () => window.removeEventListener('resize', this.handleResize);
      this.navToggle = insights.chrome.on('NAVIGATION_TOGGLE', this.handleNavToggle);
    }
  };

  private getAdjustedContainerHeight = () => {
    const { adjustContainerHeight, height, containerHeight = height, showForecast } = this.props;
    const { width } = this.state;

    let adjustedContainerHeight = containerHeight;
    if (adjustContainerHeight) {
      if (showForecast) {
        if (width < 700) {
          adjustedContainerHeight += 25;
        }
      }
    }
    return adjustedContainerHeight;
  };

  private getChart = (series: ChartSeries, index: number) => {
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
    const { formatDatumValue, formatDatumOptions } = this.props;

    // Note: Container order is important
    const CursorVoronoiContainer: any = createContainer('voronoi', 'cursor');

    return (
      <CursorVoronoiContainer
        cursorDimension="x"
        labels={({ datum }) => getTooltipLabel(datum, formatDatumValue, formatDatumOptions)}
        mouseFollowTooltips
        voronoiDimension="x"
        voronoiPadding={{
          bottom: 50,
          left: 8,
          right: 8,
          top: 8,
        }}
      />
    );
  };

  private getEndDate() {
    const { currentData, forecastData, previousData } = this.props;
    const previousDate = previousData ? getDate(getDateRange(previousData, true, true)[1]) : 0;
    const currentDate = currentData ? getDate(getDateRange(currentData, true, true)[1]) : 0;
    const forecastDate = forecastData ? getDate(getDateRange(forecastData, true, true)[1]) : 0;

    return currentDate > 0 || previousDate > 0 ? Math.max(currentDate, forecastDate, previousDate) : 31;
  }

  // Returns onMouseOver, onMouseOut, and onClick events for the interactive legend
  private getEvents() {
    const { hiddenSeries, series } = this.state;

    const result = getInteractiveLegendEvents({
      chartNames: getChartNames(series),
      isHidden: index => isSeriesHidden(hiddenSeries, index),
      legendName: 'legend',
      onLegendClick: props => this.handleLegendClick(props.index),
    });
    return result;
  }

  private getLegend = () => {
    const { legendItemsPerRow } = this.props;
    const { hiddenSeries, series, width } = this.state;

    // Todo: use PF legendAllowWrap feature
    return (
      <ChartLegend
        data={getLegendData(series, hiddenSeries)}
        gutter={20}
        height={25}
        itemsPerRow={legendItemsPerRow}
        name="legend"
        orientation={width > 150 ? 'horizontal' : 'vertical'}
      />
    );
  };

  // Hide each data series individually
  private handleLegendClick = (index: number) => {
    const hiddenSeries = initHiddenSeries(this.state.series, this.state.hiddenSeries, index);
    this.setState({ hiddenSeries });
  };

  private handleNavToggle = () => {
    setTimeout(this.handleResize, 500);
  };

  private handleResize = () => {
    const { width } = this.state;
    const { clientWidth = 0 } = this.containerRef.current || {};

    if (clientWidth !== width) {
      this.setState({ width: clientWidth });
    }
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
    const { cursorVoronoiContainer, hiddenSeries, series, width } = this.state;

    const domain = getDomain(series, hiddenSeries);
    const endDate = this.getEndDate();
    const midDate = Math.floor(endDate / 2);

    // Federated modules may not have access to the i18next package
    let tooltipTitle;
    if (i18next && i18next.t) {
      tooltipTitle = datum => i18next.t('chart.day_of_month_title', { day: datum.x });
    } else {
      tooltipTitle = datum => `Day ${datum.x}`;
    }

    // Clone original container. See https://issues.redhat.com/browse/COST-762
    const container = cursorVoronoiContainer
      ? React.cloneElement(cursorVoronoiContainer, {
          disable: !isDataAvailable(series, hiddenSeries),
          labelComponent: (
            <ChartLegendTooltip legendData={getLegendData(series, hiddenSeries, true)} title={tooltipTitle} />
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
              legendData={getLegendData(series, hiddenSeries)}
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

export { TrendChart, TrendChartProps };
