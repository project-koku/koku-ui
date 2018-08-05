import React from 'react';
import { Omit } from 'react-redux';
import { TrendChart, TrendChartProps } from '../trendChart';

interface ReportSummaryTrendProps extends Omit<TrendChartProps, 'height'> {}

const ReportSummaryTrend: React.SFC<ReportSummaryTrendProps> = props => (
  <div style={{ marginBottom: 16 }}>
    <TrendChart height={75} {...props} />
  </div>
);

export { ReportSummaryTrend, ReportSummaryTrendProps };
