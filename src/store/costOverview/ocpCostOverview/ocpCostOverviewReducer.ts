import { OcpCostOverviewWidget } from './ocpCostOverviewCommon';
import {
  clusterWidget,
  costWidget,
  cpuUsageWidget,
  memoryUsageWidget,
  projectSummaryWidget,
} from './ocpCostOverviewWidgets';

export type OcpCostOverviewState = Readonly<{
  widgets: Record<number, OcpCostOverviewWidget>;
  currentWidgets: number[];
}>;

export const defaultState: OcpCostOverviewState = {
  currentWidgets: [
    costWidget.id,
    clusterWidget.id,
    projectSummaryWidget.id,
    cpuUsageWidget.id,
    memoryUsageWidget.id,
  ],
  widgets: {
    [costWidget.id]: costWidget,
    [clusterWidget.id]: clusterWidget,
    [projectSummaryWidget.id]: projectSummaryWidget,
    [cpuUsageWidget.id]: cpuUsageWidget,
    [memoryUsageWidget.id]: memoryUsageWidget,
  },
};

export function ocpCostOverviewReducer(
  state = defaultState
): OcpCostOverviewState {
  return state;
}
