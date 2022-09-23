import './reportSummaryUsage.scss';

import React from 'react';
import { Omit } from 'react-redux';
import { UsageChart, UsageChartProps } from 'routes/views/components/charts/usageChart';

interface UsageChartPropsExt extends Omit<UsageChartProps, 'intl'> {
  chartName?: string;
}

const ReportSummaryUsage: React.FC<UsageChartPropsExt> = ({ chartName, ...rest }) => (
  <div className="chart">
    <UsageChart name={chartName} {...rest} />
  </div>
);

export { ReportSummaryUsage };
