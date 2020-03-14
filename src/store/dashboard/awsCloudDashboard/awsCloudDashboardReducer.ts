import { ActionType, getType } from 'typesafe-actions';
import { setWidgetTab } from './awsCloudDashboardActions';
import { AwsCloudDashboardWidget } from './awsCloudDashboardCommon';
import {
  computeWidget,
  costSummaryWidget,
  databaseWidget,
  networkWidget,
  storageWidget,
} from './awsCloudDashboardWidgets';

export type AwsCloudDashboardAction = ActionType<typeof setWidgetTab>;

export type AwsCloudDashboardState = Readonly<{
  widgets: Record<number, AwsCloudDashboardWidget>;
  currentWidgets: number[];
}>;

export const defaultState: AwsCloudDashboardState = {
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

export function awsCloudDashboardReducer(
  state = defaultState,
  action: AwsCloudDashboardAction
): AwsCloudDashboardState {
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
