import { css } from '@patternfly/react-styles';
import React from 'react';

const styles = {
  legend: {
    display: 'flex',
    alignItems: 'center',
  },
} as { [className: string]: React.CSSProperties };

interface ChartLegendProps {
  children: React.ReactNode;
  style?: any;
}

const ChartLegend: React.SFC<ChartLegendProps> = ({ children, style }) => {
  const styling = Boolean(style) && Boolean(style.legend) ? style.legend : styles.legend;
  return <div className={css(styling)}>{children}</div>;
};

export { ChartLegend, ChartLegendProps };
