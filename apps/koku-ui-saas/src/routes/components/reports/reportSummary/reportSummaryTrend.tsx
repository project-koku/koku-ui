import './reportSummaryTrend.scss';

import React from 'react';
import type { TrendChartProps } from 'routes/components/charts/trendChart';
import { TrendChart } from 'routes/components/charts/trendChart';

export interface ReportSummaryTrendProps extends Omit<TrendChartProps, 'intl'> {
  chartName?: string;
}

const ReportSummaryTrend: React.FC<ReportSummaryTrendProps> = ({ chartName, ...rest }) => (
  <div className="chart">
    <TrendChart name={chartName} {...rest} />
  </div>
);

export default ReportSummaryTrend;
