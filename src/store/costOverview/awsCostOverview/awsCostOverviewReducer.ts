import { AwsCostOverviewWidget } from './awsCostOverviewCommon';
import {
  accountSummaryWidget,
  costBreakdownWidget,
  regionSummaryWidget,
  serviceSummaryWidget,
} from './awsCostOverviewWidgets';

export type AwsCostOverviewState = Readonly<{
  widgets: Record<number, AwsCostOverviewWidget>;
  currentWidgets: number[];
}>;

export const defaultState: AwsCostOverviewState = {
  currentWidgets: [
    costBreakdownWidget.id,
    accountSummaryWidget.id,
    serviceSummaryWidget.id,
    regionSummaryWidget.id,
  ],
  widgets: {
    [costBreakdownWidget.id]: costBreakdownWidget,
    [accountSummaryWidget.id]: accountSummaryWidget,
    [serviceSummaryWidget.id]: serviceSummaryWidget,
    [regionSummaryWidget.id]: regionSummaryWidget,
  },
};

export function awsCostOverviewReducer(
  state = defaultState,
  action: any
): AwsCostOverviewState {
  return state;
}
