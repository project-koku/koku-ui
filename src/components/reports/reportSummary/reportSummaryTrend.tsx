import './reportSummaryTrend.scss';

import { TrendChart, TrendChartProps } from 'components/charts/trendChart';
import React from 'react';

const ReportSummaryTrend: React.SFC<TrendChartProps> = props => (
  <div className="chart">
    <TrendChart {...props} />
  </div>
);

export { ReportSummaryTrend };
