import { ActionType, getType } from 'typesafe-actions';
import { setWidgetTab } from './ocpOnAwsDetailsActions';
import { OcpOnAwsDetailsWidget } from './ocpOnAwsDetailsCommon';
import { clusterWidget } from './ocpOnAwsDetailsWidgets';

export type OcpOnAwsDetailsAction = ActionType<typeof setWidgetTab>;

export type OcpOnAwsDetailsState = Readonly<{
  widgets: Record<number, OcpOnAwsDetailsWidget>;
  currentWidgets: number[];
}>;

export const defaultState: OcpOnAwsDetailsState = {
  currentWidgets: [clusterWidget.id],
  widgets: {
    [clusterWidget.id]: clusterWidget,
  },
};

export function ocpOnAwsDetailsReducer(
  state = defaultState,
  action: OcpOnAwsDetailsAction
): OcpOnAwsDetailsState {
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
