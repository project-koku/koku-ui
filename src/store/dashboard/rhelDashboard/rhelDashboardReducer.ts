import type { DashboardWidget } from 'store/dashboard/common/dashboardCommon';
import type { ActionType } from 'typesafe-actions';
import { getType } from 'typesafe-actions';

import { setWidgetTab } from './rhelDashboardActions';
import { costSummaryWidget, cpuWidget, memoryWidget, volumeWidget } from './rhelDashboardWidgets';

export type RhelDashboardAction = ActionType<typeof setWidgetTab>;

export type RhelDashboardState = Readonly<{
  widgets: Record<number, DashboardWidget>;
  currentWidgets: number[];
}>;

export const defaultState: RhelDashboardState = {
  currentWidgets: [costSummaryWidget.id, cpuWidget.id, memoryWidget.id, volumeWidget.id],
  widgets: {
    [costSummaryWidget.id]: costSummaryWidget,
    [cpuWidget.id]: cpuWidget,
    [memoryWidget.id]: memoryWidget,
    [volumeWidget.id]: volumeWidget,
  },
};

export function rhelDashboardReducer(state = defaultState, action: RhelDashboardAction): RhelDashboardState {
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
