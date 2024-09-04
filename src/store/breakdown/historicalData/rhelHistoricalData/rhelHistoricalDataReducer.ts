import type { HistoricalDataWidget } from 'store/breakdown/historicalData/common/historicalDataCommon';

import { costWidget, cpuUsageWidget, memoryUsageWidget } from './rhelHistoricalDataWidgets';

export type RhelHistoricalDataState = Readonly<{
  widgets: Record<number, HistoricalDataWidget>;
  currentWidgets: number[];
}>;

export const defaultState: RhelHistoricalDataState = {
  currentWidgets: [costWidget.id, cpuUsageWidget.id, memoryUsageWidget.id],
  widgets: {
    [costWidget.id]: costWidget,
    [cpuUsageWidget.id]: cpuUsageWidget,
    [memoryUsageWidget.id]: memoryUsageWidget,
  },
};

export function rhelHistoricalDataReducer(state = defaultState): RhelHistoricalDataState {
  return state;
}
