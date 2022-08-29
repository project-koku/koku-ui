import './reportSummaryDailyTrend.scss';

import { DailyTrendChart, DailyTrendChartProps } from 'routes/views/components/charts/dailyTrendChart';
import React from 'react';

const ReportSummaryDailyTrend: React.SFC<DailyTrendChartProps> = props => (
  <div className="chart">
    <DailyTrendChart {...props} />
  </div>
);

export { ReportSummaryDailyTrend };
