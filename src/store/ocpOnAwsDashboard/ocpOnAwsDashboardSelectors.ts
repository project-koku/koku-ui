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

  const defaultFilter = {
    ...ocpOnAwsDashboardDefaultFilters,
    ...(widget.filter ? widget.filter : {}),
  };
  const tabsFilter = {
    ...ocpOnAwsDashboardTabFilters,
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
