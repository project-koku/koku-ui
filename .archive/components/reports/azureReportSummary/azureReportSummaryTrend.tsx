import { css } from '@patternfly/react-styles';
import { TrendChart, TrendChartProps } from 'components/charts/trendChart';
import React from 'react';
import { styles } from './azureReportSummaryTrend.styles';

const AzureReportSummaryTrend: React.SFC<TrendChartProps> = props => (
  <div style={styles.chart}>
    <TrendChart {...props} />
  </div>
);

export { AzureReportSummaryTrend };
