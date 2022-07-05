import { RootState } from 'store/rootReducer';

import {
  getQueryForWidget,
  getQueryForWidgetTabs,
  ociDashboardDefaultFilters,
  ociDashboardStateKey,
  ociDashboardTabFilters,
} from './ociDashboardCommon';

export const selectOciDashboardState = (state: RootState) => state[ociDashboardStateKey];

export const selectWidgets = (state: RootState) => selectOciDashboardState(state).widgets;

export const selectWidget = (state: RootState, id: number) => selectWidgets(state)[id];

export const selectCurrentWidgets = (state: RootState) => selectOciDashboardState(state).currentWidgets;

export const selectWidgetQueries = (state: RootState, id: number) => {
  const widget = selectWidget(state, id);

  const filter = {
    ...ociDashboardDefaultFilters,
    ...(widget.filter ? widget.filter : {}),
  };
  const tabsFilter = {
    ...ociDashboardTabFilters,
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
