import { CostChart, CostChartProps } from 'components/charts/costChart';
import React from 'react';
import { styles } from './reportSummaryTrend.styles';

const ReportSummaryCost: React.SFC<CostChartProps> = props => (
  <div style={styles.chart}>
    <CostChart {...props} />
  </div>
);

export { ReportSummaryCost };
