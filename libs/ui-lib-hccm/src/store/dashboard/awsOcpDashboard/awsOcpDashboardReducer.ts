import type { ActionType } from 'typesafe-actions';
import { getType } from 'typesafe-actions';

import type { DashboardWidget } from '../common/dashboardCommon';
import { setWidgetTab } from './awsOcpDashboardActions';
import {
  computeWidget,
  costSummaryWidget,
  databaseWidget,
  networkWidget,
  storageWidget,
} from './awsOcpDashboardWidgets';

export type AwsOcpDashboardAction = ActionType<typeof setWidgetTab>;

export type AwsOcpDashboardState = Readonly<{
  widgets: Record<number, DashboardWidget>;
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
