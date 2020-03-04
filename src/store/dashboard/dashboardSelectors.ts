import { RootState } from 'store/rootReducer';
import {
  dashboardDefaultFilters,
  dashboardStateKey,
  dashboardTabFilters,
  getQueryForWidget,
  getQueryForWidgetTabs,
} from './dashboardCommon';

export const selectDashboardState = (state: RootState) =>
  state[dashboardStateKey];

export const selectWidgets = (state: RootState) =>
  selectDashboardState(state).widgets;

export const selectWidget = (state: RootState, id: number) =>
  selectWidgets(state)[id];

export const selectCurrentWidgets = (state: RootState) =>
  selectDashboardState(state).currentWidgets;

export const selectWidgetQueries = (state: RootState, id: number) => {
  const widget = selectWidget(state, id);

  const filter = {
    ...dashboardDefaultFilters,
    ...(widget.filter ? widget.filter : {}),
  };
  const tabsFilter = {
    ...dashboardTabFilters,
    ...(widget.tabsFilter ? widget.tabsFilter : {}),
  };

  return {
    previous: getQueryForWidget({
      ...filter,
      time_scope_value: -2,
    }),
    current: getQueryForWidget(filter),
    tabs: getQueryForWidgetTabs(widget, {
      ...tabsFilter,
      resolution: 'monthly',
    }),
  };
};
