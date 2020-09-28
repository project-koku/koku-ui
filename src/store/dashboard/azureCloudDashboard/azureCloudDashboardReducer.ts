import { ActionType, getType } from 'typesafe-actions';

import { setWidgetTab } from './azureCloudDashboardActions';
import { AzureCloudDashboardWidget } from './azureCloudDashboardCommon';
import {
  costSummaryWidget,
  databaseWidget,
  networkWidget,
  storageWidget,
  virtualMachineWidget,
} from './azureCloudDashboardWidgets';

export type AzureCloudDashboardAction = ActionType<typeof setWidgetTab>;

export type AzureCloudDashboardState = Readonly<{
  widgets: Record<number, AzureCloudDashboardWidget>;
  currentWidgets: number[];
}>;

export const defaultState: AzureCloudDashboardState = {
  currentWidgets: [
    costSummaryWidget.id,
    virtualMachineWidget.id,
    storageWidget.id,
    networkWidget.id,
    databaseWidget.id,
  ],
  widgets: {
    [costSummaryWidget.id]: costSummaryWidget,
    [virtualMachineWidget.id]: virtualMachineWidget,
    [databaseWidget.id]: databaseWidget,
    [networkWidget.id]: networkWidget,
    [storageWidget.id]: storageWidget,
  },
};

export function azureCloudDashboardReducer(
  state = defaultState,
  action: AzureCloudDashboardAction
): AzureCloudDashboardState {
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
