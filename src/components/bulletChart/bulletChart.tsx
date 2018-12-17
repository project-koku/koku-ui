import { BulletChart as PFBulletChart } from 'patternfly-react';
import React from 'react';
import { bulletChartOverride } from './bulletChart.styles';

interface BulletChartProps {
  id?: string;
  legend?: any[];
  label?: string;
  maxValue?: number;
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
    const { id, label, maxValue, ranges, threshold, values } = this.props;

    return (
      <>
        {Boolean(values.length) && (
          <div className={bulletChartOverride}>
            <PFBulletChart
              id={id}
              label={label}
              maxValue={maxValue}
              percents={false}
              ranges={ranges}
              showAxis
              showLegend
              thresholdError={threshold}
              thresholdWarning={threshold}
              values={values}
            />
          </div>
        )}
      </>
    );
  }
}

export { BulletChart, BulletChartProps };
