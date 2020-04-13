import {
  Chart,
  ChartAxis,
  ChartBar,
  ChartGroup,
  ChartLegend,
  ChartLine,
  ChartTooltip,
  ChartVoronoiContainer,
} from '@patternfly/react-charts';
import { css } from '@patternfly/react-styles';
import { default as ChartTheme } from 'components/charts/chartTheme';
import React from 'react';
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

  private getTooltipLabel = datum => {
    const { ranges, thresholdError, values } = this.props;
    const name = datum.childName.split('-');
    let tooltip = '';

    if (name && name.length === 2) {
      if (name[0] === 'threshold') {
        tooltip = thresholdError.tooltip ? thresholdError.tooltip : '';
      } else if (name[0] === 'range') {
        const range = ranges[name[1]];
        tooltip = range ? range.tooltip : '';
      } else if (name[0] === 'value') {
        const val = values[name[1]];
        tooltip = val ? val.tooltip : '';
      }
    }
    return tooltip;
  };

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
    if (thresholdError && thresholdError.legend) {
      legendData.push({ name: thresholdError.legend });
      legendColorScale.push(chartStyles.thresholdErrorColor);
    }

    const itemsPerRow = legendItemsPerRow
      ? legendItemsPerRow
      : width > 400
      ? chartStyles.itemsPerRow
      : 1;

    const rows =
      legendData.length / itemsPerRow + (legendData.length % itemsPerRow);
    const legendHeight = rows * chartStyles.legendHeight;
    const sortedRanges = [...ranges].sort((a, b) => b.value - a.value);
    const sortedValues = [...values].sort((a, b) => b.value - a.value);
    const maxValue = Math.max(
      ...sortedRanges.map(val => val.value),
      ...sortedValues.map(val => val.value),
      thresholdError.value || 0
    );

    const container = (
      <ChartVoronoiContainer
        labelComponent={<ChartTooltip orientation="top" />}
        labels={this.getTooltipLabel}
      />
    );

    return (
      <div style={styles.bulletChart} ref={this.containerRef}>
        {Boolean(title) && <span style={styles.bulletChartTitle}>{title}</span>}
        <Chart
          containerComponent={container}
          height={chartStyles.height}
          theme={ChartTheme}
          width={width}
        >
          <ChartGroup horizontal>
            {Boolean(sortedRanges && sortedRanges.length) &&
              sortedRanges.map((val, index) => {
                return (
                  <ChartBar
                    barWidth={chartStyles.rangeWidth}
                    data={[{ x: 1, y: val.value }]}
                    key={`range-${index}`}
                    name={`range-${index}`}
                    style={{
                      data: {
                        fill: val.color
                          ? val.color
                          : chartStyles.rangeColorScale[index % 4],
                      },
                    }}
                  />
                );
              })}
            {Boolean(sortedValues && sortedValues.length) &&
              sortedValues.map((val, index) => {
                return (
                  <ChartBar
                    barWidth={chartStyles.valueWidth}
                    data={[{ x: 1, y: val.value }]}
                    key={`value-${index}`}
                    name={`value-${index}`}
                    style={{
                      data: {
                        fill: val.color
                          ? val.color
                          : chartStyles.valueColorScale[index % 2],
                      },
                    }}
                  />
                );
              })}
          </ChartGroup>
          {Boolean(thresholdError && thresholdError.value) && (
            <ChartLine
              data={[
                { x: 0, y: thresholdError.value },
                { x: 2, y: thresholdError.value },
              ]}
              name={`threshold-0`}
              style={{
                data: {
                  stroke: chartStyles.thresholdErrorColor,
                  strokeWidth: chartStyles.thresholdErrorWidth,
                },
              }}
            />
          )}
          <ChartAxis
            dependentAxis
            tickValues={[0, Math.floor(maxValue / 2), maxValue]}
          />
        </Chart>
        {Boolean(legendData.length) && (
          <div style={styles.bulletChartLegend}>
            <ChartLegend
              colorScale={legendColorScale}
              data={legendData}
              height={legendHeight}
              itemsPerRow={itemsPerRow}
              responsive={false}
              width={width}
            />
          </div>
        )}
      </div>
    );
  }
}

export { BulletChart, BulletChartProps };
