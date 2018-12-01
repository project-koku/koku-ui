import {
  ChartArea,
  ChartBar,
  ChartGroup,
  ChartLegend,
  ChartTheme,
  ChartVoronoiContainer,
} from '@patternfly/react-charts';
import { css } from '@patternfly/react-styles';
import { ChartDatum, getTooltipLabel } from 'components/commonChart/chartUtils';
import React from 'react';
import { FormatOptions, ValueFormatter } from 'utils/formatValue';
import { chartStyles, styles } from './usageChart.styles';

interface UsageChartProps {
  title?: string;
  height: number;
  currentData: any;
  formatDatumValue: ValueFormatter;
  formatDatumOptions?: FormatOptions;
  requestData?: any;
  requestLegendLabel?: string;
  usageLegendLabel?: string;
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
    if (!nextProps.currentData || !nextProps.requestData) {
      return false;
    }
    return true;
  }

  private getTooltipLabel = (datum: ChartDatum) => {
    const { formatDatumValue, formatDatumOptions } = this.props;
    const label = getTooltipLabel(
      datum,
      formatDatumValue,
      formatDatumOptions,
      'date'
    );
    return label;
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
      currentData,
      height,
      requestData,
      title,
      requestLegendLabel,
      usageLegendLabel,
    } = this.props;

    const legendData = [];
    if (currentData && currentData.length) {
      legendData.push({
        name: usageLegendLabel,
      });
    }
    if (requestData && requestData.length) {
      legendData.push({
        name: requestLegendLabel,
      });
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
            {Boolean(currentData && currentData.length) && (
              <ChartBar style={chartStyles.currentMonth} data={currentData} />
            )}
            {Boolean(requestData && requestData.length) && (
              <ChartArea style={chartStyles.requests} data={requestData} />
            )}
          </ChartGroup>
        </div>
        <ChartLegend
          title={title}
          theme={ChartTheme.dark.blue}
          colorScale={chartStyles.colorScale}
          data={legendData}
          height={50}
          width={this.state.width}
        />
      </div>
    );
  }
}

export { UsageChart, UsageChartProps };
