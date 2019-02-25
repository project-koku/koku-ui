import { UsageChart, UsageChartProps } from 'components/charts/usageChart';
import React from 'react';
import { Omit } from 'react-redux';

interface OcpReportSummaryUsageProps extends Omit<UsageChartProps, 'height'> {}

const OcpReportSummaryUsage: React.SFC<OcpReportSummaryUsageProps> = props => (
  <div style={{ marginBottom: 16 }}>
    <UsageChart height={75} {...props} />
  </div>
);

export { OcpReportSummaryUsage, OcpReportSummaryUsageProps };
