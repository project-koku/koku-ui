import 'routes/views/components/charts/common/charts-common.scss';

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
} from '@patternfly/react-charts';
import messages from 'locales/messages';
import React from 'react';
import { injectIntl, WrappedComponentProps } from 'react-intl';
import { default as ChartTheme } from 'routes/views/components/charts/chartTheme';
import { getMaxValue } from 'routes/views/components/charts/common/chartDatumUtils';
import {
  ChartSeries,
  getChartNames,
  getLegendData,
  getResizeObserver,
  getTooltipLabel,
  initHiddenSeries,
  isDataAvailable,
  isDataHidden,
  isSeriesHidden,
} from 'routes/views/components/charts/common/chartUtils';
import { formatCurrencyAbbreviation, FormatOptions, Formatter } from 'utils/format';
import { noop } from 'utils/noop';

import { chartStyles } from './costExplorerChart.styles';

interface CostExplorerChartOwnProps {
  adjustContainerHeight?: boolean;
  containerHeight?: number;
  formatOptions?: FormatOptions;
  formatter?: Formatter;
  height?: number;
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
  hiddenSeries: Set<number>;
  series?: ChartSeries[];
  tickValues?: number[];
  width: number;
  units?: string;
}

type CostExplorerChartProps = CostExplorerChartOwnProps & WrappedComponentProps;

class CostExplorerChartBase extends React.Component<CostExplorerChartProps, State> {
  private containerRef = React.createRef<HTMLDivElement>();
  private observer: any = noop;

  public state: State = {
    hiddenSeries: new Set(),
    tickValues: [],
    width: 0,
  };

  public componentDidMount() {
    this.initDatum();
    this.observer = getResizeObserver(this.containerRef.current, this.handleResize);
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
    const { top1stData, top2ndData, top3rdData, top4thData, top5thData, top6thData } = this.props;

    const series: ChartSeries[] = [];
    if (top1stData && top1stData.length) {
      const name = this.getTruncatedString(top1stData[0].name);
      series.push({
        childName: 'top1stData',
        data: this.initDatumChildName(top1stData, 'top1stData'),
        legendItem: {
          name,
          symbol: {
            fill: chartStyles.colorScale[0],
          },
          tooltip: name,
        },
        style: {
          data: {
            fill: chartStyles.colorScale[0],
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
            fill: chartStyles.colorScale[1],
          },
          tooltip: name,
        },
        style: {
          data: {
            fill: chartStyles.colorScale[1],
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
            fill: chartStyles.colorScale[2],
          },
          tooltip: name,
        },
        style: {
          data: {
            fill: chartStyles.colorScale[2],
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
            fill: chartStyles.colorScale[3],
          },
          tooltip: name,
        },
        style: {
          data: {
            fill: chartStyles.colorScale[3],
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
            fill: chartStyles.colorScale[4],
          },
          tooltip: name,
        },
        style: {
          data: {
            fill: chartStyles.colorScale[4],
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
            fill: chartStyles.colorScale[5],
          },
          tooltip: name,
        },
        style: {
          data: {
            fill: chartStyles.colorScale[5],
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

  private getAdjustedContainerHeight = () => {
    const { adjustContainerHeight, height, containerHeight = height } = this.props;
    const { width } = this.state;

    let adjustedContainerHeight = containerHeight;
    if (adjustContainerHeight) {
      if (width > 675 && width < 1250) {
        adjustedContainerHeight += 25;
      } else if (width > 400 && width < 650) {
        adjustedContainerHeight += 50;
      } else if (width <= 400) {
        adjustedContainerHeight += 150;
      }
    }
    return adjustedContainerHeight;
  };

  // If bar width exceeds max and domainPadding is true, extra width is returned to help center bars horizontally
  private getBarWidth = (domainPadding: boolean = false) => {
    const { hiddenSeries, series, width } = this.state;
    const maxWidth = 200;
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
        voronoiPadding={{
          bottom: 75,
          left: 8,
          right: 8,
          top: 8,
        }}
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
    const { name } = this.props;
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

  private getLegend = () => {
    const { name } = this.props;
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
    return str.length > maxChars ? str.substr(0, maxChars - 1) + '...' : str;
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

  // Hide each data series individually
  private handleLegendClick = (index: number) => {
    const hiddenSeries = initHiddenSeries(this.state.series, this.state.hiddenSeries, index);
    this.setState({ hiddenSeries });
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
      intl,
      name,
      padding = {
        bottom: 50,
        left: 40,
        right: 8,
        top: 8,
      },
    } = this.props;
    const { cursorVoronoiContainer, hiddenSeries, series, tickValues, width } = this.state;

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
        })
      : undefined;

    const barWidth = this.getBarWidth();

    // Note: For tooltip values to match properly, chart groups must be rendered in the order given as legend data
    return (
      <div className="chartOverride" ref={this.containerRef} style={{ height: this.getAdjustedContainerHeight() }}>
        <div style={{ height, width }}>
          <Chart
            containerComponent={container}
            domain={this.getDomain(series, hiddenSeries)}
            domainPadding={{ x: this.getBarWidth(true) }}
            events={this.getEvents()}
            height={height}
            legendAllowWrap
            legendComponent={this.getLegend()}
            legendData={getLegendData(series, hiddenSeries)}
            legendPosition="bottom-left"
            name={name}
            padding={padding}
            theme={ChartTheme}
            themeColor={ChartThemeColor.multiOrdered}
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

export { CostExplorerChart, CostExplorerChartProps };
