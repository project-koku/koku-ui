import './reportSummaryUsage.scss';

import { UsageChart, UsageChartProps } from 'components/charts/usageChart';
import React from 'react';
import { Omit } from 'react-redux';

interface UsageChartPropsExt extends Omit<UsageChartProps, 'intl'> {}

const ReportSummaryUsage: React.SFC<UsageChartPropsExt> = props => (
  <div className="chart">
    <UsageChart {...props} />
  </div>
);

export { ReportSummaryUsage };
