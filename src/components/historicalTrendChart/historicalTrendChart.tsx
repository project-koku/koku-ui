import {
  Chart,
  ChartArea,
  // ChartGroup,
  ChartLegend,
  ChartTheme,
  ChartVoronoiContainer,
} from '@patternfly/react-charts';
import { css } from '@patternfly/react-styles';
import {
  ChartDatum,
  getDateRangeString,
  getTooltipContent,
  getTooltipLabel,
} from 'components/commonChart/chartUtils';
import React from 'react';
import { FormatOptions, ValueFormatter } from 'utils/formatValue';
import { VictoryAxis } from 'victory';
import { chartStyles, styles } from './historicalTrendChart.styles';

interface HistoricalTrendChartProps {
  title?: string;
  height: number;
  currentData: any;
  previousData?: any;
  formatDatumValue: ValueFormatter;
  formatDatumOptions?: FormatOptions;
  xAxisLabel?: string;
  yAxisLabel?: string;
}

interface State {
  width: number;
}

class HistoricalTrendChart extends React.Component<
  HistoricalTrendChartProps,
  State
> {
  private containerRef = React.createRef<HTMLDivElement>();
  public state: State = {
    width: 0,
  };

  public shouldComponentUpdate(nextProps: HistoricalTrendChartProps) {
    if (!nextProps.currentData || !nextProps.previousData) {
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
      title,
      currentData,
      previousData,
      height,
      xAxisLabel,
      yAxisLabel,
    } = this.props;
    const { width } = this.state;

    const legendData = [];
    if (previousData && previousData.length) {
      legendData.push({
        name: getDateRangeString(previousData, true, true),
      });
    }
    if (currentData && currentData.length) {
      legendData.push({
        name: getDateRangeString(currentData),
      });
    }
    const container = <ChartVoronoiContainer labels={this.getTooltipLabel} />;

    return (
      <div className={css(styles.reportSummaryTrend)} ref={this.containerRef}>
        <span>{title}</span>
        <Chart containerComponent={container} height={height} width={width}>
          {Boolean(previousData && previousData.length) && (
            <ChartArea style={chartStyles.previousMonth} data={previousData} />
          )}
          {Boolean(currentData && currentData.length) && (
            <ChartArea style={chartStyles.currentMonth} data={currentData} />
          )}
          <VictoryAxis label={xAxisLabel} style={chartStyles.axis} />
          <VictoryAxis
            dependentAxis
            label={yAxisLabel}
            style={chartStyles.axis}
          />
        </Chart>
        <div className={css(styles.legendContainer)}>
          {Boolean(legendData && legendData.length) && (
            <ChartLegend
              theme={ChartTheme.light.blue}
              colorScale={chartStyles.colorScale}
              data={legendData}
              height={50}
              width={width}
            />
          )}
        </div>
      </div>
    );
  }
}

export { HistoricalTrendChart, HistoricalTrendChartProps };
