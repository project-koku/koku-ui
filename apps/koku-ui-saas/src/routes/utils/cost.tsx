import type { Report } from 'api/reports/report';
import React from 'react';
import { ComputedReportItemValueType } from 'routes/components/charts/common';
import { EmptyValueState } from 'routes/components/state/emptyValueState';
import { formatCurrency } from 'utils/format';

export const getTotalCost = (report: Report, costDistribution: string) => {
  let cost: string | React.ReactNode = <EmptyValueState />;
  let supplementaryCost: string | React.ReactNode = <EmptyValueState />;
  let infrastructureCost: string | React.ReactNode = <EmptyValueState />;

  const reportItemValue = costDistribution ? costDistribution : ComputedReportItemValueType.total;
  if (report?.meta?.total) {
    const hasCost = report.meta.total.cost && report.meta.total.cost[reportItemValue];
    const hasSupplementaryCost = report.meta.total.supplementary && report.meta.total.supplementary.total;
    const hasInfrastructureCost = report.meta.total.infrastructure && report.meta.total.infrastructure.total;
    cost = formatCurrency(
      hasCost ? report.meta.total.cost[reportItemValue].value : 0,
      hasCost ? report.meta.total.cost[reportItemValue].units : 'USD'
    );
    supplementaryCost = formatCurrency(
      hasSupplementaryCost ? report.meta.total.supplementary.total.value : 0,
      hasSupplementaryCost ? report.meta.total.supplementary.total.units : 'USD'
    );
    infrastructureCost = formatCurrency(
      hasInfrastructureCost ? report.meta.total.infrastructure.total.value : 0,
      hasInfrastructureCost ? report.meta.total.infrastructure.total.units : 'USD'
    );
  }
  return { cost, infrastructureCost, supplementaryCost };
};
