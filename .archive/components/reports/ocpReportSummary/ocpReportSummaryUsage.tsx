import { css } from '@patternfly/react-styles';
import { UsageChart, UsageChartProps } from 'components/charts/usageChart';
import React from 'react';
import { styles } from './ocpReportSummaryTrend.styles';

const OcpReportSummaryUsage: React.SFC<UsageChartProps> = props => (
  <div style={styles.chart}>
    <UsageChart {...props} />
  </div>
);

export { OcpReportSummaryUsage };
