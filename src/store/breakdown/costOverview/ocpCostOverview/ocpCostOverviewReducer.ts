import type { CostOverviewWidget } from 'store/breakdown/costOverview/common/costOverviewCommon';

import {
  clusterWidget,
  costBreakdownWidget,
  costDistributionWidget,
  costWidget,
  cpuUsageWidget,
  memoryUsageWidget,
  projectSummaryWidget,
  pvcWidget,
  volumeSummaryWidget,
  volumeUsageWidget,
} from './ocpCostOverviewWidgets';

export type OcpCostOverviewState = Readonly<{
  widgets: Record<number, CostOverviewWidget>;
  currentWidgets: number[];
}>;

export const defaultState: OcpCostOverviewState = {
  currentWidgets: [
    costBreakdownWidget.id,
    costWidget.id,
    costDistributionWidget.id,
    projectSummaryWidget.id,
    volumeSummaryWidget.id,
    clusterWidget.id,
    cpuUsageWidget.id,
    memoryUsageWidget.id,
    pvcWidget.id,
    volumeUsageWidget.id,
  ],
  widgets: {
    [costBreakdownWidget.id]: costBreakdownWidget,
    [costWidget.id]: costWidget,
    [costDistributionWidget.id]: costDistributionWidget,
    [projectSummaryWidget.id]: projectSummaryWidget,
    [volumeSummaryWidget.id]: volumeSummaryWidget,
    [clusterWidget.id]: clusterWidget,
    [cpuUsageWidget.id]: cpuUsageWidget,
    [memoryUsageWidget.id]: memoryUsageWidget,
    [pvcWidget.id]: pvcWidget,
    [volumeUsageWidget.id]: volumeUsageWidget,
  },
};

export function ocpCostOverviewReducer(state = defaultState): OcpCostOverviewState {
  return state;
}
