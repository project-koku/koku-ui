import type { AwsHistoricalDataWidget } from './awsHistoricalDataCommon';
import { computeUsageWidget, costWidget, storageUsageWidget } from './awsHistoricalDataWidgets';

export type AwsHistoricalDataState = Readonly<{
  widgets: Record<number, AwsHistoricalDataWidget>;
  currentWidgets: number[];
}>;

export const defaultState: AwsHistoricalDataState = {
  currentWidgets: [costWidget.id, computeUsageWidget.id, storageUsageWidget.id],
  widgets: {
    [costWidget.id]: costWidget,
    [computeUsageWidget.id]: computeUsageWidget,
    [storageUsageWidget.id]: storageUsageWidget,
  },
};

export function awsHistoricalDataReducer(state = defaultState): AwsHistoricalDataState {
  return state;
}
