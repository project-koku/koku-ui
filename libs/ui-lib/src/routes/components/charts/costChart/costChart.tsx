import '../common/chart.scss';

import messages from '@koku-ui/i18n/locales/messages';
import {
  Chart,
  ChartArea,
  ChartAxis,
  ChartLegend,
  ChartLegendTooltip,
  createContainer,
  getInteractiveLegendEvents,
} from '@patternfly/react-charts/victory';
import { Title, TitleSizes } from '@patternfly/react-core';
import { getDate } from 'date-fns';
import React from 'react';
import type { WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';

import type { FormatOptions, Formatter } from '../../../../utils/format';
import { noop } from '../../../utils/noop';
import { default as ChartTheme } from '../chartTheme';
import { getCostRangeString, getCostRangeTooltip, getDateRange } from '../common/chartDatum';
import type { ChartSeries } from '../common/chartUtils';
import {
  getChartNames,
  getDomain,
  getLegendData,
  getResizeObserver,
  getTooltipLabel,
  initHiddenSeries,
  isDataAvailable,
  isSeriesHidden,
} from '../common/chartUtils';
import { chartStyles } from './costChart.styles';

interface CostChartOwnProps {
  baseHeight?: number;
  currentCostData: any;
  forecastConeData?: any;
  forecastData?: any;
  legendItemsPerRow?: number;
  name?: string;
  padding?: any;
  previousCostData?: any;
  showForecast?: boolean; // Show forecast legend regardless if data is available
  title?: string;
  formatter?: Formatter;
  formatOptions?: FormatOptions;
}

interface State {
  cursorVoronoiContainer?: any;
  extraHeight?: number;
  hiddenSeries?: Set<number>;
  series?: ChartSeries[];
  width?: number;
}

export type CostChartProps = CostChartOwnProps & WrappedComponentProps;

class CostChartBase extends React.Component<CostChartProps, State> {
  private containerRef = React.createRef<HTMLDivElement>();
  private observer: any = noop;

  public state: State = {
    extraHeight: 0,
    hiddenSeries: new Set(),
    width: 0,
  };

  public componentDidMount() {
    this.initDatum();
    this.observer = getResizeObserver(this.containerRef?.current, this.handleResize);
  }

  public componentDidUpdate(prevProps: CostChartProps) {
    if (
      prevProps.currentCostData !== this.props.currentCostData ||
      prevProps.forecastConeData !== this.props.forecastConeData ||
      prevProps.forecastData !== this.props.forecastData ||
      prevProps.previousCostData !== this.props.previousCostData
    ) {
      this.initDatum();
    }
  }

  public componentWillUnmount() {
    if (this.observer) {
      this.observer();
    }
  }

  private initDatum = () => {
    const { currentCostData, forecastConeData, forecastData, previousCostData, showForecast } = this.props;

    const costKey = messages.chartCostLabel;
    const costTooltipKey = messages.chartCostTooltip;

    // Show all legends, regardless of length -- https://github.com/project-koku/koku-ui/issues/248

    const series: ChartSeries[] = [
      {
        childName: 'previousCost',
        data: previousCostData,
        legendItem: {
          name: getCostRangeString(previousCostData, costKey, true, true, 1, messages.chartCostLabelNoData),
          symbol: {
            fill: chartStyles.previousColorScale[0],
            type: 'minus',
          },
          tooltip: getCostRangeTooltip(previousCostData, costTooltipKey, false, false, 1),
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
          name: getCostRangeString(currentCostData, costKey, true, false, 0, messages.chartCostLabelNoData),
          symbol: {
            fill: chartStyles.currentColorScale[0],
            type: 'minus',
          },
          tooltip: getCostRangeTooltip(currentCostData, costTooltipKey, false, false),
        },
        style: {
          data: {
            ...chartStyles.currentCostData,
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
          name: getCostRangeString(
            forecastData,
            messages.chartCostForecastLabel,
            false,
            false,
            0,
            messages.chartCostForecastLabelNoData
          ),
          symbol: {
            fill: chartStyles.forecastDataColorScale[0],
            type: 'minus',
          },
          tooltip: getCostRangeTooltip(forecastData, messages.chartCostForecastTooltip, false, false),
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
          name: getCostRangeString(
            forecastConeData,
            messages.chartCostForecastConeLabel,
            false,
            false,
            0,
            messages.chartCostForecastConeLabelNoData
          ),
          symbol: {
            fill: chartStyles.forecastConeDataColorScale[0],
            type: 'triangleLeft',
          },
          tooltip: getCostRangeTooltip(forecastConeData, messages.chartCostForecastConeTooltip, false, false),
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
    const { formatter, formatOptions } = this.props;

    // Note: Container order is important
    const CursorVoronoiContainer: any = createContainer('voronoi', 'cursor');

    return (
      <CursorVoronoiContainer
        cursorDimension="x"
        labels={({ datum }) => getTooltipLabel(datum, formatter, formatOptions)}
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

  // Returns onMouseOver, onMouseOut, and onClick events for the interactive legend
  private getEvents() {
    const { name = '' } = this.props;
    const { hiddenSeries, series } = this.state;

    const result = getInteractiveLegendEvents({
      chartNames: getChartNames(series),
      isHidden: index => isSeriesHidden(hiddenSeries, index),
      legendName: `${name}-legend`,
      onLegendClick: props => this.handleLegendClick(props.index),
    });
    return result;
  }

  private getEndDate() {
    const { currentCostData, forecastData, previousCostData } = this.props;
    const currentCostDate = currentCostData ? getDate(getDateRange(currentCostData, true, true)[1]) : 0;
    const forecastCostDate = forecastData ? getDate(getDateRange(forecastData, true, true)[1]) : 0;
    const previousUsageDate = previousCostData ? getDate(getDateRange(previousCostData, true, true)[1]) : 0;

    return currentCostDate > 0 || previousUsageDate > 0
      ? Math.max(currentCostDate, forecastCostDate, previousUsageDate)
      : 31;
  }

  private getHeight = baseHeight => {
    const { extraHeight } = this.state;

    return baseHeight + extraHeight;
  };

  private getLegend = () => {
    const { name = '' } = this.props;
    const { hiddenSeries, series } = this.state;

    return (
      <ChartLegend
        data={getLegendData(series, hiddenSeries)}
        height={25}
        gutter={20}
        name={`${name}-legend`}
        responsive={false}
      />
    );
  };

  private getPadding = () => {
    const { extraHeight } = this.state;

    return {
      bottom: 50 + extraHeight, // Maintain chart aspect ratio
      left: 8,
      right: 8,
      top: 8,
    };
  };

  private handleLegendAllowWrap = extraHeight => {
    if (extraHeight !== this.state.extraHeight) {
      this.setState({ extraHeight });
    }
  };

  // Hide each data series individually
  private handleLegendClick = (index: number) => {
    const hiddenSeries = initHiddenSeries(this.state.series, this.state.hiddenSeries, index);
    this.setState({ hiddenSeries });
  };

  private handleResize = () => {
    const { width } = this.state;
    const { clientWidth = 0 } = this.containerRef?.current || {};

    if (clientWidth !== width) {
      this.setState({ width: clientWidth });
    }
  };

  public render() {
    const { baseHeight, intl, name, padding = this.getPadding(), title } = this.props;
    const { cursorVoronoiContainer, hiddenSeries, series, width } = this.state;
    const domain = getDomain(series, hiddenSeries);
    const lastDate = this.getEndDate();

    const half = Math.floor(lastDate / 2);
    const _1stDay = 1;
    const _2ndDay = _1stDay + Math.floor(half / 2);
    const _3rdDay = _1stDay + half;
    const _4thDay = lastDate - Math.floor(half / 2);

    // Clone original container. See https://issues.redhat.com/browse/COST-762
    const container = cursorVoronoiContainer
      ? React.cloneElement(cursorVoronoiContainer, {
          disable: !isDataAvailable(series, hiddenSeries),
          labelComponent: (
            <ChartLegendTooltip
              legendData={getLegendData(series, hiddenSeries, true)}
              title={datum => intl.formatMessage(messages.chartDayOfTheMonth, { day: datum.x })}
            />
          ),
        } as any)
      : undefined;

    const chartHeight = this.getHeight(baseHeight);

    return (
      <>
        {title && (
          <Title headingLevel="h3" size={TitleSizes.md}>
            {title}
          </Title>
        )}
        <div className="chartOverride" ref={this.containerRef}>
          <div style={{ height: chartHeight }}>
            <Chart
              containerComponent={container}
              domain={domain}
              events={this.getEvents()}
              height={chartHeight}
              legendAllowWrap={this.handleLegendAllowWrap}
              legendComponent={this.getLegend()}
              legendData={getLegendData(series, hiddenSeries)}
              legendPosition="bottom-left"
              name={name}
              padding={padding}
              theme={ChartTheme}
              width={width}
            >
              {series &&
                series.map((s, index) => {
                  return this.getChart(s, index);
                })}
              <ChartAxis style={chartStyles.xAxis} tickValues={[_1stDay, _2ndDay, _3rdDay, _4thDay, lastDate]} />
              <ChartAxis dependentAxis style={chartStyles.yAxis} />
            </Chart>
          </div>
        </div>
      </>
    );
  }
}

const CostChart = injectIntl(CostChartBase);

export default CostChart;
