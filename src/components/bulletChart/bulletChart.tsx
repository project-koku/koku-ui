import { BulletChart as PFBulletChart } from 'patternfly-react';
import React from 'react';
import { bulletChartOverride } from './bulletChart.styles';

interface BulletChartProps {
  id?: string;
  legend?: any[];
  label?: string;
  maxValue?: number;
  ranges?: any[];
  thresholdError?: number;
  thresholdErrorLegendText?: string;
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
      maxValue,
      ranges,
      thresholdError,
      thresholdErrorLegendText,
      values,
    } = this.props;

    return (
      <>
        {Boolean(values.length) && (
          <div className={bulletChartOverride}>
            <div>{label}</div>
            <PFBulletChart
              id={id}
              maxValue={maxValue}
              percents={false}
              ranges={ranges}
              showAxis
              showLegend
              thresholdError={thresholdError}
              thresholdErrorLegendText={thresholdErrorLegendText}
              thresholdWarning={0}
              useExtendedColors
              values={values}
            />
          </div>
        )}
      </>
    );
  }
}

export { BulletChart, BulletChartProps };
