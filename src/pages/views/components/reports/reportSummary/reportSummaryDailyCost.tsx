import './reportSummaryDailyCost.scss';

import { DailyCostChart, DailyCostChartProps } from 'pages/views/components/charts/dailyCostChart';
import React from 'react';

const ReportSummaryDailyCost: React.SFC<DailyCostChartProps> = props => (
  <div className="chart">
    <DailyCostChart {...props} />
  </div>
);

export { ReportSummaryDailyCost };
