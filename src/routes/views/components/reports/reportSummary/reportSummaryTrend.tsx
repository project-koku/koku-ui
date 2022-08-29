import './reportSummaryTrend.scss';

import { TrendChart, TrendChartProps } from 'routes/views/components/charts/trendChart';
import React from 'react';
import { Omit } from 'react-redux';

interface TrendChartPropsExt extends Omit<TrendChartProps, 'intl'> {}

const ReportSummaryTrend: React.SFC<TrendChartPropsExt> = props => (
  <div className="chart">
    <TrendChart {...props} />
  </div>
);

export { ReportSummaryTrend };
