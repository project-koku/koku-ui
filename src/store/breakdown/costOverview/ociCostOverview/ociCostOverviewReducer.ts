import type { CostOverviewWidget } from 'store/breakdown/costOverview/common/costOverviewCommon';

import { accountSummaryWidget, costWidget, regionSummaryWidget, serviceSummaryWidget } from './ociCostOverviewWidgets';

export type OciCostOverviewState = Readonly<{
  widgets: Record<number, CostOverviewWidget>;
  currentWidgets: number[];
}>;

export const defaultState: OciCostOverviewState = {
  currentWidgets: [costWidget.id, accountSummaryWidget.id, serviceSummaryWidget.id, regionSummaryWidget.id],
  widgets: {
    [costWidget.id]: costWidget,
    [accountSummaryWidget.id]: accountSummaryWidget,
    [serviceSummaryWidget.id]: serviceSummaryWidget,
    [regionSummaryWidget.id]: regionSummaryWidget,
  },
};

export function ociCostOverviewReducer(state = defaultState): OciCostOverviewState {
  return state;
}
