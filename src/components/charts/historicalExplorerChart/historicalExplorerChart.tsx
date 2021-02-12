import 'components/charts/common/charts-common.scss';

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
import { default as ChartTheme } from 'components/charts/chartTheme';
import { getMaxValue } from 'components/charts/common/chartDatumUtils';
import {
  ChartSeries,
  getChartNames,
  getLegendData,
  getTooltipLabel,
  initHiddenSeries,
  isDataAvailable,
  isDataHidden,
  isSeriesHidden,
} from 'components/charts/common/chartUtils';
import i18next from 'i18next';
import React from 'react';
import { FormatOptions, ValueFormatter } from 'utils/formatValue';

import { chartStyles } from './historicalExplorerChart.styles';

interface HistoricalExplorerChartProps {
  adjustContainerHeight?: boolean;
  containerHeight?: number;
  formatDatumValue?: ValueFormatter;
  formatDatumOptions?: FormatOptions;
  height?: number;
  legendItemsPerRow?: number;
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
  width: number;
}

class HistoricalExplorerChart extends React.Component<HistoricalExplorerChartProps, State> {
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

  public componentDidUpdate(prevProps: HistoricalExplorerChartProps) {
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
    window.removeEventListener('resize', this.handleResize);
    if (this.navToggle) {
      this.navToggle();
    }
  }

