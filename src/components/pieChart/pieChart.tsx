import { ChartLegend, ChartPie } from '@patternfly/react-charts';
import { css } from '@patternfly/react-styles';
import { Report } from 'api/reports';
import { ChartDatum } from 'components/commonChart';
import {
  ChartType,
  getTooltipLabel,
  transformReport,
} from 'components/commonChart/chartUtils';
import React from 'react';
import { FormatOptions, ValueFormatter } from 'utils/formatValue';
import { formatCurrency } from 'utils/formatValue';
import { styles } from './pieChart.styles';

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
    const { height, width, data, groupBy } = this.props;

    const currentData = transformReport(data, ChartType.monthly, groupBy);
    const legendData = currentData.map(item => ({
      name: item.name.toString() + ' (' + formatCurrency(item.y) + ')',
      symbol: { type: 'square' },
    }));

    // Todo: remove when PF4 supports new color scales
    const colors = 'cool';

    return (
      <div ref={this.containerRef}>
        {Boolean(currentData.length) && (
          <div className={css(styles.chartInline)}>
            <ChartPie
              colorScale={colors}
              data={currentData}
              labels={this.getTooltipLabel}
              height={height}
              width={width}
            />
            <ChartLegend
              data={legendData}
              orientation={'vertical'}
              y={15}
              height={height}
              width={width}
            />
          </div>
        )}
      </div>
    );
  }
}

export { PieChart, PieChartProps };
