import {
  Chart,
  ChartArea,
  ChartLegend,
  ChartTheme,
  ChartVoronoiContainer,
} from '@patternfly/react-charts';
import { css } from '@patternfly/react-styles';
import {
  ChartDatum,
  getTooltipContent,
  getTooltipLabel,
} from 'components/commonChart/chartUtils';
import React from 'react';
import { FormatOptions, ValueFormatter } from 'utils/formatValue';
import { VictoryAxis } from 'victory';
import { chartStyles, styles } from './historicalUsageChart.styles';

interface HistoricalUsageChartProps {
  currentCapacityData?: any;
  currentCapacityLabel?: string;
  currentLimitData?: any;
  currentLimitLabel?: string;
  currentRequestData?: any;
  currentRequestLabel?: string;
  currentUsageData: any;
  currentUsageLabel?: string;
  formatDatumValue?: ValueFormatter;
  formatDatumOptions?: FormatOptions;
  height: number;
  previousCapacityData?: any;
  previousCapacityLabel?: string;
  previousLimitData?: any;
  previousLimitLabel?: string;
  previousRequestData?: any;
  previousRequestLabel?: string;
  previousUsageData?: any;
  previousUsageLabel?: string;
  title?: string;
  xAxisLabel?: string;
  yAxisLabel?: string;
}

interface State {
  width: number;
}

class HistoricalUsageChart extends React.Component<
  HistoricalUsageChartProps,
  State
> {
  private containerRef = React.createRef<HTMLDivElement>();
  public state: State = {
    width: 0,
  };

  public shouldComponentUpdate(nextProps: HistoricalUsageChartProps) {
    if (
      !nextProps.currentCapacityData ||
      !nextProps.currentLimitData ||
      !nextProps.currentRequestData ||
      !nextProps.currentUsageData ||
      !nextProps.previousCapacityData ||
      !nextProps.previousLimitData ||
      !nextProps.previousRequestData ||
      !nextProps.previousUsageData
    ) {
      return false;
    }
    return true;
  }

  private getTooltipLabel = (datum: ChartDatum) => {
    const { formatDatumValue, formatDatumOptions } = this.props;
    return getTooltipLabel(
      datum,
      getTooltipContent(formatDatumValue),
      formatDatumOptions,
      'date'
    );
  };

  private handleResize = () => {
    this.setState({ width: this.containerRef.current.clientWidth });
  };

  public componentDidMount() {
    setTimeout(() => {
      this.setState({ width: this.containerRef.current.clientWidth });
      window.addEventListener('resize', this.handleResize);
    });
  }

  public componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }

  public render() {
    const {
      currentCapacityData,
      currentCapacityLabel,
      currentLimitData,
      currentLimitLabel,
      currentRequestData,
      currentRequestLabel,
      currentUsageData,
      currentUsageLabel,
      height,
      previousCapacityData,
      previousCapacityLabel,
      previousLimitData,
      previousLimitLabel,
      previousRequestData,
      previousRequestLabel,
      previousUsageData,
      previousUsageLabel,
      title,
      xAxisLabel,
      yAxisLabel,
    } = this.props;
    const { width } = this.state;
    const legendWidth = width * 0.25;

    const capacityLegendData = [];
    const limitLegendData = [];
    const usageLegendData = [];
    const requestLegendData = [];

    if (currentUsageData && currentUsageData.length) {
      usageLegendData.push({ name: currentUsageLabel });
    }
    if (previousUsageData && previousUsageData.length) {
      usageLegendData.push({ name: previousUsageLabel });
    }
    if (currentRequestData && currentRequestData.length) {
      requestLegendData.push({ name: currentRequestLabel });
    }
    if (previousRequestData && previousRequestData.length) {
      requestLegendData.push({ name: previousRequestLabel });
    }
    if (currentLimitData && currentLimitData.length) {
      limitLegendData.push({ name: currentLimitLabel });
    }
    if (previousLimitData && previousLimitData.length) {
      limitLegendData.push({ name: previousLimitLabel });
    }
    if (currentCapacityData && currentCapacityData.length) {
      capacityLegendData.push({ name: currentCapacityLabel });
    }
    if (previousCapacityData && previousCapacityData.length) {
      capacityLegendData.push({ name: previousCapacityLabel });
    }

    const container = <ChartVoronoiContainer labels={this.getTooltipLabel} />;

    return (
      <div className={css(styles.reportSummaryTrend)} ref={this.containerRef}>
        <span className={css(styles.title)}>{title}</span>
        <Chart containerComponent={container} height={height} width={width}>
          {Boolean(currentCapacityData && currentCapacityData.length) && (
            <ChartArea
              style={chartStyles.currentCapacityData}
              data={currentCapacityData}
            />
          )}
          {Boolean(currentLimitData && currentLimitData.length) && (
            <ChartArea
              style={chartStyles.currentRequestData}
              data={currentLimitData}
            />
          )}
          {Boolean(currentRequestData && currentRequestData.length) && (
            <ChartArea
              style={chartStyles.currentRequestData}
              data={currentRequestData}
            />
          )}
          {Boolean(currentUsageData && currentUsageData.length) && (
            <ChartArea
              style={chartStyles.currentUsageData}
              data={currentUsageData}
            />
          )}
          {Boolean(previousCapacityData && previousCapacityData.length) && (
            <ChartArea
              style={chartStyles.previousCapacityData}
              data={previousCapacityData}
            />
          )}
          {Boolean(previousLimitData && currentLimitData.length) && (
            <ChartArea
              style={chartStyles.currentLimitData}
              data={currentLimitData}
            />
          )}
          {Boolean(previousRequestData && previousRequestData.length) && (
            <ChartArea
              style={chartStyles.previousRequestData}
              data={previousRequestData}
            />
          )}
          {Boolean(previousUsageData && previousUsageData.length) && (
            <ChartArea
              style={chartStyles.previousUsageData}
              data={previousUsageData}
            />
          )}
          <VictoryAxis label={xAxisLabel} style={chartStyles.axis} />
          <VictoryAxis
            dependentAxis
            label={yAxisLabel}
            style={chartStyles.axis}
          />
        </Chart>
        <div className={css(styles.legendContainer)}>
          {Boolean(usageLegendData && usageLegendData.length) && (
            <ChartLegend
              theme={ChartTheme.light.blue}
              colorScale={chartStyles.usageColorScale}
              data={usageLegendData}
              height={25}
              orientation="vertical"
              width={legendWidth}
            />
          )}
          {Boolean(requestLegendData && requestLegendData.length) && (
            <ChartLegend
              theme={ChartTheme.light.blue}
              colorScale={chartStyles.requestColorScale}
              data={requestLegendData}
              height={25}
              orientation="vertical"
              width={legendWidth}
            />
          )}
          {Boolean(limitLegendData && limitLegendData.length) && (
            <ChartLegend
              theme={ChartTheme.light.blue}
              colorScale={chartStyles.limitColorScale}
              data={limitLegendData}
              height={25}
              orientation="vertical"
              width={legendWidth}
            />
          )}
          {Boolean(capacityLegendData && capacityLegendData.length) && (
            <ChartLegend
              theme={ChartTheme.light.blue}
              colorScale={chartStyles.capacityColorScale}
              data={capacityLegendData}
              height={25}
              orientation="vertical"
              width={legendWidth}
            />
          )}
        </div>
      </div>
    );
  }
}

export { HistoricalUsageChart, HistoricalUsageChartProps };
