import './reportSummaryTrend.scss';

import React from 'react';
import { Omit } from 'react-redux';
import { TrendChart, TrendChartProps } from 'routes/views/components/charts/trendChart';

interface TrendChartPropsExt extends Omit<TrendChartProps, 'intl'> {
  chartName?: string;
}

const ReportSummaryTrend: React.FC<TrendChartPropsExt> = ({ chartName, ...rest }) => (
  <div className="chart">
    <TrendChart name={chartName} {...rest} />
  </div>
);

export { ReportSummaryTrend };
