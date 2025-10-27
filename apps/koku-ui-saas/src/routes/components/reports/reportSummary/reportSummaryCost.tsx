import './reportSummaryCost.scss';

import React from 'react';
import type { CostChartProps } from 'routes/components/charts/costChart';
import { CostChart } from 'routes/components/charts/costChart';

export interface ReportSummaryCostProps extends Omit<CostChartProps, 'intl'> {
  chartName?: string;
}

const ReportSummaryCost: React.FC<ReportSummaryCostProps> = ({ chartName, ...rest }) => (
  <div className="chart">
    <CostChart name={chartName} {...rest} />
  </div>
);

export default ReportSummaryCost;
