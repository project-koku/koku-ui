import {
  ChartContainer,
  ChartLegend,
  ChartPie,
} from '@patternfly/react-charts';
import { css } from '@patternfly/react-styles';
import { default as ChartTheme } from 'components/charts/chartTheme';
import { ChartDatum } from 'components/charts/commonChart';
import { getTooltipLabel } from 'components/charts/commonChart/chartUtils';
import React from 'react';
import { FormatOptions, ValueFormatter } from 'utils/formatValue';
import { VictoryStyleInterface } from 'victory';
import { chartStyles, styles } from './pieChart.styles';

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

interface PieChartDatum {
  data?: any;
  show?: boolean;
  style?: VictoryStyleInterface;
}

interface PieNameDatum {
  name: string;
}

interface PieLegendDatum {
  colorScale?: string[];
  data?: PieNameDatum[];
  onClick?: (props) => void;
}

interface Data {
  chart?: PieChartDatum;
  legend?: PieLegendDatum;
}

interface State {
  datum?: {
    cost?: Data;
  };
  width: number;
}

class PieChart extends React.Component<PieChartProps, State> {
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

  public componentDidUpdate(prevProps: PieChartProps) {
    if (
      prevProps.data !== this.props.data ||
      prevProps.legendData !== this.props.legendData
    ) {
      this.initDatum();
    }
  }

  public componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }

  private initDatum = () => {
    const { data, legendData } = this.props;
    const newData = [...data];

    newData.forEach(val => {
      val.show = true;
    });

    const cost = {
      chart: {
        data: newData,
      },
      legend: {
        data: legendData,
        onClick: this.handleCostLegendClick,
      },
    };

    this.setState({
      datum: {
        cost,
      },
    });
  };

  private handleCostLegendClick = props => {
    const { datum } = this.state;
    const newDatum = { ...datum };

    if (
      props.index >= 0 &&
      newDatum.cost.chart.data &&
      newDatum.cost.chart.data.length
    ) {
      newDatum.cost.chart.data[props.index].show = !newDatum.cost.chart.data[
        props.index
      ].show;
      this.setState({ datum: newDatum });
    }
  };

  private handleResize = () => {
    this.setState({ width: this.containerRef.current.clientWidth });
  };

  private getChart = (datum: PieChartDatum) => {
    const { height, width } = this.props;

    const newData =
      datum && datum.data ? JSON.parse(JSON.stringify(datum.data)) : [];
    newData.forEach((data: any) => {
      if (data.show !== true) {
        data.y = 0;
      }
    });

    if (newData.length) {
      return (
        <ChartPie
          colorScale={chartStyles.colorScale}
          containerComponent={<ChartContainer responsive={false} />}
          data={newData}
          height={height}
          labels={this.getTooltipLabel}
          width={width}
        />
      );
    } else {
      return null;
    }
  };

  private getLegend = (datum: PieLegendDatum, width: number) => {
    if (datum && datum.data && datum.data.length) {
      const eventHandlers = {
        onClick: () => {
          return [
            {
              target: 'data',
              mutation: props => {
                datum.onClick(props);
                return null;
              },
            },
          ];
        },
      };
      return (
        <ChartLegend
          colorScale={chartStyles.colorScale}
          containerComponent={<ChartContainer responsive={false} />}
          data={datum.data}
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
          orientation={'vertical'}
          responsive={false}
          theme={ChartTheme}
          y={15}
        />
      );
    } else {
      return null;
    }
  };

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

  public render() {
    const { width } = this.props;
    const { datum } = this.state;

    return (
      <div ref={this.containerRef}>
        <div style={styles.chartContainer}>
          {Boolean(datum && datum.cost && datum.cost.chart) &&
            this.getChart(datum.cost.chart)}
          {this.getLegend(datum && datum.cost ? datum.cost.legend : {}, width)}
        </div>
      </div>
    );
  }
}

export { PieChart, PieChartProps };
