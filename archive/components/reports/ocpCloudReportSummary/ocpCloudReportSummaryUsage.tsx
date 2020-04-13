import { css } from '@patternfly/react-styles';
import { UsageChart, UsageChartProps } from 'components/charts/usageChart';
import React from 'react';
import { styles } from './ocpCloudReportSummaryTrend.styles';

const OcpCloudReportSummaryUsage: React.SFC<UsageChartProps> = props => (
  <div style={styles.chart}>
    <UsageChart {...props} />
  </div>
);

export { OcpCloudReportSummaryUsage };
