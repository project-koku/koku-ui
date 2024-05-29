import type { OcpCostOverviewWidget } from './ocpCostOverviewCommon';
import {
  clusterWidget,
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
  widgets: Record<number, OcpCostOverviewWidget>;
  currentWidgets: number[];
}>;

export const defaultState: OcpCostOverviewState = {
  currentWidgets: [
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
