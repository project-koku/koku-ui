import { css } from '@patternfly/react-styles';
import { TrendChart, TrendChartProps } from 'components/charts/trendChart';
import React from 'react';
import { styles } from './awsReportSummaryTrend.styles';

const AwsReportSummaryTrend: React.SFC<TrendChartProps> = props => (
  <div style={styles.chart}>
    <TrendChart {...props} />
  </div>
);

export { AwsReportSummaryTrend };
