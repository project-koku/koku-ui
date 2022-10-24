import type { ActionType } from 'typesafe-actions';
import { getType } from 'typesafe-actions';

import { setWidgetTab } from './ibmDashboardActions';
import type { IbmDashboardWidget } from './ibmDashboardCommon';
import { computeWidget, costSummaryWidget, databaseWidget, networkWidget, storageWidget } from './ibmDashboardWidgets';

export type IbmDashboardAction = ActionType<typeof setWidgetTab>;

export type IbmDashboardState = Readonly<{
  widgets: Record<number, IbmDashboardWidget>;
  currentWidgets: number[];
}>;

export const defaultState: IbmDashboardState = {
  currentWidgets: [costSummaryWidget.id, computeWidget.id, storageWidget.id, networkWidget.id, databaseWidget.id],
  widgets: {
    [costSummaryWidget.id]: costSummaryWidget,
    [computeWidget.id]: computeWidget,
    [storageWidget.id]: storageWidget,
    [networkWidget.id]: networkWidget,
    [databaseWidget.id]: databaseWidget,
  },
};

export function ibmDashboardReducer(state = defaultState, action: IbmDashboardAction): IbmDashboardState {
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
