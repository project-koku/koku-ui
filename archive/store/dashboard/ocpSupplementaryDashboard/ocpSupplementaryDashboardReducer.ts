import { ActionType, getType } from 'typesafe-actions';

import { setWidgetTab } from './ocpSupplementaryDashboardActions';
import { OcpSupplementaryDashboardWidget } from './ocpSupplementaryDashboardCommon';
import { costSummaryWidget, cpuWidget, memoryWidget, volumeWidget } from './ocpSupplementaryDashboardWidgets';

export type OcpSupplementaryDashboardAction = ActionType<typeof setWidgetTab>;

export type OcpSupplementaryDashboardState = Readonly<{
  widgets: Record<number, OcpSupplementaryDashboardWidget>;
  currentWidgets: number[];
}>;

export const defaultState: OcpSupplementaryDashboardState = {
  currentWidgets: [costSummaryWidget.id, cpuWidget.id, memoryWidget.id, volumeWidget.id],
  widgets: {
    [costSummaryWidget.id]: costSummaryWidget,
    [cpuWidget.id]: cpuWidget,
    [memoryWidget.id]: memoryWidget,
    [volumeWidget.id]: volumeWidget,
  },
};

export function ocpSupplementaryDashboardReducer(
  state = defaultState,
  action: OcpSupplementaryDashboardAction
): OcpSupplementaryDashboardState {
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
