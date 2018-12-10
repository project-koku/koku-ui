import {
  ChartArea,
  ChartGroup,
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
import { chartStyles, styles } from './usageChart.styles';

interface UsageChartProps {
  currentRequestData?: any;
  currentRequestLabel?: string;
  currentUsageData: any;
  currentUsageLabel?: string;
  formatDatumValue: ValueFormatter;
  formatDatumOptions?: FormatOptions;
  height: number;
  previousRequestData?: any;
  previousRequestLabel?: string;
  previousUsageData?: any;
  previousUsageLabel?: string;
  title?: string;
}

interface State {
  width: number;
}

class UsageChart extends React.Component<UsageChartProps, State> {
  private containerRef = React.createRef<HTMLDivElement>();
  public state: State = {
    width: 0,
  };

  public shouldComponentUpdate(nextProps: UsageChartProps) {
    if (
      !nextProps.currentUsageData ||
      !nextProps.previousUsageData ||
      !nextProps.currentRequestData ||
      !nextProps.previousRequestData
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
      currentRequestData,
      currentRequestLabel,
      currentUsageData,
      currentUsageLabel,
      height,
      previousRequestData,
      previousRequestLabel,
      previousUsageData,
      previousUsageLabel,
      title,
    } = this.props;

    const currentLegendData = [];
    if (currentUsageData && currentUsageData.length) {
      currentLegendData.push({ name: currentUsageLabel });
    }
    if (currentRequestData && currentRequestData.length) {
      currentLegendData.push({ name: currentRequestLabel });
    }

    const previousLegendData = [];
    if (previousUsageData && previousUsageData.length) {
      previousLegendData.push({ name: previousUsageLabel });
    }
    if (previousRequestData && previousRequestData.length) {
      previousLegendData.push({ name: previousRequestLabel });
    }
    const container = <ChartVoronoiContainer labels={this.getTooltipLabel} />;

    return (
      <div className={css(styles.reportSummaryTrend)} ref={this.containerRef}>
        <div>
          <ChartGroup
            containerComponent={container}
            height={height}
            width={this.state.width}
          >
            {Boolean(currentUsageData && currentUsageData.length) && (
              <ChartArea
                style={chartStyles.currentUsageData}
                data={currentUsageData}
              />
            )}
            {Boolean(currentRequestData && currentRequestData.length) && (
              <ChartArea
                style={chartStyles.currentRequestData}
                data={currentRequestData}
              />
            )}
            {Boolean(previousUsageData && previousUsageData.length) && (
              <ChartArea
                style={chartStyles.previousUsageData}
                data={previousUsageData}
              />
            )}
            {Boolean(previousRequestData && previousRequestData.length) && (
              <ChartArea
                style={chartStyles.previousRequestData}
                data={previousRequestData}
              />
            )}
          </ChartGroup>
        </div>
        <ChartLegend
          title={title}
          theme={ChartTheme.dark.blue}
          colorScale={chartStyles.currentColorScale}
          data={currentLegendData}
          height={25}
          width={this.state.width}
        />
        <ChartLegend
          title={title}
          theme={ChartTheme.dark.blue}
          colorScale={chartStyles.previousColorScale}
          data={previousLegendData}
          height={25}
          width={this.state.width}
        />
      </div>
    );
  }
}

export { UsageChart, UsageChartProps };
