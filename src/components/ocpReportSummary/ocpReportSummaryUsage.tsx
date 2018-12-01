import React from 'react';
import { Omit } from 'react-redux';
import { UsageChart, UsageChartProps } from '../usageChart';

interface OcpReportSummaryUsageProps extends Omit<UsageChartProps, 'height'> {}

const OcpReportSummaryUsage: React.SFC<OcpReportSummaryUsageProps> = props => (
  <div style={{ marginBottom: 16 }}>
    <UsageChart height={75} {...props} />
  </div>
);

export { OcpReportSummaryUsage, OcpReportSummaryUsageProps };
