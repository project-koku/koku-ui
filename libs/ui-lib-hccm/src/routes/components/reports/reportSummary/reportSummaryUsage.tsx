import './reportSummaryUsage.scss';

import React from 'react';

import type { UsageChartProps } from '../../charts/usageChart';
import { UsageChart } from '../../charts/usageChart';

export interface ReportSummaryUsageProps extends Omit<UsageChartProps, 'intl'> {
  chartName?: string;
}

const ReportSummaryUsage: React.FC<ReportSummaryUsageProps> = ({ chartName, ...rest }) => (
  <div className="chart">
    <UsageChart name={chartName} {...rest} />
  </div>
);

export default ReportSummaryUsage;
