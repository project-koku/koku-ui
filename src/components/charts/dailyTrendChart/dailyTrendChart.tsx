import 'components/charts/common/charts-common.scss';

import {
  Chart,
  ChartAxis,
  ChartBar,
  ChartGroup,
  ChartLegend,
  ChartLegendTooltip,
  ChartLine,
  createContainer,
  getInteractiveLegendEvents,
  getInteractiveLegendItemStyles,
} from '@patternfly/react-charts';
import { Title } from '@patternfly/react-core';
import { default as ChartTheme } from 'components/charts/chartTheme';
import {
  getCostRangeString,
  getDateRange,
  getMaxMinValues,
  getTooltipContent,
} from 'components/charts/common/chartUtils';
import getDate from 'date-fns/get_date';
import i18next from 'i18next';
import React from 'react';
import { FormatOptions, ValueFormatter } from 'utils/formatValue';
import { DomainTuple, VictoryStyleInterface } from 'victory-core';

import { chartStyles } from './dailyTrendChart.styles';

interface DailyTrendChartProps {
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

interface DailyTrendChartData {
  name?: string;
}

interface DailyTrendChartLegendItem {
  name?: string;
  symbol?: any;
  tooltip?: string;
}

interface DailyTrendChartSeries {
  childName?: string;
  data?: [DailyTrendChartData];
  isBar?: boolean;
  isForecast?: boolean;
  isLine?: boolean;
  legendItem?: DailyTrendChartLegendItem;
  style?: VictoryStyleInterface;
}

interface State {
  cursorVoronoiContainer?: any;
  hiddenSeries: Set<number>;
  series?: DailyTrendChartSeries[];
  width: number;
}

class DailyTrendChart extends React.Component<DailyTrendChartProps, State> {
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

