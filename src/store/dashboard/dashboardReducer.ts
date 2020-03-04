import { ActionType, getType } from 'typesafe-actions';
import { setWidgetTab } from './dashboardActions';
import { DashboardWidget } from './dashboardCommon';
import {
  computeWidget,
  costSummaryWidget,
  databaseWidget,
  networkWidget,
  storageWidget,
} from './dashboardWidgets';

export type DashboardAction = ActionType<typeof setWidgetTab>;

export type DashboardState = Readonly<{
  widgets: Record<number, DashboardWidget>;
  currentWidgets: number[];
}>;

export const defaultState: DashboardState = {
  currentWidgets: [
    costSummaryWidget.id,
    computeWidget.id,
    storageWidget.id,
    networkWidget.id,
    databaseWidget.id,
  ],
  widgets: {
    [costSummaryWidget.id]: costSummaryWidget,
    [computeWidget.id]: computeWidget,
    [databaseWidget.id]: databaseWidget,
    [networkWidget.id]: networkWidget,
    [storageWidget.id]: storageWidget,
  },
};

export function dashboardReducer(
  state = defaultState,
  action: DashboardAction
): DashboardState {
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
