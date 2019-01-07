import { css } from '@patternfly/react-styles';
import { BulletChart } from 'patternfly-react';
import React from 'react';
import { bulletChartOverride, styles } from './measureChart.styles';

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
            {label}
            <div className={css(styles.measureChart)}>
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
          </div>
        )}
      </>
    );
  }
}

export { MeasureChart, MeasureChartProps };
