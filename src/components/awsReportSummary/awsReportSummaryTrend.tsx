import React from 'react';
import { Omit } from 'react-redux';
import { TrendChart, TrendChartProps } from '../trendChart';

interface AwsReportSummaryTrendProps extends Omit<TrendChartProps, 'height'> {}

const AwsReportSummaryTrend: React.SFC<AwsReportSummaryTrendProps> = props => (
  <div style={{ marginBottom: 16 }}>
    <TrendChart height={75} {...props} />
  </div>
);

export { AwsReportSummaryTrend, AwsReportSummaryTrendProps };
