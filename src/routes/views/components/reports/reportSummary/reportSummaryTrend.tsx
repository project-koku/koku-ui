import './reportSummaryTrend.scss';

import React from 'react';
import { Omit } from 'react-redux';
import { TrendChart, TrendChartProps } from 'routes/views/components/charts/trendChart';

interface TrendChartPropsExt extends Omit<TrendChartProps, 'intl'> {}

const ReportSummaryTrend: React.FC<TrendChartPropsExt> = props => (
  <div className="chart">
    <TrendChart {...props} />
  </div>
);

export { ReportSummaryTrend };
