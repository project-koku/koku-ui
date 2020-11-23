import { RootState } from 'store/rootReducer';

import {
  awsDashboardDefaultFilters,
  awsDashboardStateKey,
  awsDashboardTabFilters,
  getQueryForWidget,
  getQueryForWidgetTabs,
} from './awsDashboardCommon';

export const selectAwsDashboardState = (state: RootState) => state[awsDashboardStateKey];

export const selectWidgets = (state: RootState) => selectAwsDashboardState(state).widgets;

export const selectWidget = (state: RootState, id: number) => selectWidgets(state)[id];

export const selectCurrentWidgets = (state: RootState) => selectAwsDashboardState(state).currentWidgets;

export const selectWidgetQueries = (state: RootState, id: number) => {
  const widget = selectWidget(state, id);

  const filter = {
    ...awsDashboardDefaultFilters,
    ...(widget.filter ? widget.filter : {}),
  };
  const tabsFilter = {
    ...awsDashboardTabFilters,
    ...(widget.tabsFilter ? widget.tabsFilter : {}),
  };

  return {
    previous: getQueryForWidget({
      ...filter,
      time_scope_value: -2,
    }),
    current: getQueryForWidget(filter),
    forecast: getQueryForWidget({
      limit: 31,
      time_scope_value: -2,
    }),
    tabs: getQueryForWidgetTabs(widget, {
      ...tabsFilter,
      resolution: 'monthly',
    }),
  };
};
