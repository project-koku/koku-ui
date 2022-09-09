import './reportSummaryDailyTrend.scss';

import React from 'react';
import { DailyTrendChart, DailyTrendChartProps } from 'routes/views/components/charts/dailyTrendChart';

const ReportSummaryDailyTrend: React.FC<DailyTrendChartProps> = props => (
  <div className="chart">
    <DailyTrendChart {...props} />
  </div>
);

export { ReportSummaryDailyTrend };
