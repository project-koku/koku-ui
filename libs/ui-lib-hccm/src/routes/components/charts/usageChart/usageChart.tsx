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
import { getDateRange, getUsageRangeString, getUsageRangeTooltip } from '../common/chartDatum';
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
import { chartStyles } from './usageChart.styles';

interface UsageChartOwnProps {
  baseHeight?: number;
  currentRequestData?: any;
  currentUsageData: any;
  legendItemsPerRow?: number;
  name?: string;
  padding?: any;
  previousRequestData?: any;
  previousUsageData?: any;
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

export type UsageChartProps = UsageChartOwnProps & WrappedComponentProps;

class UsageChartBase extends React.Component<UsageChartProps, State> {
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

  public componentDidUpdate(prevProps: UsageChartProps) {
    if (
      prevProps.currentRequestData !== this.props.currentRequestData ||
      prevProps.currentUsageData !== this.props.currentUsageData ||
      prevProps.previousRequestData !== this.props.previousRequestData ||
      prevProps.previousUsageData !== this.props.previousUsageData
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
    const { currentRequestData, currentUsageData, previousRequestData, previousUsageData } = this.props;

    const usageKey = messages.chartUsageLabel;
    const usageTooltipKey = messages.chartUsageTooltip;
    const requestKey = messages.chartRequestsLabel;
    const requestTooltipKey = messages.chartRequestsTooltip;

    // Show all legends, regardless of length -- https://github.com/project-koku/koku-ui/issues/248

    const series: ChartSeries[] = [
      {
        childName: 'previousUsage',
        data: previousUsageData,
        legendItem: {
          name: getUsageRangeString(previousUsageData, usageKey, true, true, 1, messages.chartUsageLabelNoData),
          symbol: {
            fill: chartStyles.legendColorScale[0],
            type: 'minus',
          },
          tooltip: getUsageRangeTooltip(previousUsageData, usageTooltipKey, false, false, 1),
        },
        style: chartStyles.previousUsageData,
      },
      {
        childName: 'currentUsage',
        data: currentUsageData,
        legendItem: {
          name: getUsageRangeString(currentUsageData, usageKey, true, false, 0, messages.chartUsageLabelNoData),
          symbol: {
            fill: chartStyles.legendColorScale[1],
            type: 'minus',
          },
          tooltip: getUsageRangeTooltip(currentUsageData, usageTooltipKey, false, false),
        },
        style: chartStyles.currentUsageData,
      },
      {
        childName: 'previousRequest',
        data: previousRequestData,
        legendItem: {
          name: getUsageRangeString(previousRequestData, requestKey, true, true, 1, messages.chartRequestsLabelNoData),
          symbol: {
            fill: chartStyles.legendColorScale[2],
            type: 'dash',
          },
          tooltip: getUsageRangeTooltip(previousRequestData, requestTooltipKey, false, false, 1),
        },
        style: chartStyles.previousRequestData,
      },
      {
        childName: 'currentRequest',
        data: currentRequestData,
        legendItem: {
          name: getUsageRangeString(currentRequestData, requestKey, true, false, 0, messages.chartRequestsLabelNoData),
          symbol: {
            fill: chartStyles.legendColorScale[3],
            type: 'dash',
          },
          tooltip: getUsageRangeTooltip(currentRequestData, requestTooltipKey, false, false),
        },
        style: chartStyles.currentRequestData,
      },
    ];
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
        voronoiPadding={this.getPadding()}
      />
    );
  };

  private getEndDate() {
    const { currentRequestData, currentUsageData, previousRequestData, previousUsageData } = this.props;
    const currentRequestDate = currentRequestData ? getDate(getDateRange(currentRequestData, true, true)[1]) : 0;
    const currentUsageDate = currentUsageData ? getDate(getDateRange(currentUsageData, true, true)[1]) : 0;
    const previousRequestDate = previousRequestData ? getDate(getDateRange(previousRequestData, true, true)[1]) : 0;
    const previousUsageDate = previousUsageData ? getDate(getDateRange(previousUsageData, true, true)[1]) : 0;

    return currentRequestDate > 0 || currentUsageDate > 0 || previousRequestDate > 0 || previousUsageDate > 0
      ? Math.max(currentRequestDate, currentUsageDate, previousRequestDate, previousUsageDate)
      : 31;
  }

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

  private getHeight = baseHeight => {
    const { extraHeight } = this.state;

    return baseHeight + extraHeight;
  };

  private getLegend = () => {
    const { name = '', legendItemsPerRow } = this.props;
    const { hiddenSeries, series } = this.state;

    return (
      <ChartLegend
        data={getLegendData(series, hiddenSeries)}
        height={25}
        gutter={20}
        itemsPerRow={legendItemsPerRow}
        name={`${name}-legend`}
      />
    );
  };

  private getPadding = () => {
    const { extraHeight } = this.state;

    return {
      bottom: 75 + extraHeight, // Maintain chart aspect ratio
      left: 8,
      right: 8,
      top: 8,
    };
  };

  private handleLegendAllowWrap = extraHeight => {
    const { legendItemsPerRow } = this.props;

    if (!legendItemsPerRow && extraHeight !== this.state.extraHeight) {
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

    const chartHeight = this.getHeight(baseHeight);
    const domain = getDomain(series, hiddenSeries);
    const endDate = this.getEndDate();
    const midDate = Math.floor(endDate / 2);

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

    return (
      <>
        {title?.length && (
          <Title headingLevel="h3" size={TitleSizes.md}>
            {title}
          </Title>
        )}
        <div className="chartOverride" ref={this.containerRef}>
          <div style={{ height: chartHeight }} data-testid="usage-chart-wrapper">
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
              title={title || 'Usage Chart'}
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

const UsageChart = injectIntl(UsageChartBase);

export default UsageChart;
