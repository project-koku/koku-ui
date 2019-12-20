import { ActionType, getType } from 'typesafe-actions';
import { setWidgetTab } from './ocpOnCloudDashboardActions';
import { OcpOnCloudDashboardWidget } from './ocpOnCloudDashboardCommon';
import {
  computeWidget,
  costSummaryWidget,
  cpuWidget,
  databaseWidget,
  memoryWidget,
  networkWidget,
  storageWidget,
  volumeWidget,
} from './ocpOnCloudDashboardWidgets';

export type OcpOnCloudDashboardAction = ActionType<typeof setWidgetTab>;

export type OcpOnCloudDashboardState = Readonly<{
  widgets: Record<number, OcpOnCloudDashboardWidget>;
  currentWidgets: number[];
}>;

export const defaultState: OcpOnCloudDashboardState = {
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

export function ocpOnCloudDashboardReducer(
  state = defaultState,
  action: OcpOnCloudDashboardAction
): OcpOnCloudDashboardState {
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
