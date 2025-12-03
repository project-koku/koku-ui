import type { ActionType } from 'typesafe-actions';
import { getType } from 'typesafe-actions';

import type { DashboardWidget } from '../common/dashboardCommon';
import { setWidgetTab } from './ocpDashboardActions';
import { costSummaryWidget, cpuWidget, memoryWidget, optimizationsWidget, volumeWidget } from './ocpDashboardWidgets';

export type OcpDashboardAction = ActionType<typeof setWidgetTab>;

export type OcpDashboardState = Readonly<{
  widgets: Record<number, DashboardWidget>;
  currentWidgets: number[];
}>;

export const defaultState: OcpDashboardState = {
  currentWidgets: [costSummaryWidget.id, cpuWidget.id, memoryWidget.id, volumeWidget.id, optimizationsWidget.id],
  widgets: {
    [costSummaryWidget.id]: costSummaryWidget,
    [cpuWidget.id]: cpuWidget,
    [memoryWidget.id]: memoryWidget,
    [volumeWidget.id]: volumeWidget,
    [optimizationsWidget.id]: optimizationsWidget,
  },
};

export function ocpDashboardReducer(state = defaultState, action: OcpDashboardAction): OcpDashboardState {
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
