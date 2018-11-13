import {
  ChartArea,
  ChartGroup,
  ChartLegend,
  ChartTheme,
  ChartVoronoiContainer,
} from '@patternfly/react-charts';
import { css } from '@patternfly/react-styles';
import { Report } from 'api/reports';
import {
  ChartDatum,
  ChartType,
  getDateRangeString,
  getTooltipLabel,
  transformReport,
} from 'components/commonChart/chartUtils';
import React from 'react';
import { FormatOptions, ValueFormatter } from 'utils/formatValue';
import { chartStyles, styles } from './trendChart.styles';

interface TrendChartProps {
  title: string;
  height: number;
  current: Report;
  previous: Report;
  type: ChartType;
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
    const { title, current, previous, height, type } = this.props;

    const currentData = transformReport(current, type);
    const previousData = transformReport(previous, type);

    const legendData = [
      {
        name: getDateRangeString(currentData),
      },
      {
        name: getDateRangeString(previousData),
      },
    ];

    const container = <ChartVoronoiContainer labels={this.getTooltipLabel} />;

    return (
      <div className={css(styles.reportSummaryTrend)} ref={this.containerRef}>
        <div>
          <ChartGroup
            containerComponent={container}
            height={height}
            width={this.state.width}
          >
            {Boolean(previousData.length) && (
              <ChartArea
                style={chartStyles.previousMonth}
                data={previousData}
              />
            )}
            {Boolean(currentData.length) && (
              <ChartArea style={chartStyles.currentMonth} data={currentData} />
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

export { TrendChart, TrendChartProps };
