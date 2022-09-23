import './reportSummaryCost.scss';

import React from 'react';
import { Omit } from 'react-redux';
import { CostChart, CostChartProps } from 'routes/views/components/charts/costChart';

interface CostChartPropsExt extends Omit<CostChartProps, 'intl'> {
  chartName?: string;
}

const ReportSummaryCost: React.FC<CostChartPropsExt> = ({ chartName, ...rest }) => (
  <div className="chart">
    <CostChart name={chartName} {...rest} />
  </div>
);

export { ReportSummaryCost };
