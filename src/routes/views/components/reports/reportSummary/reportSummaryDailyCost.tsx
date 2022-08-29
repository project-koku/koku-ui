import './reportSummaryDailyCost.scss';

import React from 'react';
import { DailyCostChart, DailyCostChartProps } from 'routes/views/components/charts/dailyCostChart';

const ReportSummaryDailyCost: React.SFC<DailyCostChartProps> = props => (
  <div className="chart">
    <DailyCostChart {...props} />
  </div>
);

export { ReportSummaryDailyCost };
