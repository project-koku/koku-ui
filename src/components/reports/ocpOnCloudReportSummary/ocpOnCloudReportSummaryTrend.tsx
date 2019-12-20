import { css } from '@patternfly/react-styles';
import { TrendChart, TrendChartProps } from 'components/charts/trendChart';
import React from 'react';
import { styles } from './ocpOnCloudReportSummaryTrend.styles';

const OcpOnCloudReportSummaryTrend: React.SFC<TrendChartProps> = props => (
  <div className={css(styles.chart)}>
    <TrendChart {...props} />
  </div>
);

export { OcpOnCloudReportSummaryTrend };
