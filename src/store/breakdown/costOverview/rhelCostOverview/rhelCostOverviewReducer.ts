import type { RhelCostOverviewWidget } from './rhelCostOverviewCommon';
import {
  clusterWidget,
  costWidget,
  cpuUsageWidget,
  memoryUsageWidget,
  projectSummaryWidget,
  volumeUsageWidget,
} from './rhelCostOverviewWidgets';

export type RhelCostOverviewState = Readonly<{
  widgets: Record<number, RhelCostOverviewWidget>;
  currentWidgets: number[];
}>;

export const defaultState: RhelCostOverviewState = {
  currentWidgets: [
    costWidget.id,
    clusterWidget.id,
    projectSummaryWidget.id,
    cpuUsageWidget.id,
    memoryUsageWidget.id,
    volumeUsageWidget.id,
  ],
  widgets: {
    [costWidget.id]: costWidget,
    [clusterWidget.id]: clusterWidget,
    [projectSummaryWidget.id]: projectSummaryWidget,
    [cpuUsageWidget.id]: cpuUsageWidget,
    [memoryUsageWidget.id]: memoryUsageWidget,
    [volumeUsageWidget.id]: volumeUsageWidget,
  },
};

export function rhelCostOverviewReducer(state = defaultState): RhelCostOverviewState {
  return state;
}
