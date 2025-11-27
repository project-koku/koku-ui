import '../common/chart.scss';

import type { MessageDescriptor } from '@formatjs/intl/src/types';
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
import { chartStyles, styles } from './historicalUsageChart.styles';

interface HistoricalUsageChartOwnProps {
  baseHeight: number;
  currentLimitData?: any;
  currentRequestData?: any;
  currentUsageData: any;
  formatOptions?: FormatOptions;
  formatter?: Formatter;
  legendItemsPerRow?: number;
  limitLabelKey?: MessageDescriptor;
  limitLabelNoDataKey?: MessageDescriptor;
  limitTooltipKey?: MessageDescriptor;
  name?: string;
  padding?: any;
  previousLimitData?: any;
  previousRequestData?: any;
  previousUsageData?: any;
  requestLabelKey?: MessageDescriptor;
  requestLabelNoDataKey?: MessageDescriptor;
  requestTooltipKey?: MessageDescriptor;
  showLimit?: boolean;
  showRequest?: boolean;
  title?: string;
  usageLabelKey?: MessageDescriptor;
  usageLabelNoDataKey?: MessageDescriptor;
  usageTooltipKey?: MessageDescriptor;
  xAxisLabel?: string;
  yAxisLabel?: string;
}

interface State {
  cursorVoronoiContainer?: any;
  extraHeight?: number;
  hiddenSeries?: Set<number>;
  series?: ChartSeries[];
  width?: number;
}

export type HistoricalUsageChartProps = HistoricalUsageChartOwnProps & WrappedComponentProps;

class HistoricalUsageChartBase extends React.Component<HistoricalUsageChartProps, State> {
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

