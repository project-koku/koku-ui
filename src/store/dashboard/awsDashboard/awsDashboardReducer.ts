import type { ActionType } from 'typesafe-actions';
import { getType } from 'typesafe-actions';

import { setWidgetTab } from './awsDashboardActions';
import type { AwsDashboardWidget } from './awsDashboardCommon';
import { computeWidget, costSummaryWidget, databaseWidget, networkWidget, storageWidget } from './awsDashboardWidgets';

export type AwsDashboardAction = ActionType<typeof setWidgetTab>;

export type AwsDashboardState = Readonly<{
  widgets: Record<number, AwsDashboardWidget>;
  currentWidgets: number[];
}>;

export const defaultState: AwsDashboardState = {
  currentWidgets: [costSummaryWidget.id, computeWidget.id, storageWidget.id, networkWidget.id, databaseWidget.id],
  widgets: {
    [costSummaryWidget.id]: costSummaryWidget,
    [computeWidget.id]: computeWidget,
    [databaseWidget.id]: databaseWidget,
    [networkWidget.id]: networkWidget,
    [storageWidget.id]: storageWidget,
  },
};

export function awsDashboardReducer(state = defaultState, action: AwsDashboardAction): AwsDashboardState {
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
