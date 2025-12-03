import '../common/chart.scss';

import messages from '@koku-ui/i18n/locales/messages';
import {
  Chart,
  ChartAxis,
  ChartBar,
  ChartLegend,
  ChartLegendTooltip,
  ChartStack,
  ChartThemeColor,
  createContainer,
  getInteractiveLegendEvents,
} from '@patternfly/react-charts/victory';
import React from 'react';
import type { WrappedComponentProps } from 'react-intl';
import { injectIntl } from 'react-intl';

import type { FormatOptions, Formatter } from '../../../../utils/format';
import { formatCurrencyAbbreviation } from '../../../../utils/format';
import { noop } from '../../../utils/noop';
import { getMaxValue } from '../common/chartDatum';
import type { ChartSeries } from '../common/chartUtils';
import {
  getChartNames,
  getLegendData,
  getResizeObserver,
  getTooltipLabel,
  initHiddenSeries,
  isDataAvailable,
  isDataHidden,
  isSeriesHidden,
} from '../common/chartUtils';
import { chartStyles } from './costExplorerChart.styles';

interface CostExplorerChartOwnProps {
  baseHeight?: number;
  formatOptions?: FormatOptions;
  formatter?: Formatter;
  isSkeleton?: boolean;
  legendItemsPerRow?: number;
  name?: string;
  padding?: any;
  top1stData: any;
  top2ndData: any;
  top3rdData: any;
  top4thData: any;
  top5thData: any;
  top6thData: any;
}

interface State {
  cursorVoronoiContainer?: any;
  extraHeight?: number;
  hiddenSeries?: Set<number>;
  series?: ChartSeries[];
  tickValues?: number[];
  width?: number;
  units?: string;
}

export type CostExplorerChartProps = CostExplorerChartOwnProps & WrappedComponentProps;

class CostExplorerChartBase extends React.Component<CostExplorerChartProps, State> {
  private containerRef = React.createRef<HTMLDivElement>();
  private observer: any = noop;

  public state: State = {
    extraHeight: 0,
    hiddenSeries: new Set(),
    tickValues: [],
    width: 0,
  };

  public componentDidMount() {
    this.initDatum();
    this.observer = getResizeObserver(this.containerRef?.current, this.handleResize);
  }

