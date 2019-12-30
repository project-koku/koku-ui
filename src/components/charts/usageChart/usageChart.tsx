import {
  Chart,
  ChartArea,
  ChartAxis,
  ChartLegend,
  ChartVoronoiContainer,
} from '@patternfly/react-charts';
import { css } from '@patternfly/react-styles';
import { default as ChartTheme } from 'components/charts/chartTheme';
import {
  getDateRange,
  getMaxValue,
  getTooltipContent,
  getTooltipLabel,
  getUsageRangeString,
} from 'components/charts/commonChart/chartUtils';
import getDate from 'date-fns/get_date';
import i18next from 'i18next';
import React from 'react';
import { FormatOptions, ValueFormatter } from 'utils/formatValue';
import { DomainTuple, VictoryStyleInterface } from 'victory';
import { chartStyles, styles } from './usageChart.styles';

interface UsageChartProps {
  containerHeight?: number;
  currentRequestData?: any;
  currentUsageData: any;
  formatDatumValue?: ValueFormatter;
  formatDatumOptions?: FormatOptions;
  height?: number;
  legendItemsPerRow?: number;
  padding?: any;
  previousRequestData?: any;
  previousUsageData?: any;
  title?: string;
}

interface UsageChartDatum {
  data?: any;
  name?: string;
  show?: boolean;
  style?: VictoryStyleInterface;
}

interface UsageNameDatum {
  name?: string;
}

interface UsageLegendDatum {
  colorScale?: string[];
  data?: UsageNameDatum[];
  gutter?: number;
  onClick?: (props) => void;
  title?: string;
}

interface Data {
  charts?: UsageChartDatum[];
  legend?: UsageLegendDatum;
}

interface State {
  chartDatum?: Data;
  width: number;
}

class UsageChart extends React.Component<UsageChartProps, State> {
  private containerRef = React.createRef<HTMLDivElement>();
  public state: State = {
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
    window.removeEventListener('resize', this.handleResize);
  }

  private initDatum = () => {
    const {
      currentRequestData,
      currentUsageData,
      previousRequestData,
      previousUsageData,
    } = this.props;

    // Show all legends, regardless of length -- https://github.com/project-koku/koku-ui/issues/248
    const legendData = [];
    const legendColorScale = [];
    const usageKey = 'chart.usage_legend_label';
    const requestKey = 'chart.requests_legend_label';

    if (previousUsageData) {
      const label = getUsageRangeString(
        previousUsageData,
        usageKey,
        true,
        true,
        1
      );
      legendData.push({
        name: label,
        symbol: {
          type: 'minus',
        },
      });
      legendColorScale.push(chartStyles.previousColorScale[0]);
    }
    if (currentUsageData) {
      const label = getUsageRangeString(
        currentUsageData,
        usageKey,
        true,
        false
      );
      legendData.push({
        name: label,
        symbol: {
          type: 'minus',
        },
      });
      legendColorScale.push(chartStyles.currentColorScale[0]);
    }
    if (previousRequestData) {
      const label = getUsageRangeString(
        previousRequestData,
        requestKey,
        true,
        true,
        1
      );
      legendData.push({
        name: label,
        symbol: {
          type: 'dash',
        },
      });
      legendColorScale.push(chartStyles.previousColorScale[1]);
    }
    if (currentRequestData) {
      const label = getUsageRangeString(
        currentRequestData,
        requestKey,
        true,
        false
      );
      legendData.push({
        name: label,
        symbol: {
          type: 'dash',
        },
      });
      legendColorScale.push(chartStyles.currentColorScale[1]);
    }

    this.setState({
      chartDatum: {
        charts: [
          {
            data: previousUsageData,
            name: 'previousUsage',
            show: true,
            style: chartStyles.previousUsageData,
          },
          {
            data: currentUsageData,
            name: 'currentUsage',
            show: true,
            style: chartStyles.currentUsageData,
          },
          {
            data: previousRequestData,
            name: 'previousRequest',
            show: true,
            style: chartStyles.previousRequestData,
          },
          {
            data: currentRequestData,
            name: 'currentRequest',
            show: true,
            style: chartStyles.currentRequestData,
          },
        ],
        legend: {
          colorScale: legendColorScale,
          data: legendData,
          gutter: 55,
          onClick: this.handleLegendClick,
        },
      },
    });
  };

  private handleLegendClick = props => {
    const { chartDatum } = this.state;
    const newDatum = { ...chartDatum };

    if (props.index >= 0 && newDatum.charts.length) {
      newDatum.charts[props.index].show = !newDatum.charts[props.index].show;
      this.setState({ chartDatum: newDatum });
    }
  };

  private handleResize = () => {
    if (this.containerRef.current) {
      this.setState({ width: this.containerRef.current.clientWidth });
    }
  };

  private getChart = (chartDatum: UsageChartDatum, index: number) => {
    if (chartDatum.data && chartDatum.data.length && chartDatum.show) {
      return (
        <ChartArea
          data={chartDatum.data}
          interpolation="basis"
          name={chartDatum.name}
          key={`usage-chart-${index}`}
          style={chartDatum.style}
        />
      );
    } else {
      return null;
    }
  };

