import type { ActionType } from 'typesafe-actions';
import { getType } from 'typesafe-actions';

import { setWidgetTab } from './awsOcpDashboardActions';
import type { AwsOcpDashboardWidget } from './awsOcpDashboardCommon';
import {
  computeWidget,
  costSummaryWidget,
  databaseWidget,
  networkWidget,
  storageWidget,
} from './awsOcpDashboardWidgets';

export type AwsOcpDashboardAction = ActionType<typeof setWidgetTab>;

export type AwsOcpDashboardState = Readonly<{
  widgets: Record<number, AwsOcpDashboardWidget>;
  currentWidgets: number[];
}>;

export const defaultState: AwsOcpDashboardState = {
  currentWidgets: [costSummaryWidget.id, computeWidget.id, storageWidget.id, networkWidget.id, databaseWidget.id],
  widgets: {
    [costSummaryWidget.id]: costSummaryWidget,
    [computeWidget.id]: computeWidget,
    [databaseWidget.id]: databaseWidget,
    [networkWidget.id]: networkWidget,
    [storageWidget.id]: storageWidget,
  },
};

export function awsOcpDashboardReducer(state = defaultState, action: AwsOcpDashboardAction): AwsOcpDashboardState {
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
