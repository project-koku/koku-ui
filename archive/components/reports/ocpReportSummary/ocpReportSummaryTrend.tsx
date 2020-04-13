import { css } from '@patternfly/react-styles';
import { CostChart, CostChartProps } from 'components/charts/costChart';
import React from 'react';
import { styles } from './ocpReportSummaryTrend.styles';

const OcpReportSummaryTrend: React.SFC<CostChartProps> = props => (
  <div style={styles.chart}>
    <CostChart {...props} />
  </div>
);

export { OcpReportSummaryTrend };
