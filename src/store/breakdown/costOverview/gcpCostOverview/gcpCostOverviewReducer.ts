import type { GcpCostOverviewWidget } from './gcpCostOverviewCommon';
import {
  accountSummaryWidget,
  costWidget,
  projectSummaryWidget,
  regionSummaryWidget,
  serviceSummaryWidget,
} from './gcpCostOverviewWidgets';

export type GcpCostOverviewState = Readonly<{
  widgets: Record<number, GcpCostOverviewWidget>;
  currentWidgets: number[];
}>;

export const defaultState: GcpCostOverviewState = {
  currentWidgets: [
    costWidget.id,
    accountSummaryWidget.id,
    projectSummaryWidget.id,
    serviceSummaryWidget.id,
    regionSummaryWidget.id,
  ],
  widgets: {
    [costWidget.id]: costWidget,
    [accountSummaryWidget.id]: accountSummaryWidget,
    [projectSummaryWidget.id]: projectSummaryWidget,
    [serviceSummaryWidget.id]: serviceSummaryWidget,
    [regionSummaryWidget.id]: regionSummaryWidget,
  },
};

export function gcpCostOverviewReducer(state = defaultState): GcpCostOverviewState {
  return state;
}