  public componentDidUpdate(prevProps: CostExplorerChartProps) {
    if (
      prevProps.top1stData !== this.props.top1stData ||
      prevProps.top2ndData !== this.props.top2ndData ||
      prevProps.top3rdData !== this.props.top3rdData ||
      prevProps.top4thData !== this.props.top4thData ||
      prevProps.top5thData !== this.props.top5thData ||
      prevProps.top6thData !== this.props.top6thData
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
    const { isSkeleton, top1stData, top2ndData, top3rdData, top4thData, top5thData, top6thData } = this.props;

    const series: ChartSeries[] = [];
    if (top1stData && top1stData.length) {
      const name = this.getTruncatedString(top1stData[0].name);
      series.push({
        childName: 'top1stData',
        data: this.initDatumChildName(top1stData, 'top1stData'),
        legendItem: {
          name,
          symbol: {
            fill: isSkeleton ? undefined : chartStyles.colorScale[0],
          },
          tooltip: name,
        },
        style: {
          data: {
            fill: isSkeleton ? undefined : chartStyles.colorScale[0],
          },
        },
      });
    }
    if (top2ndData && top2ndData.length) {
      const name = this.getTruncatedString(top2ndData[0].name);
      series.push({
        childName: 'top2ndData',
        data: this.initDatumChildName(top2ndData, 'top2ndData'),
        legendItem: {
          name,
          symbol: {
            fill: isSkeleton ? undefined : chartStyles.colorScale[1],
          },
          tooltip: name,
        },
        style: {
          data: {
            fill: isSkeleton ? undefined : chartStyles.colorScale[1],
          },
        },
      });
    }
    if (top3rdData && top3rdData.length) {
      const name = this.getTruncatedString(top3rdData[0].name);
      series.push({
        childName: 'top3rdData',
        data: this.initDatumChildName(top3rdData, 'top3rdData'),
        legendItem: {
          name,
          symbol: {
            fill: isSkeleton ? undefined : chartStyles.colorScale[2],
          },
          tooltip: name,
        },
        style: {
          data: {
            fill: isSkeleton ? undefined : chartStyles.colorScale[2],
          },
        },
      });
    }
    if (top4thData && top4thData.length) {
      const name = this.getTruncatedString(top4thData[0].name);
      series.push({
        childName: 'top4thData',
        data: this.initDatumChildName(top4thData, 'top4thData'),
        legendItem: {
          name,
          symbol: {
            fill: isSkeleton ? undefined : chartStyles.colorScale[3],
          },
          tooltip: name,
        },
        style: {
          data: {
            fill: isSkeleton ? undefined : chartStyles.colorScale[3],
          },
        },
      });
    }
    if (top5thData && top5thData.length) {
      const name = this.getTruncatedString(top5thData[0].name);
      series.push({
        childName: 'top5thData',
        data: this.initDatumChildName(top5thData, 'top5thData'),
        legendItem: {
          name,
          symbol: {
            fill: isSkeleton ? undefined : chartStyles.colorScale[4],
          },
          tooltip: name,
        },
        style: {
          data: {
            fill: isSkeleton ? undefined : chartStyles.colorScale[4],
          },
        },
      });
    }
    if (top6thData && top6thData.length) {
      const name = this.getTruncatedString(top6thData[0].name);
      series.push({
        childName: 'top6thData',
        data: this.initDatumChildName(top6thData, 'top6thData'),
        legendItem: {
          name,
          symbol: {
            fill: isSkeleton ? undefined : chartStyles.colorScale[5],
          },
          tooltip: name,
        },
        style: {
          data: {
            fill: isSkeleton ? undefined : chartStyles.colorScale[5],
          },
        },
      });
    }
    const cursorVoronoiContainer = this.getCursorVoronoiContainer();
    const units = this.getUnits(series);
    this.setState({ cursorVoronoiContainer, series, tickValues: this.getTickValues(), units });
  };

  // Adds a child name to help identify hidden data series
  private initDatumChildName = (data: any, childName: string) => {
    data.map(datum => (datum.childName = childName));
    return data;
  };

  // If bar width exceeds max and domainPadding is true, extra width is returned to help center bars horizontally
  private getBarWidth = (domainPadding: boolean = false) => {
    const { hiddenSeries, series, width } = this.state;
    const maxWidth = 20;
    let maxValue = -1;

    if (series) {
      series.forEach((s: any, index) => {
        if (!isSeriesHidden(hiddenSeries, index) && s.data && s.data.length !== 0) {
          if (s.data.length > maxValue) {
            maxValue = s.data.length;
          }
        }
      });
    }

    // Divide available width into equal sections
    const sections = maxValue * 2 + 1;
    const sectionWidth = maxValue > 0 ? width / sections : 0;

    if (domainPadding) {
      // Add any extra bar width for domain padding
      const extraWidth = sectionWidth > maxWidth ? (sectionWidth - maxWidth) * maxValue : 0;
      return (sectionWidth + extraWidth / 2) * 2;
    }
    return sectionWidth > maxWidth ? maxWidth : sectionWidth;
  };

  private getChart = (series: ChartSeries, index: number, barWidth: number) => {
    const { hiddenSeries } = this.state;
    const data = !hiddenSeries.has(index) ? series.data : [{ y: null }];

    return (
      <ChartBar barWidth={barWidth} data={data} key={series.childName} name={series.childName} style={series.style} />
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

  // Returns domain only if max y values are zero
  private getDomain = (series: ChartSeries[], hiddenSeries: Set<number>) => {
    let maxValue = -1;
    let domain;

    if (series) {
      series.forEach((s: any, index) => {
        if (!isSeriesHidden(hiddenSeries, index) && s.data && s.data.length !== 0) {
          const max = getMaxValue(s.data);
          maxValue = Math.max(maxValue, max);
        }
      });
    }

    if (maxValue <= 0) {
      domain = { y: [0, 100] };
    }
    return domain;
  };

  // Returns onMouseOver, onMouseOut, and onClick events for the interactive legend
  private getEvents = () => {
    const { name = '' } = this.props;
    const { hiddenSeries, series } = this.state;

    const result = getInteractiveLegendEvents({
      chartNames: getChartNames(series),
      isDataHidden: data => isDataHidden(series, hiddenSeries, data),
      isHidden: index => isSeriesHidden(hiddenSeries, index),
      legendName: `${name}-legend`,
      onLegendClick: props => this.handleLegendClick(props.index),
    });
    return result;
  };

  private getHeight = baseHeight => {
    const { extraHeight } = this.state;

    return baseHeight + extraHeight;
  };

  private getPadding = () => {
    const { extraHeight } = this.state;

    return {
      bottom: 50 + extraHeight, // Maintain chart aspect ratio
      left: 40,
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
        gutter={20}
        height={25}
        itemsPerRow={legendItemsPerRow}
        name={`${name}-legend`}
        responsive={false}
      />
    );
  };

  // This ensures we show every 3rd tick value, including the first and last value
  //
  // Note: We're not using Victory's tickCount because it won't always include the last tick value.
  private getTickValues = () => {
    const { top1stData, top2ndData, top3rdData, top4thData, top5thData, top6thData } = this.props;

    // Find the datum with the greatest number of values
    const allDatums = [top1stData, top2ndData, top3rdData, top4thData, top5thData, top6thData];
    let datum;
    allDatums.map(val => {
      if (!datum || datum.length < val.length) {
        datum = val;
      }
    });

    const values = [];
    datum.map(val => {
      values.push(val.x);
    });

    // Prune tick values
    const tickValues = [];
    const modVal = values.length < 6 ? 2 : 3;
    for (let i = 0; i < values.length; i++) {
      if (i % modVal === 0 && i + 2 < values.length) {
        tickValues.push(values[i]);
      } else if (values.length < 3 && i + 1 < values.length) {
        tickValues.push(values[i]);
      }
    }
    tickValues.push(values[values.length - 1]);
    return tickValues;
  };

  private getTruncatedString = (str: string) => {
    const maxChars = 20;
    return str?.length > maxChars ? str.substring(0, maxChars - 1) + '...' : str;
  };

  private getTickValue = (t: number) => {
    const { units } = this.state;

    return formatCurrencyAbbreviation(t, units);
  };

  private getUnits = (series: ChartSeries[]) => {
    if (series) {
      for (const s of series) {
        for (const datum of s.data) {
          if (datum.units) {
            return datum.units;
          }
        }
      }
    }
    return 'USD';
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
    const { baseHeight, intl, isSkeleton, name, padding = this.getPadding() } = this.props;
    const { cursorVoronoiContainer, hiddenSeries, series, tickValues, width } = this.state;

    const barWidth = this.getBarWidth();
    const chartHeight = this.getHeight(baseHeight);

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

    // Note: For tooltip values to match properly, chart groups must be rendered in the order given as legend data
    return (
      <div className="chartOverride" ref={this.containerRef}>
        <div style={{ height: chartHeight }}>
          <Chart
            ariaTitle={intl.formatMessage(messages.explorerChartAriaTitle)}
            containerComponent={isSkeleton ? undefined : container}
            domain={this.getDomain(series, hiddenSeries)}
            domainPadding={{ x: this.getBarWidth(true) }}
            events={this.getEvents()}
            height={chartHeight}
            legendAllowWrap={this.handleLegendAllowWrap}
            legendComponent={this.getLegend()}
            legendData={getLegendData(series, hiddenSeries)}
            legendPosition="bottom-left"
            name={name}
            padding={padding}
            themeColor={isSkeleton ? ChartThemeColor.skeleton : ChartThemeColor.multiOrdered}
            width={width}
          >
            {series && series.length > 0 && (
              <ChartStack>{series.map((s, index) => this.getChart(s, index, barWidth))}</ChartStack>
            )}
            <ChartAxis style={chartStyles.xAxis} tickValues={tickValues} fixLabelOverlap />
            <ChartAxis dependentAxis style={chartStyles.yAxis} tickFormat={this.getTickValue} />
          </Chart>
        </div>
      </div>
    );
  }
}

const CostExplorerChart = injectIntl(CostExplorerChartBase);

export default CostExplorerChart;
