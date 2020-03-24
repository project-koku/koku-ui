import { TrendChart, TrendChartProps } from 'components/charts/trendChart';
import React from 'react';
import { styles } from './reportSummaryTrend.styles';

const ReportSummaryTrend: React.SFC<TrendChartProps> = props => (
  <div style={styles.chart}>
    <TrendChart {...props} />
  </div>
);

export { ReportSummaryTrend };
