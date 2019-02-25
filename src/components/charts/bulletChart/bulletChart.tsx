import {
  Chart,
  ChartBar,
  ChartGroup,
  ChartLegend,
  ChartTooltip,
} from '@patternfly/react-charts';
import { css } from '@patternfly/react-styles';
import React from 'react';
import { VictoryAxis } from 'victory';
import { chartStyles, styles } from './bulletChart.styles';

interface BulletChartProps {
  legendItemsPerRow?: number;
  ranges?: any[];
  thresholdError?: any;
  title?: string;
  values?: any[];
  width?: number;
}

interface State {
  width: number;
}

class BulletChart extends React.Component<BulletChartProps, State> {
  private containerRef = React.createRef<HTMLDivElement>();
  public state: State = {
    width: 0,
  };

  public componentDidMount() {
    const node = this.containerRef.current;
    if (node) {
      this.setState({ width: node.clientWidth });
    }
    window.addEventListener('resize', this.handleResize);
  }

  public componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }

  private handleResize = () => {
    this.setState({ width: this.containerRef.current.clientWidth });
  };

  public render() {
    const {
      legendItemsPerRow,
      ranges,
      thresholdError,
      title,
      values,
    } = this.props;
    const { width } = this.state;

    const legendColorScale = [];
    const legendData = [];
    for (let i = 0; i < values.length; i++) {
      legendData.push({ name: values[i].legend });
      legendColorScale.push(
        values[i].color ? values[i].color : chartStyles.valueColorScale[i]
      );
    }
    for (let i = 0; i < ranges.length; i++) {
      legendData.push({ name: ranges[i].legend });
      legendColorScale.push(
        ranges[i].color ? ranges[i].color : chartStyles.rangeColorScale[i]
      );
    }
    if (thresholdError) {
      legendData.push({ name: thresholdError.legend });
      legendColorScale.push(chartStyles.thresholdErrorColor);
    }

    const itemsPerRow = legendItemsPerRow
      ? legendItemsPerRow
      : chartStyles.itemsPerRow;

    const rows =
      legendData.length / itemsPerRow + (legendData.length % itemsPerRow);
    const legendHeight = rows * chartStyles.legendHeight;
    const sortedRanges = [...ranges].sort((a, b) => b.value - a.value);
    const sortedValues = [...values].sort((a, b) => b.value - a.value);
    const maxValue = Math.max(
      ...sortedRanges.map(val => val.value),
      ...sortedValues.map(val => val.value),
      thresholdError.value
    );

    return (
      <div className={css(styles.bulletChart)} ref={this.containerRef}>
        {Boolean(title) && (
          <span className={css(styles.bulletChartTitle)}>{title}</span>
        )}
        <Chart height={chartStyles.height} width={width}>
          <ChartGroup horizontal labelComponent={<ChartTooltip />}>
            {Boolean(sortedRanges) &&
              sortedRanges.map((val, index) => {
                return (
                  <ChartBar
                    data={[{ x: 1, y: val.value }]}
                    key={`range-${index}`}
                    labels={[val.tooltip]}
                    style={{
                      data: {
                        fill: val.color
                          ? val.color
                          : chartStyles.rangeColorScale[index % 4],
                        width: chartStyles.rangeWidth,
                      },
                    }}
                  />
                );
              })}
            {Boolean(sortedValues) &&
              sortedValues.map((val, index) => {
                return (
                  <ChartBar
                    data={[{ x: 1, y: val.value }]}
                    key={`value-${index}`}
                    labels={[val.tooltip]}
                    style={{
                      data: {
                        fill: val.color
                          ? val.color
                          : chartStyles.valueColorScale[index % 2],
                        width: chartStyles.valueWidth,
                      },
                    }}
                  />
                );
              })}
          </ChartGroup>
          {Boolean(thresholdError) && (
            <ChartBar
              data={[{ x: thresholdError.value, y: 2 }]}
              labelComponent={<ChartTooltip />}
              labels={[thresholdError.tooltip]}
              style={{
                data: {
                  fill: chartStyles.thresholdErrorColor,
                  width: chartStyles.thresholdErrorWidth,
                },
              }}
            />
          )}
          <VictoryAxis tickValues={[0, Math.floor(maxValue / 2), maxValue]} />
        </Chart>
        {Boolean(legendData.length) && (
          <div className={css(styles.bulletChartLegend)}>
            <ChartLegend
              colorScale={legendColorScale}
              data={legendData}
              height={legendHeight}
              itemsPerRow={itemsPerRow}
              width={width}
            />
          </div>
        )}
      </div>
    );
  }
}

export { BulletChart, BulletChartProps };
