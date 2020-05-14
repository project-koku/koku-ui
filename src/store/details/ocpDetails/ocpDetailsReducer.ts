import { OcpDetailsWidget } from './ocpDetailsCommon';
import {
  costBreakdownWidget,
  cpuUsageWidget,
  memoryUsageWidget,
  projectSummaryWidget,
} from './ocpDetailsWidgets';

export type OcpDetailsState = Readonly<{
  widgets: Record<number, OcpDetailsWidget>;
  currentWidgets: number[];
}>;

export const defaultState: OcpDetailsState = {
  currentWidgets: [
    costBreakdownWidget.id,
    projectSummaryWidget.id,
    memoryUsageWidget.id,
    cpuUsageWidget.id,
  ],
  widgets: {
    [costBreakdownWidget.id]: costBreakdownWidget,
    [projectSummaryWidget.id]: projectSummaryWidget,
    [memoryUsageWidget.id]: memoryUsageWidget,
    [cpuUsageWidget.id]: cpuUsageWidget,
  },
};

export function ocpDetailsReducer(
  state = defaultState,
  action: any
): OcpDetailsState {
  return state;
}
