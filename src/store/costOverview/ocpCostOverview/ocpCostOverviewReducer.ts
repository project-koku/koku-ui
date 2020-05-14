import { OcpCostOverviewWidget } from './ocpCostOverviewCommon';
import {
  costBreakdownWidget,
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
    costBreakdownWidget.id,
    projectSummaryWidget.id,
    memoryUsageWidget.id,
    cpuUsageWidget.id,
  ],
  widgets: {
    [costBreakdownWidget.id]: costBreakdownWidget,
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
