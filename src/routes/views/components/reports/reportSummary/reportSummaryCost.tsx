import './reportSummaryCost.scss';

import React from 'react';
import { Omit } from 'react-redux';
import { CostChart, CostChartProps } from 'routes/views/components/charts/costChart';

interface CostChartPropsExt extends Omit<CostChartProps, 'intl'> {}

const ReportSummaryCost: React.FC<CostChartPropsExt> = props => (
  <div className="chart">
    <CostChart {...props} />
  </div>
);

export { ReportSummaryCost };
