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

import { chartStyles, styles } from './historicalTrendChart.styles';

interface HistoricalTrendChartProps {
  containerHeight?: number;
  currentData: any;
  height: number;
  padding?: any;
  previousData?: any;
  formatDatumValue: ValueFormatter;
  formatDatumOptions?: FormatOptions;
  legendItemsPerRow?: number;
  title?: string;
  showUsageLegendLabel?: boolean;
  units?: string;
  xAxisLabel?: string;
  yAxisLabel?: string;
}

interface HistoricalTrendChartData {
  name?: string;
}

interface HistoricalTrendChartLegendItem {
  name?: string;
  symbol?: any;
  tooltip?: string;
}

interface HistoricalTrendChartSeries {
  childName?: string;
  data?: [HistoricalTrendChartData];
  legendItem?: HistoricalTrendChartLegendItem;
  style?: VictoryStyleInterface;
}

interface State {
  hiddenSeries: Set<number>;
  series?: HistoricalTrendChartSeries[];
  width: number;
}

class HistoricalTrendChart extends React.Component<HistoricalTrendChartProps, State> {
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

  public componentDidUpdate(prevProps: HistoricalTrendChartProps) {
    if (prevProps.currentData !== this.props.currentData || prevProps.previousData !== this.props.previousData) {
      this.initDatum();
    }
  }

  public componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }

  private initDatum = () => {
    const { currentData, previousData, showUsageLegendLabel = false } = this.props;

    const key = showUsageLegendLabel ? 'chart.usage_legend_label' : 'chart.cost_legend_label';
    const toolTipKey = showUsageLegendLabel ? 'chart.usage_legend_tooltip' : 'chart.cost_legend_tooltip';

    // Show all legends, regardless of length -- https://github.com/project-koku/koku-ui/issues/248

    this.setState({
      series: [
        {
          childName: 'previousCost',
          data: previousData,
          legendItem: {
            name: getCostRangeString(previousData, key, true, true, 1),
            symbol: {
              fill: chartStyles.previousColorScale[0],
              type: 'minus',
            },
            tooltip: getCostRangeString(previousData, toolTipKey, false, false, 1),
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
              fill: chartStyles.currentColorScale[1],
              type: 'minus',
            },
            tooltip: getCostRangeString(currentData, toolTipKey, false, false),
          },
          style: {
            data: {
              ...chartStyles.currentMonthData,
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

  private getChart = (series: HistoricalTrendChartSeries, index: number) => {
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
    // Note: Container order is important
    const CursorVoronoiContainer: any = createContainer('voronoi', 'cursor');

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
    const { currentData, previousData } = this.props;
    const domain: { x: DomainTuple; y?: DomainTuple } = { x: [1, 31] };

    const maxCurrent = currentData ? getMaxValue(currentData) : 0;
    const maxPrevious = previousData ? getMaxValue(previousData) : 0;
    const maxValue = Math.max(maxCurrent, maxPrevious);
    const max = maxValue > 0 ? Math.ceil(maxValue + maxValue * 0.1) : 0;

    if (max > 0) {
      domain.y = [0, max];
    }
    return domain;
  }

  private getEndDate() {
    const { currentData, previousData } = this.props;
    const previousDate = previousData ? getDate(getDateRange(previousData, true, true)[1]) : 0;
    const currentDate = currentData ? getDate(getDateRange(currentData, true, true)[1]) : 0;

    return currentDate > 0 || previousDate > 0 ? Math.max(currentDate, previousDate) : 31;
  }

  private getLegend = () => {
    const { legendItemsPerRow } = this.props;

    return (
      <ChartLegend data={this.getLegendData()} height={25} gutter={20} itemsPerRow={legendItemsPerRow} name="legend" />
    );
  };

  private getTooltipLabel = ({ datum }) => {
    const { formatDatumValue, formatDatumOptions, units } = this.props;
    const formatter = getTooltipContent(formatDatumValue);
    return datum.y !== null ? formatter(datum.y, units || datum.units, formatDatumOptions) : i18next.t('chart.no_data');
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

    return (
      <div className="chartOverride" ref={this.containerRef}>
        <Title headingLevel="h2" style={styles.title} size="xl">
          {title}
        </Title>
        <div style={{ ...styles.chart, height: containerHeight }}>
          <div style={{ height, width }}>
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
      </div>
    );
  }
}

export { HistoricalTrendChart, HistoricalTrendChartProps };
