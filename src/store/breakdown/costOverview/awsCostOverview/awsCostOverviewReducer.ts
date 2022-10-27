import type { AwsCostOverviewWidget } from './awsCostOverviewCommon';
import { accountSummaryWidget, costWidget, regionSummaryWidget, serviceSummaryWidget } from './awsCostOverviewWidgets';

export type AwsCostOverviewState = Readonly<{
  widgets: Record<number, AwsCostOverviewWidget>;
  currentWidgets: number[];
}>;

export const defaultState: AwsCostOverviewState = {
  currentWidgets: [costWidget.id, accountSummaryWidget.id, serviceSummaryWidget.id, regionSummaryWidget.id],
  widgets: {
    [costWidget.id]: costWidget,
    [accountSummaryWidget.id]: accountSummaryWidget,
    [serviceSummaryWidget.id]: serviceSummaryWidget,
    [regionSummaryWidget.id]: regionSummaryWidget,
  },
};

export function awsCostOverviewReducer(state = defaultState): AwsCostOverviewState {
  return state;
}
