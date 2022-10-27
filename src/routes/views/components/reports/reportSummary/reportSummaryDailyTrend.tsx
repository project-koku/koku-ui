import './reportSummaryDailyTrend.scss';

import React from 'react';
import type { DailyTrendChartProps } from 'routes/views/components/charts/dailyTrendChart';
import { DailyTrendChart } from 'routes/views/components/charts/dailyTrendChart';

export interface ReportSummaryDailyTrendProps extends Omit<DailyTrendChartProps, 'intl'> {
  chartName?: string;
}

const ReportSummaryDailyTrend: React.FC<ReportSummaryDailyTrendProps> = ({ chartName, ...rest }) => (
  <div className="chart">
    <DailyTrendChart name={chartName} {...rest} />
  </div>
);

export default ReportSummaryDailyTrend;
