import { AzureDetailsWidget } from './azureDetailsCommon';
import {
  accountSummaryWidget,
  costBreakdownWidget,
  regionSummaryWidget,
  serviceSummaryWidget,
} from './azureDetailsWidgets';

export type AzureDetailsState = Readonly<{
  widgets: Record<number, AzureDetailsWidget>;
  currentWidgets: number[];
}>;

export const defaultState: AzureDetailsState = {
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

export function azureDetailsReducer(
  state = defaultState,
  action: any
): AzureDetailsState {
  return state;
}
