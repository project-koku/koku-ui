import { OcpCostOverviewWidget } from './ocpCostOverviewCommon';
import {
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
    projectSummaryWidget.id,
    memoryUsageWidget.id,
    cpuUsageWidget.id,
  ],
  widgets: {
    [costWidget.id]: costWidget,
    [projectSummaryWidget.id]: projectSummaryWidget,
    [memoryUsageWidget.id]: memoryUsageWidget,
    [cpuUsageWidget.id]: cpuUsageWidget,
  },
};

export function ocpCostOverviewReducer(
  state = defaultState,
  action: any
): OcpCostOverviewState {
  return state;
}
