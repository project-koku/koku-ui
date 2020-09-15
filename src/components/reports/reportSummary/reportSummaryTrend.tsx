import { TrendChart, TrendChartProps } from 'components/charts/trendChart';
import React from 'react';

import './reportSummaryTrend.scss';

const ReportSummaryTrend: React.SFC<TrendChartProps> = props => (
  <div className="chart">
    <TrendChart {...props} />
  </div>
);

export { ReportSummaryTrend };
