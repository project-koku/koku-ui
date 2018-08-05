import { ActionType, getType } from 'typesafe-actions';
import { setWidgetTab } from './dashboardActions';
import { DashboardWidget } from './dashboardCommon';
import {
  computeWidget,
  costSummaryWidget,
  storageWidget,
} from './dashboardWidgets';

export type DashboardAction = ActionType<typeof setWidgetTab>;

export type DashboardState = Readonly<{
  widgets: Record<number, DashboardWidget>;
  currenWidgets: number[];
}>;

export const defaultState: DashboardState = {
  currenWidgets: [costSummaryWidget.id, computeWidget.id, storageWidget.id],
  widgets: {
    [costSummaryWidget.id]: costSummaryWidget,
    [computeWidget.id]: computeWidget,
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
