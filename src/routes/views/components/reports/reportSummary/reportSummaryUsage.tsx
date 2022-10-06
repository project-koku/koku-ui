import './reportSummaryUsage.scss';

import React from 'react';
import { Omit } from 'react-redux';
import { UsageChart, UsageChartProps } from 'routes/views/components/charts/usageChart';

export interface ReportSummaryUsageProps extends Omit<UsageChartProps, 'intl'> {
  chartName?: string;
}

const ReportSummaryUsage: React.FC<ReportSummaryUsageProps> = ({ chartName, ...rest }) => (
  <div className="chart">
    <UsageChart name={chartName} {...rest} />
  </div>
);

export default ReportSummaryUsage;
