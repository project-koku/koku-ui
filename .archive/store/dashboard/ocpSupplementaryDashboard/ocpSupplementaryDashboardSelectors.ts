import { RootState } from 'store/rootReducer';

import {
  getQueryForWidget,
  getQueryForWidgetTabs,
  ocpSupplementaryDashboardDefaultFilters,
  ocpSupplementaryDashboardStateKey,
  ocpSupplementaryDashboardTabFilters,
} from './ocpSupplementaryDashboardCommon';

export const selectOcpSupplementaryDashboardState = (state: RootState) => state[ocpSupplementaryDashboardStateKey];

export const selectWidgets = (state: RootState) => selectOcpSupplementaryDashboardState(state).widgets;

export const selectWidget = (state: RootState, id: number) => selectWidgets(state)[id];

export const selectCurrentWidgets = (state: RootState) => selectOcpSupplementaryDashboardState(state).currentWidgets;

export const selectWidgetQueries = (state: RootState, id: number) => {
  const widget = selectWidget(state, id);

  const defaultFilter = {
    ...ocpSupplementaryDashboardDefaultFilters,
    ...(widget.filter ? widget.filter : {}),
  };
  const tabsFilter = {
    ...ocpSupplementaryDashboardTabFilters,
    ...(widget.tabsFilter ? widget.tabsFilter : {}),
  };

  return {
    previous: getQueryForWidget({
      ...defaultFilter,
      time_scope_value: -2,
    }),
    current: getQueryForWidget(defaultFilter),
    forecast: getQueryForWidget({}, { limit: 31 }),
    tabs: getQueryForWidgetTabs(widget, {
      ...tabsFilter,
      resolution: 'monthly',
    }),
  };
};
