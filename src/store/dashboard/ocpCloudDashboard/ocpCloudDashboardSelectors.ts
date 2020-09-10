import { RootState } from 'store/rootReducer';

import {
  getQueryForWidget,
  getQueryForWidgetTabs,
  ocpCloudDashboardDefaultFilters,
  ocpCloudDashboardStateKey,
  ocpCloudDashboardTabFilters,
} from './ocpCloudDashboardCommon';

export const selectOcpCloudDashboardState = (state: RootState) =>
  state[ocpCloudDashboardStateKey];

export const selectWidgets = (state: RootState) =>
  selectOcpCloudDashboardState(state).widgets;

export const selectWidget = (state: RootState, id: number) =>
  selectWidgets(state)[id];

export const selectCurrentWidgets = (state: RootState) =>
  selectOcpCloudDashboardState(state).currentWidgets;

export const selectWidgetQueries = (state: RootState, id: number) => {
  const widget = selectWidget(state, id);

  const defaultFilter = {
    ...ocpCloudDashboardDefaultFilters,
    ...(widget.filter ? widget.filter : {}),
  };
  const tabsFilter = {
    ...ocpCloudDashboardTabFilters,
    ...(widget.tabsFilter ? widget.tabsFilter : {}),
  };

  return {
    previous: getQueryForWidget({
      ...defaultFilter,
      time_scope_value: -2,
    }),
    current: getQueryForWidget(defaultFilter),
    tabs: getQueryForWidgetTabs(widget, {
      ...tabsFilter,
      resolution: 'monthly',
    }),
  };
};
