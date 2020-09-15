import './reportSummaryUsage.scss';

import { UsageChart, UsageChartProps } from 'components/charts/usageChart';
import React from 'react';

const ReportSummaryUsage: React.SFC<UsageChartProps> = props => (
  <div className="chart">
    <UsageChart {...props} />
  </div>
);

export { ReportSummaryUsage };
