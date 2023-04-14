import type { OcpCostOverviewWidget } from './ocpCostOverviewCommon';
import {
  clusterWidget,
  costDistributionWidget,
  costWidget,
  cpuUsageWidget,
  memoryUsageWidget,
  projectSummaryWidget,
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
    clusterWidget.id,
    projectSummaryWidget.id,
    cpuUsageWidget.id,
    memoryUsageWidget.id,
    volumeUsageWidget.id,
  ],
  widgets: {
    [costWidget.id]: costWidget,
    [costDistributionWidget.id]: costDistributionWidget,
    [clusterWidget.id]: clusterWidget,
    [projectSummaryWidget.id]: projectSummaryWidget,
    [cpuUsageWidget.id]: cpuUsageWidget,
    [memoryUsageWidget.id]: memoryUsageWidget,
    [volumeUsageWidget.id]: volumeUsageWidget,
  },
};

export function ocpCostOverviewReducer(state = defaultState): OcpCostOverviewState {
  return state;
}
