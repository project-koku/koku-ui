import type { OcpHistoricalDataWidget } from './ocpHistoricalDataCommon';
import { costWidget, cpuUsageWidget, memoryUsageWidget } from './ocpHistoricalDataWidgets';

export type OcpHistoricalDataState = Readonly<{
  widgets: Record<number, OcpHistoricalDataWidget>;
  currentWidgets: number[];
}>;

export const defaultState: OcpHistoricalDataState = {
  currentWidgets: [costWidget.id, cpuUsageWidget.id, memoryUsageWidget.id],
  widgets: {
    [costWidget.id]: costWidget,
    [cpuUsageWidget.id]: cpuUsageWidget,
    [memoryUsageWidget.id]: memoryUsageWidget,
  },
};

export function ocpHistoricalDataReducer(state = defaultState): OcpHistoricalDataState {
  return state;
}
