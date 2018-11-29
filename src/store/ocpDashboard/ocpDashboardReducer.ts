import { ActionType, getType } from 'typesafe-actions';
import { setWidgetTab } from './ocpDashboardActions';
import { OcpDashboardWidget } from './ocpDashboardCommon';
import {
  chargeSummaryWidget,
  cpuWidget,
  memoryWidget,
} from './ocpDashboardWidgets';

export type OcpDashboardAction = ActionType<typeof setWidgetTab>;

export type OcpDashboardState = Readonly<{
  widgets: Record<number, OcpDashboardWidget>;
  currentWidgets: number[];
}>;

export const defaultState: OcpDashboardState = {
  currentWidgets: [chargeSummaryWidget.id, cpuWidget.id, memoryWidget.id],
  widgets: {
    [chargeSummaryWidget.id]: chargeSummaryWidget,
    [cpuWidget.id]: cpuWidget,
    [memoryWidget.id]: memoryWidget,
  },
};

export function ocpDashboardReducer(
  state = defaultState,
  action: OcpDashboardAction
): OcpDashboardState {
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
