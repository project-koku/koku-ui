import { AzureCostOverviewWidget } from './azureCostOverviewCommon';
import {
  accountSummaryWidget,
  costBreakdownWidget,
  regionSummaryWidget,
  serviceSummaryWidget,
} from './azureCostOverviewWidgets';

export type AzureCostOverviewState = Readonly<{
  widgets: Record<number, AzureCostOverviewWidget>;
  currentWidgets: number[];
}>;

export const defaultState: AzureCostOverviewState = {
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

export function azureCostOverviewReducer(
  state = defaultState,
  action: any
): AzureCostOverviewState {
  return state;
}