  public componentDidUpdate(prevProps: HistoricalUsageChartProps) {
    if (
      prevProps.currentLimitData !== this.props.currentLimitData ||
      prevProps.currentRequestData !== this.props.currentRequestData ||
      prevProps.currentUsageData !== this.props.currentUsageData ||
      prevProps.previousLimitData !== this.props.previousLimitData ||
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
    const {
      currentLimitData,
      currentRequestData,
      currentUsageData,
      limitLabelKey = messages.chartLimitLabel,
      limitLabelNoDataKey = messages.chartLimitLabelNoData,
      limitTooltipKey = messages.chartLimitTooltip,
      requestLabelKey = messages.chartRequestsLabel,
      requestLabelNoDataKey = messages.chartRequestsLabelNoData,
      requestTooltipKey = messages.chartRequestsTooltip,
      usageLabelKey = messages.chartUsageLabel,
      usageLabelNoDataKey = messages.chartUsageLabelNoData,
      usageTooltipKey = messages.chartUsageTooltip,
      previousLimitData,
      previousRequestData,
      previousUsageData,
      showLimit,
      showRequest,
    } = this.props;

    // Show all legends, regardless of length -- https://github.com/project-koku/koku-ui/issues/248

    const series: ChartSeries[] = [
      {
        childName: 'previousUsage',
        data: previousUsageData,
        legendItem: {
          name: getUsageRangeString(previousUsageData, usageLabelKey, true, true, 1, usageLabelNoDataKey),
          symbol: {
            fill: chartStyles.previousColorScale[0],
            type: 'minus',
          },
          tooltip: getUsageRangeTooltip(previousUsageData, usageTooltipKey, false, false, 1),
        },
        style: {
          data: {
            ...chartStyles.previousUsageData,
            stroke: chartStyles.previousColorScale[0],
          },
        },
      },
      {
        childName: 'currentUsage',
        data: currentUsageData,
        legendItem: {
          name: getUsageRangeString(currentUsageData, usageLabelKey, true, false, 0, usageLabelNoDataKey),
          symbol: {
            fill: chartStyles.currentColorScale[0],
            type: 'minus',
          },
          tooltip: getUsageRangeTooltip(currentUsageData, usageTooltipKey, false, false),
        },
        style: {
          data: {
            ...chartStyles.currentUsageData,
            stroke: chartStyles.currentColorScale[0],
          },
        },
      },
    ];
    if (showRequest) {
      series.push(
        {
          childName: 'previousRequest',
          data: previousRequestData,
          legendItem: {
            name: getUsageRangeString(previousRequestData, requestLabelKey, true, true, 1, requestLabelNoDataKey),
            symbol: {
              fill: chartStyles.previousColorScale[1],
              type: 'dash',
            },
            tooltip: getUsageRangeTooltip(previousRequestData, requestTooltipKey, false, false, 1),
          },
          style: {
            data: {
              ...chartStyles.previousRequestData,
              stroke: chartStyles.previousColorScale[1],
            },
          },
        },
        {
          childName: 'currentRequest',
          data: currentRequestData,
          legendItem: {
            name: getUsageRangeString(currentRequestData, requestLabelKey, true, false, 0, requestLabelNoDataKey),
            symbol: {
              fill: chartStyles.currentColorScale[1],
              type: 'dash',
            },
            tooltip: getUsageRangeTooltip(currentRequestData, requestTooltipKey, false, false),
          },
          style: {
            data: {
              ...chartStyles.currentRequestData,
              stroke: chartStyles.currentColorScale[1],
            },
          },
        }
      );
    }
    if (showLimit) {
      series.push(
        {
          childName: 'previousLimit',
          data: previousLimitData,
          legendItem: {
            name: getUsageRangeString(previousLimitData, limitLabelKey, true, true, 1, limitLabelNoDataKey),
            symbol: {
              fill: chartStyles.previousColorScale[2],
              type: 'minus',
            },
            tooltip: getUsageRangeTooltip(previousLimitData, limitTooltipKey, false, false, 1),
          },
          style: {
            data: {
              ...chartStyles.previousLimitData,
              stroke: chartStyles.previousColorScale[2],
            },
          },
        },
        {
          childName: 'currentLimit',
          data: currentLimitData,
          legendItem: {
            name: getUsageRangeString(currentLimitData, limitLabelKey, true, false, 0, limitLabelNoDataKey),
            symbol: {
              fill: chartStyles.currentColorScale[2],
              type: 'minus',
            },
            tooltip: getUsageRangeTooltip(currentLimitData, limitTooltipKey, false, false),
          },
          style: {
            data: {
              ...chartStyles.currentLimitData,
              stroke: chartStyles.currentColorScale[2],
            },
          },
        }
      );
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

  private getPadding = () => {
    const { extraHeight } = this.state;

    return {
      bottom: 80 + extraHeight, // Maintain chart aspect ratio
      left: 8,
      right: 8,
      top: 8,
    };
  };

  private getLegend = () => {
    const { legendItemsPerRow, name = '' } = this.props;
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
    const { baseHeight, intl, name, padding = this.getPadding(), title, xAxisLabel, yAxisLabel } = this.props;
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
      <div className="chartOverride" ref={this.containerRef}>
        <Title headingLevel="h2" style={styles.title} size={TitleSizes.xl}>
          {title}
        </Title>
        <div style={{ ...styles.chart }}>
          <div style={{ height: chartHeight }} data-testid="historical-chart-wrapper">
            <Chart
              containerComponent={container}
              domain={domain}
              events={this.getEvents()}
              height={chartHeight}
              legendAllowWrap={this.handleLegendAllowWrap}
              legendComponent={this.getLegend()}
              legendData={getLegendData(series, hiddenSeries)}
              legendPosition="bottom"
              name={name}
              padding={padding}
              theme={ChartTheme}
              width={width}
            >
              {series &&
                series.map((s, index) => {
                  return this.getChart(s, index);
                })}
              <ChartAxis
                label={xAxisLabel}
                style={chartStyles.xAxis}
                tickValues={[1, midDate, endDate]}
                fixAxisLabelHeight
              />
              <ChartAxis dependentAxis label={yAxisLabel} style={chartStyles.yAxis} />
            </Chart>
          </div>
        </div>
      </div>
    );
  }
}

const HistoricalUsageChart = injectIntl(HistoricalUsageChartBase);

export default HistoricalUsageChart;
