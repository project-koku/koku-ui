import './reportSummaryDailyCost.scss';

import React from 'react';

import type { DailyCostChartProps } from '../../charts/dailyCostChart';
import { DailyCostChart } from '../../charts/dailyCostChart';

export interface ReportSummaryDailyCostProps extends Omit<DailyCostChartProps, 'intl'> {
  chartName?: string;
}

const ReportSummaryDailyCost: React.FC<ReportSummaryDailyCostProps> = ({ chartName, ...rest }) => (
  <div className="chart">
    <DailyCostChart name={chartName} {...rest} />
  </div>
);

export default ReportSummaryDailyCost;
