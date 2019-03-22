import { ActionType, getType } from 'typesafe-actions';
import { setWidgetTab } from './awsDetailsActions';
import { AwsDetailsWidget } from './awsDetailsCommon';
import { clusterWidget } from './awsDetailsWidgets';

export type AwsDetailsAction = ActionType<typeof setWidgetTab>;

export type AwsDetailsState = Readonly<{
  widgets: Record<number, AwsDetailsWidget>;
  currentWidgets: number[];
}>;

export const defaultState: AwsDetailsState = {
  currentWidgets: [clusterWidget.id],
  widgets: {
    [clusterWidget.id]: clusterWidget,
  },
};

export function awsDetailsReducer(
  state = defaultState,
  action: AwsDetailsAction
): AwsDetailsState {
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