  private initDatum = () => {
    const { top1stData, top2ndData, top3rdData, top4thData, top5thData, top6thData } = this.props;

    const series: ChartSeries[] = [];
    if (top1stData && top1stData.length) {
      series.push({
        childName: 'top1stData',
        data: this.initDatumChildName(top1stData, 'top1stData'),
        legendItem: {
          name: top1stData[0].name, // Todo: get report label
          symbol: {
            fill: chartStyles.colorScale[0],
          },
          tooltip: top1stData[0].name,
        },
        style: {
          data: {
            fill: chartStyles.colorScale[0],
          },
        },
      });
    }
    if (top2ndData && top2ndData.length) {
      series.push({
        childName: 'top2ndData',
        data: this.initDatumChildName(top2ndData, 'top2ndData'),
        legendItem: {
          name: top2ndData[0].name,
          symbol: {
            fill: chartStyles.colorScale[1],
          },
          tooltip: top2ndData[0].name,
        },
        style: {
          data: {
            fill: chartStyles.colorScale[1],
          },
        },
      });
    }
    if (top3rdData && top3rdData.length) {
      series.push({
        childName: 'top3rdData',
        data: this.initDatumChildName(top3rdData, 'top3rdData'),
        legendItem: {
          name: top3rdData[0].name,
          symbol: {
            fill: chartStyles.colorScale[2],
          },
          tooltip: top3rdData[0].name,
        },
        style: {
          data: {
            fill: chartStyles.colorScale[2],
          },
        },
      });
    }
    if (top4thData && top4thData.length) {
      series.push({
        childName: 'top4thData',
        data: this.initDatumChildName(top4thData, 'top4thData'),
        legendItem: {
          name: top4thData[0].name,
          symbol: {
            fill: chartStyles.colorScale[3],
          },
          tooltip: top4thData[0].name,
        },
        style: {
          data: {
            fill: chartStyles.colorScale[3],
          },
        },
      });
    }
    if (top5thData && top5thData.length) {
      series.push({
        childName: 'top5thData',
        data: this.initDatumChildName(top5thData, 'top5thData'),
        legendItem: {
          name: top5thData[0].name,
          symbol: {
            fill: chartStyles.colorScale[4],
          },
          tooltip: top5thData[0].name,
        },
        style: {
          data: {
            fill: chartStyles.colorScale[4],
          },
        },
      });
    }
    if (top6thData && top6thData.length) {
      series.push({
        childName: 'top6thData',
        data: this.initDatumChildName(top6thData, 'top6thData'),
        legendItem: {
          name: top6thData[0].name,
          symbol: {
            fill: chartStyles.colorScale[5],
          },
          tooltip: top6thData[0].name,
        },
        style: {
          data: {
            fill: chartStyles.colorScale[5],
          },
        },
      });
    }
    const cursorVoronoiContainer = this.getCursorVoronoiContainer();
    this.setState({ cursorVoronoiContainer, series });
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
      if (width > 675 && width < 1175) {
        adjustedContainerHeight += 25;
      } else if (width > 450 && width < 675) {
        adjustedContainerHeight += 50;
      } else if (width <= 450) {
        adjustedContainerHeight += 75;
      }
    }
    return adjustedContainerHeight;
  };

  private getChart = (series: ChartSeries, index: number) => {
    const { hiddenSeries } = this.state;

    if (!hiddenSeries.has(index)) {
      return (
        <ChartBar
          alignment="start"
          data={series.data}
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
          bottom: 75,
          left: 8,
          right: 8,
          top: 8,
        }}
      />
    );
  };

  // Returns domain only if max y values are zero
  private getDomain(series: ChartSeries[], hiddenSeries: Set<number>) {
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
      domain = { y: [0, 1] };
    }
    return domain;
  }

  // Returns onMouseOver, onMouseOut, and onClick events for the interactive legend
  private getEvents() {
    const { hiddenSeries, series } = this.state;

    const result = getInteractiveLegendEvents({
      chartNames: getChartNames(series),
      isDataHidden: data => isDataHidden(series, hiddenSeries, data),
      isHidden: index => isSeriesHidden(hiddenSeries, index),
      legendName: 'legend',
      onLegendClick: props => this.handleLegendClick(props.index),
    });
    return result;
  }

  private getLegend = () => {
    const { hiddenSeries, series } = this.state;

    return (
      <ChartLegend
        data={getLegendData(series, hiddenSeries)}
        height={25}
        gutter={20}
        name="legend"
        responsive={false}
      />
    );
  };

  // This ensures we show every 3rd tick value, including the first and last value
  //
  // Note: We're not using Victory's tickCount because it won't always include the last tick value.
  private getTickValues() {
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
    for (let i = 0; i < values.length; i++) {
      if (i % 3 === 0) {
        tickValues.push(values[i]);
      }
    }
    tickValues.push(values[values.length - 1]);
    return tickValues;
  }

  // Hide each data series individually
  private handleLegendClick = (index: number) => {
    const hiddenSeries = initHiddenSeries(this.state.series, this.state.hiddenSeries, index);
    this.setState({ hiddenSeries });
  };

  private handleNavToggle = () => {
    setTimeout(this.handleResize, 500);
  };

  private handleResize = () => {
    if (this.containerRef.current) {
      this.setState({ width: this.containerRef.current.clientWidth });
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
    } = this.props;
    const { cursorVoronoiContainer, hiddenSeries, series, width } = this.state;

    // Clone original container. See https://issues.redhat.com/browse/COST-762
    const container = cursorVoronoiContainer
      ? React.cloneElement(cursorVoronoiContainer, {
          disable: !isDataAvailable(series, hiddenSeries),
          labelComponent: (
            <ChartLegendTooltip
              legendData={getLegendData(series, hiddenSeries, true)}
              title={datum => i18next.t('chart.day_of_month_title', { day: datum.x })}
            />
          ),
        })
      : undefined;

    // Note: For tooltip values to match properly, chart groups must be rendered in the order given as legend data
    return (
      <div className="chartOverride" ref={this.containerRef} style={{ height: this.getAdjustedContainerHeight() }}>
        <div style={{ height, width }}>
          <Chart
            containerComponent={container}
            domain={this.getDomain(series, hiddenSeries)}
            events={this.getEvents()}
            height={height}
            legendAllowWrap
            legendComponent={this.getLegend()}
            legendData={getLegendData(series, hiddenSeries)}
            legendPosition="bottom-left"
            padding={padding}
            theme={ChartTheme}
            themeColor={ChartThemeColor.multiOrdered}
            width={width}
          >
            {series && series.length > 0 && (
              <ChartStack>{series.map((s, index) => this.getChart(s, index))}</ChartStack>
            )}
            <ChartAxis style={chartStyles.xAxis} tickValues={this.getTickValues()} />
            <ChartAxis dependentAxis style={chartStyles.yAxis} />
          </Chart>
        </div>
      </div>
    );
  }
}

export { HistoricalExplorerChart, HistoricalExplorerChartProps };
