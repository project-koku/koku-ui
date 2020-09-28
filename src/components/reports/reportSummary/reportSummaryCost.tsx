import './reportSummaryCost.scss';

import { CostChart, CostChartProps } from 'components/charts/costChart';
import React from 'react';

const ReportSummaryCost: React.SFC<CostChartProps> = props => (
  <div className="chart">
    <CostChart {...props} />
  </div>
);

export { ReportSummaryCost };
