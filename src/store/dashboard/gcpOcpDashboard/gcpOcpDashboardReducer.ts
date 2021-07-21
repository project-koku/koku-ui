import { ActionType, getType } from 'typesafe-actions';

import { setWidgetTab } from './gcpOcpDashboardActions';
import { GcpOcpDashboardWidget } from './gcpOcpDashboardCommon';
import {
  computeWidget,
  costSummaryWidget,
  databaseWidget,
  networkWidget,
  storageWidget,
} from './gcpOcpDashboardWidgets';

export type GcpOcpDashboardAction = ActionType<typeof setWidgetTab>;

export type GcpOcpDashboardState = Readonly<{
  widgets: Record<number, GcpOcpDashboardWidget>;
  currentWidgets: number[];
}>;

export const defaultState: GcpOcpDashboardState = {
  currentWidgets: [costSummaryWidget.id, computeWidget.id, storageWidget.id, networkWidget.id, databaseWidget.id],
  widgets: {
    [costSummaryWidget.id]: costSummaryWidget,
    [computeWidget.id]: computeWidget,
    [storageWidget.id]: storageWidget,
    [networkWidget.id]: networkWidget,
    [databaseWidget.id]: databaseWidget,
  },
};

export function gcpOcpDashboardReducer(state = defaultState, action: GcpOcpDashboardAction): GcpOcpDashboardState {
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
