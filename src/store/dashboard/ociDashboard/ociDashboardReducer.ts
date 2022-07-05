import { ActionType, getType } from 'typesafe-actions';

import { setWidgetTab } from './ociDashboardActions';
import { OciDashboardWidget } from './ociDashboardCommon';
import {
  costSummaryWidget,
  databaseWidget,
  networkWidget,
  storageWidget,
  virtualMachineWidget,
} from './ociDashboardWidgets';

export type OciDashboardAction = ActionType<typeof setWidgetTab>;

export type OciDashboardState = Readonly<{
  widgets: Record<number, OciDashboardWidget>;
  currentWidgets: number[];
}>;

export const defaultState: OciDashboardState = {
  currentWidgets: [
    costSummaryWidget.id,
    virtualMachineWidget.id,
    storageWidget.id,
    networkWidget.id,
    databaseWidget.id,
  ],
  widgets: {
    [costSummaryWidget.id]: costSummaryWidget,
    [virtualMachineWidget.id]: virtualMachineWidget,
    [databaseWidget.id]: databaseWidget,
    [networkWidget.id]: networkWidget,
    [storageWidget.id]: storageWidget,
  },
};

export function ociDashboardReducer(state = defaultState, action: OciDashboardAction): OciDashboardState {
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
