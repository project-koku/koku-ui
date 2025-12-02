import type { ActionType } from 'typesafe-actions';
import { getType } from 'typesafe-actions';

import type { DashboardWidget } from '../common/dashboardCommon';
import { setWidgetTab } from './azureDashboardActions';
import {
  costSummaryWidget,
  databaseWidget,
  networkWidget,
  storageWidget,
  virtualMachineWidget,
} from './azureDashboardWidgets';

export type AzureDashboardAction = ActionType<typeof setWidgetTab>;

export type AzureDashboardState = Readonly<{
  widgets: Record<number, DashboardWidget>;
  currentWidgets: number[];
}>;

export const defaultState: AzureDashboardState = {
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

export function azureDashboardReducer(state = defaultState, action: AzureDashboardAction): AzureDashboardState {
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
