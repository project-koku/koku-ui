import { ActionType, getType } from 'typesafe-actions';

import { setWidgetTab } from './ocpUsageDashboardActions';
import { OcpUsageDashboardWidget } from './ocpUsageDashboardCommon';
import { costSummaryWidget, cpuWidget, memoryWidget, volumeWidget } from './ocpUsageDashboardWidgets';

export type OcpUsageDashboardAction = ActionType<typeof setWidgetTab>;

export type OcpUsageDashboardState = Readonly<{
  widgets: Record<number, OcpUsageDashboardWidget>;
  currentWidgets: number[];
}>;

export const defaultState: OcpUsageDashboardState = {
  currentWidgets: [costSummaryWidget.id, cpuWidget.id, memoryWidget.id, volumeWidget.id],
  widgets: {
    [costSummaryWidget.id]: costSummaryWidget,
    [cpuWidget.id]: cpuWidget,
    [memoryWidget.id]: memoryWidget,
    [volumeWidget.id]: volumeWidget,
  },
};

export function ocpUsageDashboardReducer(
  state = defaultState,
  action: OcpUsageDashboardAction
): OcpUsageDashboardState {
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
