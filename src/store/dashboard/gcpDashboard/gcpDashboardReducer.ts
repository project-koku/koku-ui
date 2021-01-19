import { ActionType, getType } from 'typesafe-actions';

import { setWidgetTab } from './gcpDashboardActions';
import { GcpDashboardWidget } from './gcpDashboardCommon';
import { costSummaryWidget } from './gcpDashboardWidgets';
// import { computeWidget, costSummaryWidget, databaseWidget, networkWidget, storageWidget } from './gcpDashboardWidgets';

export type GcpDashboardAction = ActionType<typeof setWidgetTab>;

export type GcpDashboardState = Readonly<{
  widgets: Record<number, GcpDashboardWidget>;
  currentWidgets: number[];
}>;

export const defaultState: GcpDashboardState = {
  // currentWidgets: [costSummaryWidget.id, computeWidget.id, storageWidget.id, networkWidget.id, databaseWidget.id],
  currentWidgets: [costSummaryWidget.id],
  widgets: {
    [costSummaryWidget.id]: costSummaryWidget,
    // [computeWidget.id]: computeWidget,
    // [databaseWidget.id]: databaseWidget,
    // [networkWidget.id]: networkWidget,
    // [storageWidget.id]: storageWidget,
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
