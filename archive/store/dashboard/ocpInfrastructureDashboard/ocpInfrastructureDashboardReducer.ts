import { ActionType, getType } from 'typesafe-actions';

import { setWidgetTab } from './ocpInfrastructureDashboardActions';
import { OcpInfrastructureDashboardWidget } from './ocpInfrastructureDashboardCommon';
import { costSummaryWidget, cpuWidget, memoryWidget, volumeWidget } from './ocpInfrastructureDashboardWidgets';

export type OcpInfrastructureDashboardAction = ActionType<typeof setWidgetTab>;

export type OcpInfrastructureDashboardState = Readonly<{
  widgets: Record<number, OcpInfrastructureDashboardWidget>;
  currentWidgets: number[];
}>;

export const defaultState: OcpInfrastructureDashboardState = {
  currentWidgets: [costSummaryWidget.id, cpuWidget.id, memoryWidget.id, volumeWidget.id],
  widgets: {
    [costSummaryWidget.id]: costSummaryWidget,
    [cpuWidget.id]: cpuWidget,
    [memoryWidget.id]: memoryWidget,
    [volumeWidget.id]: volumeWidget,
  },
};

export function ocpInfrastructureDashboardReducer(
  state = defaultState,
  action: OcpInfrastructureDashboardAction
): OcpInfrastructureDashboardState {
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
