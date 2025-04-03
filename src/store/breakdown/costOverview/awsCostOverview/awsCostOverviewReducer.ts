import type { CostOverviewWidget } from 'store/breakdown/costOverview/common/costOverviewCommon';

import {
  accountSummaryWidget,
  costBreakdownWidget,
  costWidget,
  regionSummaryWidget,
  serviceSummaryWidget,
} from './awsCostOverviewWidgets';

export type AwsCostOverviewState = Readonly<{
  widgets: Record<number, CostOverviewWidget>;
  currentWidgets: number[];
}>;

export const defaultState: AwsCostOverviewState = {
  currentWidgets: [
    costBreakdownWidget.id,
    costWidget.id,
    accountSummaryWidget.id,
    serviceSummaryWidget.id,
    regionSummaryWidget.id,
  ],
  widgets: {
    [costBreakdownWidget.id]: costBreakdownWidget,
    [costWidget.id]: costWidget,
    [accountSummaryWidget.id]: accountSummaryWidget,
    [serviceSummaryWidget.id]: serviceSummaryWidget,
    [regionSummaryWidget.id]: regionSummaryWidget,
  },
};

export function awsCostOverviewReducer(state = defaultState): AwsCostOverviewState {
  return state;
}
