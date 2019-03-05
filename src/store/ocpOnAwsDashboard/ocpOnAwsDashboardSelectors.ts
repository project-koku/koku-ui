import { RootState } from 'store/rootReducer';
import {
  getQueryForWidget,
  ocpOnAwsDashboardDefaultFilters,
  ocpOnAwsDashboardStateKey,
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
  const tabsFilter = {
    ...ocpOnAwsDashboardDefaultFilters,
  };
  if (widget.tabsLimit) {
    tabsFilter.limit = widget.tabsLimit;
  }

  return {
    previous: getQueryForWidget(widget, {
      ...ocpOnAwsDashboardDefaultFilters,
      time_scope_value: -2,
    }),
    current: getQueryForWidget(widget, ocpOnAwsDashboardDefaultFilters),
    tabs: getQueryForWidget(widget, {
      ...tabsFilter,
      resolution: 'monthly',
    }),
  };
};
