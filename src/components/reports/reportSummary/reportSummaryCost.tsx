import { css } from '@patternfly/react-styles';
import { CostChart, CostChartProps } from 'components/charts/costChart';
import React from 'react';
import { styles } from './reportSummaryTrend.styles';

const ReportSummaryCost: React.SFC<CostChartProps> = props => (
  <div className={css(styles.chart)}>
    <CostChart {...props} />
  </div>
);

export { ReportSummaryCost };
