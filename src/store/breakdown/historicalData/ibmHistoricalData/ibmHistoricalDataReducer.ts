import type { HistoricalDataWidget } from 'store/breakdown/historicalData/common/historicalDataCommon';

import { computeUsageWidget, costWidget, storageUsageWidget } from './ibmHistoricalDataWidgets';

export type IbmHistoricalDataState = Readonly<{
  widgets: Record<number, HistoricalDataWidget>;
  currentWidgets: number[];
}>;

export const defaultState: IbmHistoricalDataState = {
  currentWidgets: [costWidget.id, computeUsageWidget.id, storageUsageWidget.id],
  widgets: {
    [costWidget.id]: costWidget,
    [computeUsageWidget.id]: computeUsageWidget,
    [storageUsageWidget.id]: storageUsageWidget,
  },
};

export function ibmHistoricalDataReducer(state = defaultState): IbmHistoricalDataState {
  return state;
}
