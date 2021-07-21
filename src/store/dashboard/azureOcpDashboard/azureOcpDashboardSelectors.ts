import { RootState } from 'store/rootReducer';

import {
  azureOcpDashboardDefaultFilters,
  azureOcpDashboardStateKey,
  azureOcpDashboardTabFilters,
  getQueryForWidget,
  getQueryForWidgetTabs,
} from './azureOcpDashboardCommon';

export const selectAzureOcpDashboardState = (state: RootState) => state[azureOcpDashboardStateKey];

export const selectWidgets = (state: RootState) => selectAzureOcpDashboardState(state).widgets;

export const selectWidget = (state: RootState, id: number) => selectWidgets(state)[id];

export const selectCurrentWidgets = (state: RootState) => selectAzureOcpDashboardState(state).currentWidgets;

export const selectWidgetQueries = (state: RootState, id: number) => {
  const widget = selectWidget(state, id);

  const filter = {
    ...azureOcpDashboardDefaultFilters,
    ...(widget.filter ? widget.filter : {}),
  };
  const tabsFilter = {
    ...azureOcpDashboardTabFilters,
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
