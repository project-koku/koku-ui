import { RootState } from 'store/rootReducer';
import {
  getQueryForWidget,
  getQueryForWidgetTabs,
  ocpOnAwsDashboardDefaultFilters,
  ocpOnAwsDashboardStateKey,
  ocpOnAwsDashboardTabFilters,
} from './ocpOnAwsDashboardCommon';

export const selectOcpOnAwsDashboardState = (state: RootState) =>
  state[ocpOnAwsDashboardStateKey];

export const selectWidgets = (state: RootState) =>
  selectOcpOnAwsDashboardState(state).widgets;

export const selectWidget = (state: RootState, id: number) =>
  selectWidgets(state)[id];

export const selectCurrentWidgets = (state: RootState) =>
  selectOcpOnAwsDashboardState(state).currentWidgets;

export const selectWidgetQueries = (state: RootState, id: number) => {
  const widget = selectWidget(state, id);

  const filter = {
    ...ocpOnAwsDashboardDefaultFilters,
    ...(widget.filter ? widget.filter : {}),
  };
  const tabsFilter = {
    ...ocpOnAwsDashboardTabFilters,
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
