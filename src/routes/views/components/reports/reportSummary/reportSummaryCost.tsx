import './reportSummaryCost.scss';

import React from 'react';
import { Omit } from 'react-redux';
import { CostChart, CostChartProps } from 'routes/views/components/charts/costChart';

export interface ReportSummaryCostProps extends Omit<CostChartProps, 'intl'> {
  chartName?: string;
}

const ReportSummaryCost: React.FC<ReportSummaryCostProps> = ({ chartName, ...rest }) => (
  <div className="chart">
    <CostChart name={chartName} {...rest} />
  </div>
);

export default ReportSummaryCost;
