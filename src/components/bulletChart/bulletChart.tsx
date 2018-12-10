import {
  BulletChart as ChartBullet,
  BulletChartAxis,
  BulletChartAxisTic,
  BulletChartLegend,
  BulletChartLegendItem,
} from 'patternfly-react';
import React from 'react';
import { bulletChartOverride } from './bulletChart.styles';

interface BulletChartProps {
  id?: string;
  legend?: any[];
  label?: string;
  maxDomain?: number;
  ranges?: any[];
  threshold?: number;
  values: any[];
}

class BulletChart extends React.Component<BulletChartProps> {
  public shouldComponentUpdate(nextProps: BulletChartProps) {
    if (!nextProps.values) {
      return false;
    }
    return true;
  }

  public render() {
    const {
      id,
      label,
      legend,
      maxDomain,
      ranges,
      threshold,
      values,
    } = this.props;
    const maxDomainVal = maxDomain > 0 ? maxDomain : 100;

    return (
      <>
        {Boolean(values.length) && (
          <div className={bulletChartOverride}>
            <ChartBullet
              customAxis={
                <BulletChartAxis>
                  <BulletChartAxisTic value={0} text={'0'} />
                  <BulletChartAxisTic value={50} text={`${maxDomainVal / 2}`} />
                  <BulletChartAxisTic value={100} text={`${maxDomainVal}`} />
                </BulletChartAxis>
              }
              id={id}
              label={label}
              ranges={ranges}
              showAxis
              thresholdError={threshold}
              thresholdWarning={threshold}
              values={values}
            />
            <BulletChartLegend id="cpu-legend">
              {legend.map((value, index) => {
                return (
                  <BulletChartLegendItem
                    key={`legend-${index}`}
                    title={value.title}
                    value={value.value}
                    color={value.color}
                    tooltipFunction={value.tooltipFunction}
                  />
                );
              })}
            </BulletChartLegend>
          </div>
        )}
      </>
    );
  }
}

export { BulletChart, BulletChartProps };
