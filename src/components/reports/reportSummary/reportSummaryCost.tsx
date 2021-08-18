import './reportSummaryCost.scss';

import { CostChart, CostChartProps } from 'components/charts/costChart';
import React from 'react';
import { Omit } from 'react-redux';

interface CostChartPropsExt extends Omit<CostChartProps, 'intl'> {}

const ReportSummaryCost: React.SFC<CostChartPropsExt> = props => (
  <div className="chart">
    <CostChart {...props} />
  </div>
);

export { ReportSummaryCost };
