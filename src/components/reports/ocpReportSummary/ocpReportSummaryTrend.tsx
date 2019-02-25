import { TrendChart, TrendChartProps } from 'components/charts/trendChart';
import React from 'react';
import { Omit } from 'react-redux';

interface OcpReportSummaryTrendProps extends Omit<TrendChartProps, 'height'> {}

const OcpReportSummaryTrend: React.SFC<OcpReportSummaryTrendProps> = props => (
  <div style={{ marginBottom: 16 }}>
    <TrendChart height={75} {...props} />
  </div>
);

export { OcpReportSummaryTrend, OcpReportSummaryTrendProps };
