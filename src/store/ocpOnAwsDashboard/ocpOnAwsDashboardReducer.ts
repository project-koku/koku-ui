import { ActionType, getType } from 'typesafe-actions';
import { setWidgetTab } from './ocpOnAwsDashboardActions';
import { OcpOnAwsDashboardWidget } from './ocpOnAwsDashboardCommon';
import {
  computeWidget,
  costSummaryWidget,
  cpuWidget,
  memoryWidget,
  storageWidget,
} from './ocpOnAwsDashboardWidgets';

export type OcpOnAwsDashboardAction = ActionType<typeof setWidgetTab>;

export type OcpOnAwsDashboardState = Readonly<{
  widgets: Record<number, OcpOnAwsDashboardWidget>;
  currentWidgets: number[];
}>;

export const defaultState: OcpOnAwsDashboardState = {
  currentWidgets: [
    costSummaryWidget.id,
    computeWidget.id,
    storageWidget.id,
    cpuWidget.id,
    memoryWidget.id,
  ],
  widgets: {
    [costSummaryWidget.id]: costSummaryWidget,
    [computeWidget.id]: computeWidget,
    [storageWidget.id]: storageWidget,
    [cpuWidget.id]: cpuWidget,
    [memoryWidget.id]: memoryWidget,
  },
};

export function ocpOnAwsDashboardReducer(
  state = defaultState,
  action: OcpOnAwsDashboardAction
): OcpOnAwsDashboardState {
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
