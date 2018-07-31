import React from 'react';
import { Omit } from 'react-redux';
import { TrendChart, TrendChartProps } from '../trendChart';

interface ReportSummaryTrendProps extends Omit<TrendChartProps, 'height'> {}

const ReportSummaryTrend: React.SFC<ReportSummaryTrendProps> = props => (
  <TrendChart height={100} {...props} />
);

export { ReportSummaryTrend, ReportSummaryTrendProps };