  private getDomain() {
    const {
      currentRequestData,
      currentUsageData,
      previousRequestData,
      previousUsageData,
    } = this.props;
    const domain: { x: DomainTuple; y?: DomainTuple } = { x: [1, 31] };

    const maxCurrentRequest = currentRequestData
      ? getMaxValue(currentRequestData)
      : 0;
    const maxCurrentUsage = currentUsageData
      ? getMaxValue(currentUsageData)
      : 0;
    const maxPreviousRequest = previousRequestData
      ? getMaxValue(previousRequestData)
      : 0;
    const maxPreviousUsage = previousUsageData
      ? getMaxValue(previousUsageData)
      : 0;
    const maxValue = Math.max(
      maxCurrentRequest,
      maxCurrentUsage,
      maxPreviousRequest,
      maxPreviousUsage
    );
    const max = maxValue > 0 ? Math.ceil(maxValue + maxValue * 0.1) : 0;

    if (max > 0) {
      domain.y = [0, max];
    }
    return domain;
  }

  private getEndDate() {
    const {
      currentRequestData,
      currentUsageData,
      previousRequestData,
      previousUsageData,
    } = this.props;
    const currentRequestDate = currentRequestData
      ? getDate(getDateRange(currentRequestData, true, true)[1])
      : 0;
    const currentUsageDate = currentUsageData
      ? getDate(getDateRange(currentUsageData, true, true)[1])
      : 0;
    const previousRequestDate = previousRequestData
      ? getDate(getDateRange(previousRequestData, true, true)[1])
      : 0;
    const previousUsageDate = previousUsageData
      ? getDate(getDateRange(previousUsageData, true, true)[1])
      : 0;

    return currentRequestDate > 0 ||
      currentUsageDate > 0 ||
      previousRequestDate > 0 ||
      previousUsageDate > 0
      ? Math.max(
          currentRequestDate,
          currentUsageDate,
          previousRequestDate,
          previousUsageDate
        )
      : 31;
  }

  private getLegend = (chartDatum: UsageLegendDatum, width: number) => {
    if (!(chartDatum && chartDatum.data && chartDatum.data.length)) {
      return null;
    }
    const { legendItemsPerRow, title } = this.props;
    const itemsPerRow = legendItemsPerRow
      ? legendItemsPerRow
      : width > 300
      ? chartStyles.itemsPerRow
      : 1;
    const eventHandlers = {
      onClick: () => {
        return [
          {
            target: 'data',
            mutation: props => {
              chartDatum.onClick(props);
              return null;
            },
          },
        ];
      },
    };
    return (
      <ChartLegend
        colorScale={chartDatum.colorScale}
        data={chartDatum.data}
        events={
          [
            {
              target: 'data',
              eventHandlers,
            },
            {
              target: 'labels',
              eventHandlers,
            },
          ] as any
        }
        height={25}
        itemsPerRow={itemsPerRow}
        responsive
        style={chartStyles.legend}
        title={title}
      />
    );
  };

  private getTooltipLabel = ({ datum }) => {
    const { formatDatumValue, formatDatumOptions } = this.props;

    const value = getTooltipLabel(
      datum,
      getTooltipContent(formatDatumValue),
      formatDatumOptions,
      'date'
    );

    if (
      datum.childName === 'currentRequest' ||
      datum.childName === 'previousRequest'
    ) {
      return i18next.t('chart.requests_tooltip', { value });
    } else if (
      datum.childName === 'currentUsage' ||
      datum.childName === 'previousUsage'
    ) {
      return i18next.t('chart.usage_tooltip', { value });
    }
    return value;
  };

  private isLegendVisible() {
    const { chartDatum } = this.state;

    let result = false;
    if (chartDatum && chartDatum.legend && chartDatum.legend.data) {
      chartDatum.legend.data.forEach(data => {
        if (data.name && data.name.trim() !== '') {
          result = true;
          return;
        }
      });
    }
    return result;
  }

  public render() {
    const { height, containerHeight = height, padding } = this.props;
    const { chartDatum, width } = this.state;

    const container = (
      <ChartVoronoiContainer
        constrainToVisibleArea
        labels={this.getTooltipLabel}
        voronoiDimension="x"
      />
    );
    const domain = this.getDomain();
    const endDate = this.getEndDate();
    const midDate = Math.floor(endDate / 2);
    const legendVisible = this.isLegendVisible();
    return (
      <div
        className={css(styles.chartContainer)}
        ref={this.containerRef}
        style={{ height: containerHeight }}
      >
        <Chart
          containerComponent={container}
          domain={domain}
          height={height}
          legendComponent={
            legendVisible ? this.getLegend(chartDatum.legend, width) : undefined
          }
          legendData={legendVisible ? chartDatum.legend.data : undefined}
          legendPosition="bottom-left"
          padding={padding}
          theme={ChartTheme}
          width={width}
        >
          {Boolean(chartDatum) &&
            chartDatum.charts.map((chart, index) => {
              return this.getChart(chart, index);
            })}
          <ChartAxis
            style={chartStyles.xAxis}
            tickValues={[1, midDate, endDate]}
          />
          <ChartAxis dependentAxis style={chartStyles.yAxis} />
        </Chart>
      </div>
    );
  }
}

export { UsageChart, UsageChartProps };
