import {
  ChartContainer,
  ChartLegend,
  ChartPie,
} from '@patternfly/react-charts';
import { css } from '@patternfly/react-styles';
import { ChartDatum } from 'components/commonChart';
import { getTooltipLabel } from 'components/commonChart/chartUtils';
import React from 'react';
import { FormatOptions, ValueFormatter } from 'utils/formatValue';
import { styles } from './pieChart.styles';

interface PieChartProps {
  data: any;
  legendData?: any;
  formatDatumValue: ValueFormatter;
  formatDatumOptions?: FormatOptions;
  groupBy: string;
  height: number;
  title?: string;
  width: number;
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
    const { height, width, data, legendData } = this.props;

    return (
      <div ref={this.containerRef}>
        {Boolean(data.length) && (
          <div className={css(styles.chartInline)}>
            <ChartPie
              data={data}
              labels={this.getTooltipLabel}
              height={height}
              width={width}
              containerComponent={<ChartContainer responsive={false} />}
            />
            <ChartLegend
              data={legendData}
              orientation={'vertical'}
              y={15}
              containerComponent={<ChartContainer responsive={false} />}
            />
          </div>
        )}
      </div>
    );
  }
}

export { PieChart, PieChartProps };
