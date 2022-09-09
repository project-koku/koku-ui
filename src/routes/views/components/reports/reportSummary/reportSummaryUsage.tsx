import './reportSummaryUsage.scss';

import React from 'react';
import { Omit } from 'react-redux';
import { UsageChart, UsageChartProps } from 'routes/views/components/charts/usageChart';

interface UsageChartPropsExt extends Omit<UsageChartProps, 'intl'> {}

const ReportSummaryUsage: React.FC<UsageChartPropsExt> = props => (
  <div className="chart">
    <UsageChart {...props} />
  </div>
);

export { ReportSummaryUsage };
