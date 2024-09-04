import type { HistoricalDataWidget } from 'store/breakdown/historicalData/common/historicalDataCommon';

import { computeUsageWidget, costWidget, storageUsageWidget } from './ociHistoricalDataWidgets';

export type OciHistoricalDataState = Readonly<{
  widgets: Record<number, HistoricalDataWidget>;
  currentWidgets: number[];
}>;

export const defaultState: OciHistoricalDataState = {
  currentWidgets: [costWidget.id, computeUsageWidget.id, storageUsageWidget.id],
  widgets: {
    [costWidget.id]: costWidget,
    [computeUsageWidget.id]: computeUsageWidget,
    [storageUsageWidget.id]: storageUsageWidget,
  },
};

export function ociHistoricalDataReducer(state = defaultState): OciHistoricalDataState {
  return state;
}
