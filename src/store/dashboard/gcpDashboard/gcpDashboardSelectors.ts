import { RootState } from 'store/rootReducer';

import {
  gcpDashboardDefaultFilters,
  gcpDashboardStateKey,
  gcpDashboardTabFilters,
  getQueryForWidget,
  getQueryForWidgetTabs,
} from './gcpDashboardCommon';

export const selectGcpDashboardState = (state: RootState) => state[gcpDashboardStateKey];

export const selectWidgets = (state: RootState) => selectGcpDashboardState(state).widgets;

export const selectWidget = (state: RootState, id: number) => selectWidgets(state)[id];

export const selectCurrentWidgets = (state: RootState) => selectGcpDashboardState(state).currentWidgets;

export const selectWidgetQueries = (state: RootState, id: number) => {
  const widget = selectWidget(state, id);

  const filter = {
    ...gcpDashboardDefaultFilters,
    ...(widget.filter ? widget.filter : {}),
  };
  const tabsFilter = {
    ...gcpDashboardTabFilters,
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
