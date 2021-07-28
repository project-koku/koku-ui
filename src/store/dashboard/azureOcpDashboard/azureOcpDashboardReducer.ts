import { ActionType, getType } from 'typesafe-actions';

import { setWidgetTab } from './azureOcpDashboardActions';
import { AzureOcpDashboardWidget } from './azureOcpDashboardCommon';
import {
  costSummaryWidget,
  databaseWidget,
  networkWidget,
  storageWidget,
  virtualMachineWidget,
} from './azureOcpDashboardWidgets';

export type AzureOcpDashboardAction = ActionType<typeof setWidgetTab>;

export type AzureOcpDashboardState = Readonly<{
  widgets: Record<number, AzureOcpDashboardWidget>;
  currentWidgets: number[];
}>;

export const defaultState: AzureOcpDashboardState = {
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

export function azureOcpDashboardReducer(
  state = defaultState,
  action: AzureOcpDashboardAction
): AzureOcpDashboardState {
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
