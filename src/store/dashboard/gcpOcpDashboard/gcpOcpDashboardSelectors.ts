import { RootState } from 'store/rootReducer';

import {
  gcpOcpDashboardDefaultFilters,
  gcpOcpDashboardStateKey,
  gcpOcpDashboardTabFilters,
  getQueryForWidget,
  getQueryForWidgetTabs,
} from './gcpOcpDashboardCommon';

export const selectGcpOcpDashboardState = (state: RootState) => state[gcpOcpDashboardStateKey];

export const selectWidgets = (state: RootState) => selectGcpOcpDashboardState(state).widgets;

export const selectWidget = (state: RootState, id: number) => selectWidgets(state)[id];

export const selectCurrentWidgets = (state: RootState) => selectGcpOcpDashboardState(state).currentWidgets;

export const selectWidgetQueries = (state: RootState, id: number) => {
  const widget = selectWidget(state, id);

  const filter = {
    ...gcpOcpDashboardDefaultFilters,
    ...(widget.filter ? widget.filter : {}),
  };
  const tabsFilter = {
    ...gcpOcpDashboardTabFilters,
    ...(widget.tabsFilter ? widget.tabsFilter : {}),
  };

  return {
    previous: getQueryForWidget({
      ...filter,
      time_scope_value: -2,
    }),
    current: getQueryForWidget(filter),
    forecast: getQueryForWidget({}, { limit: 31 }),
    tabs: getQueryForWidgetTabs(widget, {
      ...tabsFilter,
      resolution: 'monthly',
    }),
  };
};
