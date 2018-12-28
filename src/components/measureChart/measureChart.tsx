import { BulletChart } from 'patternfly-react';
import React from 'react';
import { bulletChartOverride } from './measureChart.styles';

interface MeasureChartProps {
  id?: string;
  legend?: any[];
  label?: string;
  maxValue?: number;
  ranges?: any[];
  thresholdError?: number;
  thresholdErrorLegendText?: string;
  values: any[];
}

class MeasureChart extends React.Component<MeasureChartProps> {
  public shouldComponentUpdate(nextProps: MeasureChartProps) {
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
            <BulletChart
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

export { MeasureChart, MeasureChartProps };
