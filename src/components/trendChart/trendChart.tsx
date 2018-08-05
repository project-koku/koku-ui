import { css } from '@patternfly/react-styles';
import { Report } from 'api/reports';
import React from 'react';
import { FormatOptions, ValueFormatter } from 'utils/formatValue';
import {
  VictoryArea,
  VictoryGroup,
  VictoryTooltip,
  VictoryVoronoiContainer,
} from 'victory';
import { chartStyles, styles } from './trendChart.styles';
import { TrendChartLegend } from './trendChartLegend';
import { TrendChartLegendItem } from './trendChartLegendItem';
import { TrendChartTitle } from './trendChartTitle';
import {
  getTooltipLabel,
  transformReport,
  TrendChartDatum,
  TrendChartType,
} from './trendChartUtils';

interface TrendChartProps {
  title: string;
  height: number;
  current: Report;
  previous: Report;
  type: TrendChartType;
  formatDatumValue: ValueFormatter;
  formatDatumOptions?: FormatOptions;
}

interface State {
  width: number;
}

class TrendChart extends React.Component<TrendChartProps, State> {
  private containerRef = React.createRef<HTMLDivElement>();
  public state: State = {
    width: 0,
  };

  public shouldComponentUpdate(nextProps: TrendChartProps) {
    if (!nextProps.current || !nextProps.previous) {
      return false;
    }
    return true;
  }

  private getTooltipLabel = (datum: TrendChartDatum) => {
    const { formatDatumValue, formatDatumOptions } = this.props;
    return getTooltipLabel(datum, formatDatumValue, formatDatumOptions);
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
    const { title, current, previous, height, type } = this.props;

    const currentData = transformReport(current, type);
    const previousData = transformReport(previous, type);

    return (
      <div className={css(styles.reportSummaryTrend)} ref={this.containerRef}>
        <VictoryGroup
          padding={chartStyles.padding}
          style={chartStyles.group}
          height={height}
          width={this.state.width}
          containerComponent={
            <VictoryVoronoiContainer
              voronoiDimension="x"
              title={title}
              responsive={false}
              labels={this.getTooltipLabel}
              labelComponent={
                <VictoryTooltip
                  cornerRadius={0}
                  style={chartStyles.tooltipText}
                  flyoutStyle={chartStyles.tooltipFlyout}
                />
              }
            />
          }
        >
          {Boolean(previousData.length) && (
            <VictoryArea
              style={chartStyles.previousMonth}
              data={previousData}
            />
          )}
          {Boolean(currentData.length) && (
            <VictoryArea style={chartStyles.currentMonth} data={currentData} />
          )}
        </VictoryGroup>
        <TrendChartTitle>{title}</TrendChartTitle>
        <TrendChartLegend>
          <TrendChartLegendItem isCurrent data={currentData} />
          <TrendChartLegendItem data={previousData} />
        </TrendChartLegend>
      </div>
    );
  }
}

export { TrendChart, TrendChartProps };