  public componentDidUpdate(prevProps: DailyTrendChartProps) {
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
    window.removeEventListener('resize', this.handleResize);
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

    const series: DailyTrendChartSeries[] = [
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
        isBar: true,
        style: {
          data: {
            fill: chartStyles.previousColorScale[0],
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
        isBar: true,
        style: {
          data: {
            fill: chartStyles.currentColorScale[0],
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
        isBar: true,
        isForecast: true,
        style: {
          data: {
            fill: chartStyles.forecastDataColorScale[0],
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
        isForecast: true,
        isLine: true,
        style: {
          data: {
            fill: chartStyles.forecastConeDataColorScale[0],
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

  private getChart = (series: DailyTrendChartSeries, index: number) => {
    const { hiddenSeries } = this.state;

    if (!series.isForecast) {
      const data = !hiddenSeries.has(index) ? series.data : [{ y: null }];

      if (series.isBar) {
        return (
          <ChartBar
            alignment="middle"
            data={data}
            key={series.childName}
            name={series.childName}
            style={series.style}
          />
        );
      } else if (series.isLine) {
        return <ChartLine data={data} key={series.childName} name={series.childName} style={series.style} />;
      }
    }
    return null;
  };

  private getForecastBarChart = (series: DailyTrendChartSeries, index: number) => {
    const { hiddenSeries } = this.state;

    if (series.isForecast && series.isBar) {
      const data = !hiddenSeries.has(index) ? series.data : [{ y: null }];
      return (
        <ChartBar alignment="middle" data={data} key={series.childName} name={series.childName} style={series.style} />
      );
    }
    return null;
  };

  private getForecastLineChart = (series: DailyTrendChartSeries, index: number) => {
    const { hiddenSeries } = this.state;

    if (series.isForecast && series.isLine) {
      const data = !hiddenSeries.has(index) ? series.data : [{ y: null }];
      return (
        <ChartBar
          alignment="middle"
          barWidth={1}
          data={data}
          key={series.childName}
          name={series.childName}
          style={series.style}
        />
      );
    }
    return null;
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
          bottom: 50,
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
    let minValue = 0;

    if (series) {
      series.forEach((s: any, index) => {
        if (!this.isSeriesHidden(index) && s.data && s.data.length !== 0) {
          const { max, min } = getMaxMinValues(s.data);
          maxValue = Math.max(maxValue, max);
          if (minValue === 0) {
            minValue = min;
          } else {
            minValue = Math.min(minValue, min);
          }
        }
      });
    }

    const threshold = maxValue * 0.1;
    const max = maxValue > 0 ? Math.ceil(maxValue + threshold) : 0;
    const _min = minValue > 0 ? Math.max(0, Math.floor(minValue - threshold)) : 0;
    const min = _min > 0 ? _min : 0;

    if (max > 0) {
      domain.y = [min, max];
    }
    return domain;
  }

  private getEndDate() {
    const { currentData, forecastData, previousData } = this.props;
    const previousDate = previousData ? getDate(getDateRange(previousData, true, true)[1]) : 0;
    const currentDate = currentData ? getDate(getDateRange(currentData, true, true)[1]) : 0;
    const forecastDate = forecastData ? getDate(getDateRange(forecastData, true, true)[1]) : 0;

    return currentDate > 0 || previousDate > 0 ? Math.max(currentDate, forecastDate, previousDate) : 31;
  }

  private getLegend = () => {
    const { legendItemsPerRow } = this.props;
    const { width } = this.state;

    // Todo: use PF legendAllowWrap feature
    return (
      <ChartLegend
        data={this.getLegendData()}
        gutter={20}
        height={25}
        itemsPerRow={legendItemsPerRow}
        name="legend"
        orientation={width > 150 ? 'horizontal' : 'vertical'}
      />
    );
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
    const { hiddenSeries, series } = this.state;

    // Toggle forecast confidence
    const childName = series[props.index].childName;
    if (childName.indexOf('forecast') !== -1) {
      let index;
      for (let i = 0; i < series.length; i++) {
        if (series[i].childName === `${childName}Cone`) {
          index = i;
          break;
        }
      }
      if (index !== undefined && !hiddenSeries.delete(index)) {
        hiddenSeries.add(index);
      }
    }
    if (!hiddenSeries.delete(props.index)) {
      hiddenSeries.add(props.index);
    }
    this.setState({ hiddenSeries: new Set(hiddenSeries) });
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
        if (width < 700) {
          adjustedContainerHeight += 25;
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
        return {
          childName: s.childName,
          ...s.legendItem, // name property
          ...(tooltip && { name: s.legendItem.tooltip }), // Override name property for tooltip
          ...getInteractiveLegendItemStyles(hiddenSeries.has(index)), // hidden styles
        };
      });
      return tooltip ? result : result.filter(d => d.childName.indexOf('Cone') === -1);
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
    const lastDate = this.getEndDate();

    const half = Math.floor(lastDate / 2);
    const _1stDay = 1;
    const _2ndDay = _1stDay + Math.floor(half / 2);
    const _3rdDay = _1stDay + half;
    const _4thDay = lastDate - Math.floor(half / 2);

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

    // Note: For tooltip values to match properly, chart groups must be rendered in the order given as legend data
    return (
      <>
        {title && (
          <Title headingLevel="h3" size="md">
            {title}
          </Title>
        )}
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
              {series && series.length > 0 && (
                <ChartGroup offset={11}>{series.map((s, index) => this.getChart(s, index))}</ChartGroup>
              )}
              {series && series.length > 0 && (
                <ChartGroup offset={11}>
                  <ChartBar data={[{ y: null }]} name="forcast_spacer" />
                  {series.map((s, index) => this.getForecastBarChart(s, index))}
                </ChartGroup>
              )}
              {series && series.length > 0 && (
                <ChartGroup offset={11}>
                  <ChartBar data={[{ y: null }]} name="forcast_cone_spacer" />
                  {series.map((s, index) => this.getForecastLineChart(s, index))}
                </ChartGroup>
              )}
              <ChartAxis style={chartStyles.xAxis} tickValues={[_1stDay, _2ndDay, _3rdDay, _4thDay, lastDate]} />
              <ChartAxis dependentAxis style={chartStyles.yAxis} />
            </Chart>
          </div>
        </div>
      </>
    );
  }
}

export { DailyTrendChart, DailyTrendChartProps };
