import { RootState } from 'store/rootReducer';

import {
  getQueryForWidget,
  getQueryForWidgetTabs,
  ocpUsageDashboardDefaultFilters,
  ocpUsageDashboardStateKey,
  ocpUsageDashboardTabFilters,
} from './ocpUsageDashboardCommon';

export const selectOcpUsageDashboardState = (state: RootState) => state[ocpUsageDashboardStateKey];

export const selectWidgets = (state: RootState) => selectOcpUsageDashboardState(state).widgets;

export const selectWidget = (state: RootState, id: number) => selectWidgets(state)[id];

export const selectCurrentWidgets = (state: RootState) => selectOcpUsageDashboardState(state).currentWidgets;

export const selectWidgetQueries = (state: RootState, id: number) => {
  const widget = selectWidget(state, id);

  const defaultFilter = {
    ...ocpUsageDashboardDefaultFilters,
    ...(widget.filter ? widget.filter : {}),
  };
  const tabsFilter = {
    ...ocpUsageDashboardTabFilters,
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
