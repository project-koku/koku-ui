import { css } from '@patternfly/react-styles';
import { Report } from 'api/reports';
import { ChartDatum, ChartTitle } from 'components/commonChart';
import {
  ChartType,
  getTooltipLabel,
  transformReport,
} from 'components/commonChart/chartUtils';
import React from 'react';
import { FormatOptions, ValueFormatter } from 'utils/formatValue';
import { formatCurrency } from 'utils/formatValue';
import {
  VictoryGroup,
  VictoryLegend,
  VictoryPie,
  VictoryTooltip,
} from 'victory';
import { chartStyles, styles } from './pieChart.styles';

interface PieChartProps {
  title?: string;
  height: number;
  width: number;
  data: Report;
  formatDatumValue: ValueFormatter;
  formatDatumOptions?: FormatOptions;
  groupBy: string;
}

interface State {
  width: number;
}

class PieChart extends React.Component<PieChartProps, State> {
  private containerRef = React.createRef<HTMLDivElement>();
  public state: State = {
    width: 0,
  };

  public shouldComponentUpdate(nextProps: PieChartProps) {
    if (!nextProps.data) {
      return false;
    }
    return true;
  }

  private getTooltipLabel = (datum: ChartDatum) => {
    const { formatDatumValue, formatDatumOptions, groupBy } = this.props;
    const label = getTooltipLabel(
      datum,
      formatDatumValue,
      formatDatumOptions,
      groupBy
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
    const { title, height, width, data, groupBy } = this.props;

    const currentData = transformReport(data, ChartType.monthly, groupBy);
    const legendData = currentData.map(item => ({
      name: item.name.toString() + ' (' + formatCurrency(item.y) + ')',
      symbol: { type: 'square' },
    }));
    const colors = 'cool';

    return (
      <div className={css(styles.pieGroup)} ref={this.containerRef}>
        <VictoryGroup
          padding={chartStyles.padding}
          height={height}
          width={width}
          colorScale={colors}
        >
          {Boolean(currentData.length) && (
            <VictoryPie
              colorScale={colors}
              style={chartStyles.pie}
              data={currentData}
              labels={this.getTooltipLabel}
              labelComponent={
                <VictoryTooltip
                  cornerRadius={0}
                  flyoutStyle={chartStyles.tooltipFlyout}
                />
              }
            />
          )}
        </VictoryGroup>
        <svg width={300} height={250}>
          {Boolean(currentData.length) && (
            <VictoryLegend
              key={title}
              standalone={false}
              colorScale={colors}
              x={0}
              y={0}
              gutter={20}
              data={legendData}
            />
          )}
        </svg>
        <ChartTitle>{title}</ChartTitle>
      </div>
    );
  }
}

export { PieChart, PieChartProps };
