import { ActionType, getType } from 'typesafe-actions';
import { setWidgetTab } from './ocpCloudDashboardActions';
import { OcpCloudDashboardWidget } from './ocpCloudDashboardCommon';
import {
  computeWidget,
  costSummaryWidget,
  cpuWidget,
  databaseWidget,
  memoryWidget,
  networkWidget,
  storageWidget,
  volumeWidget,
} from './ocpCloudDashboardWidgets';

export type OcpCloudDashboardAction = ActionType<typeof setWidgetTab>;

export type OcpCloudDashboardState = Readonly<{
  widgets: Record<number, OcpCloudDashboardWidget>;
  currentWidgets: number[];
}>;

export const defaultState: OcpCloudDashboardState = {
  currentWidgets: [
    costSummaryWidget.id,
    computeWidget.id,
    storageWidget.id,
    networkWidget.id,
    databaseWidget.id,
    cpuWidget.id,
    memoryWidget.id,
    volumeWidget.id,
  ],
  widgets: {
    [costSummaryWidget.id]: costSummaryWidget,
    [computeWidget.id]: computeWidget,
    [databaseWidget.id]: databaseWidget,
    [networkWidget.id]: networkWidget,
    [storageWidget.id]: storageWidget,
    [cpuWidget.id]: cpuWidget,
    [memoryWidget.id]: memoryWidget,
    [volumeWidget.id]: volumeWidget,
  },
};

export function ocpCloudDashboardReducer(
  state = defaultState,
  action: OcpCloudDashboardAction
): OcpCloudDashboardState {
  switch (action.type) {
    case getType(setWidgetTab):
      return {
        ...state,
        widgets: {
          ...state.widgets,
          [action.payload.id]: {
            ...state.widgets[action.payload.id],
            currentTab: action.payload.tab,
          },
        },
      };
    default:
      return state;
  }
}
