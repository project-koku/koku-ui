import './reportSummaryDailyCost.scss';

import React from 'react';
import { Omit } from 'react-redux';
import { DailyCostChart, DailyCostChartProps } from 'routes/views/components/charts/dailyCostChart';

interface DailyCostChartPropsExt extends Omit<DailyCostChartProps, 'intl'> {
  chartName?: string;
}

const ReportSummaryDailyCost: React.FC<DailyCostChartPropsExt> = ({ chartName, ...rest }) => (
  <div className="chart">
    <DailyCostChart name={chartName} {...rest} />
  </div>
);

export { ReportSummaryDailyCost };
