import type { CostOverviewWidget } from 'store/breakdown/costOverview/common/costOverviewCommon';

import {
  clusterWidget,
  costBreakdownWidget,
  cpuUsageWidget,
  memoryUsageWidget,
  projectSummaryWidget,
  volumeUsageWidget,
} from './rhelCostOverviewWidgets';

export type RhelCostOverviewState = Readonly<{
  widgets: Record<number, CostOverviewWidget>;
  currentWidgets: number[];
}>;

export const defaultState: RhelCostOverviewState = {
  currentWidgets: [
    costBreakdownWidget.id,
    clusterWidget.id,
    projectSummaryWidget.id,
    cpuUsageWidget.id,
    memoryUsageWidget.id,
    volumeUsageWidget.id,
  ],
  widgets: {
    [costBreakdownWidget.id]: costBreakdownWidget,
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
