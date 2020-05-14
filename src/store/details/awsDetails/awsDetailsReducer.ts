import { AwsDetailsWidget } from './awsDetailsCommon';
import {
  accountSummaryWidget,
  costBreakdownWidget,
  regionSummaryWidget,
  serviceSummaryWidget,
} from './awsDetailsWidgets';

export type AwsDetailsState = Readonly<{
  widgets: Record<number, AwsDetailsWidget>;
  currentWidgets: number[];
}>;

export const defaultState: AwsDetailsState = {
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

export function awsDetailsReducer(
  state = defaultState,
  action: any
): AwsDetailsState {
  return state;
}
