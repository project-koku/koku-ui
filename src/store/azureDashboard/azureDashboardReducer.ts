import { ActionType, getType } from 'typesafe-actions';
import { setWidgetTab } from './azureDashboardActions';
import { AzureDashboardWidget } from './azureDashboardCommon';
import {
  computeWidget,
  // costSummaryWidget,
  // databaseWidget,
  // networkWidget,
  // storageWidget,
} from './azureDashboardWidgets';

export type AzureDashboardAction = ActionType<typeof setWidgetTab>;

export type AzureDashboardState = Readonly<{
  widgets: Record<number, AzureDashboardWidget>;
  currentWidgets: number[];
}>;

export const defaultState: AzureDashboardState = {
  currentWidgets: [
    // costSummaryWidget.id,
    computeWidget.id,
    // storageWidget.id,
    // networkWidget.id,
    // databaseWidget.id,
  ],
  widgets: {
    // [costSummaryWidget.id]: costSummaryWidget,
    [computeWidget.id]: computeWidget,
    // [databaseWidget.id]: databaseWidget,
    // [networkWidget.id]: networkWidget,
    // [storageWidget.id]: storageWidget,
  },
};

export function azureDashboardReducer(
  state = defaultState,
  action: AzureDashboardAction
): AzureDashboardState {
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
