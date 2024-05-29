import type { OcpHistoricalDataWidget } from './ocpHistoricalDataCommon';
import {
  costWidget,
  cpuUsageWidget,
  memoryUsageWidget,
  networkUsageWidget,
  volumeUsageWidget,
} from './ocpHistoricalDataWidgets';

export type OcpHistoricalDataState = Readonly<{
  widgets: Record<number, OcpHistoricalDataWidget>;
  currentWidgets: number[];
}>;

export const defaultState: OcpHistoricalDataState = {
  currentWidgets: [costWidget.id, cpuUsageWidget.id, memoryUsageWidget.id, networkUsageWidget.id, volumeUsageWidget.id],
  widgets: {
    [costWidget.id]: costWidget,
    [cpuUsageWidget.id]: cpuUsageWidget,
    [memoryUsageWidget.id]: memoryUsageWidget,
    [networkUsageWidget.id]: networkUsageWidget,
    [volumeUsageWidget.id]: volumeUsageWidget,
  },
};

export function ocpHistoricalDataReducer(state = defaultState): OcpHistoricalDataState {
  return state;
}
