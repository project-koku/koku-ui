import { css } from '@patternfly/react-styles';
import { StyleSheet } from '@patternfly/react-styles';
import React from 'react';

const styles = StyleSheet.create({
  trendLegend: {
    display: 'flex',
    alignItems: 'center',
  },
});

interface TrendChartLegendProps {
  children: React.ReactNode;
}

const TrendChartLegend: React.SFC<TrendChartLegendProps> = ({ children }) => (
  <div className={css(styles.trendLegend)}>{children}</div>
);

export { TrendChartLegend, TrendChartLegendProps };
