import { css } from '@patternfly/react-styles';
import { UsageChart, UsageChartProps } from 'components/charts/usageChart';
import React from 'react';
import { styles } from './reportSummaryTrend.styles';

const ReportSummaryUsage: React.SFC<UsageChartProps> = props => (
  <div className={css(styles.chart)}>
    <UsageChart {...props} />
  </div>
);

export { ReportSummaryUsage };
