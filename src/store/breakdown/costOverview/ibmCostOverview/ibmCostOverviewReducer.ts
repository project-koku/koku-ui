import type { IbmCostOverviewWidget } from './ibmCostOverviewCommon';
import {
  accountSummaryWidget,
  costWidget,
  projectSummaryWidget,
  regionSummaryWidget,
  serviceSummaryWidget,
} from './ibmCostOverviewWidgets';

export type IbmCostOverviewState = Readonly<{
  widgets: Record<number, IbmCostOverviewWidget>;
  currentWidgets: number[];
}>;

export const defaultState: IbmCostOverviewState = {
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

export function ibmCostOverviewReducer(state = defaultState): IbmCostOverviewState {
  return state;
}
