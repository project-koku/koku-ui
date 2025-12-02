import type { ActionType } from 'typesafe-actions';
import { getType } from 'typesafe-actions';

import type { DashboardWidget } from '../common/dashboardCommon';
import { setWidgetTab } from './gcpDashboardActions';
import { computeWidget, costSummaryWidget, databaseWidget, networkWidget, storageWidget } from './gcpDashboardWidgets';

export type GcpDashboardAction = ActionType<typeof setWidgetTab>;

export type GcpDashboardState = Readonly<{
  widgets: Record<number, DashboardWidget>;
  currentWidgets: number[];
}>;

export const defaultState: GcpDashboardState = {
  currentWidgets: [costSummaryWidget.id, computeWidget.id, storageWidget.id, networkWidget.id, databaseWidget.id],
  widgets: {
    [costSummaryWidget.id]: costSummaryWidget,
    [computeWidget.id]: computeWidget,
    [storageWidget.id]: storageWidget,
    [networkWidget.id]: networkWidget,
    [databaseWidget.id]: databaseWidget,
  },
};

export function gcpDashboardReducer(state = defaultState, action: GcpDashboardAction): GcpDashboardState {
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
