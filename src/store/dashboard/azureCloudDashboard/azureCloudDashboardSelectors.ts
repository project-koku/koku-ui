import { RootState } from 'store/rootReducer';

import {
  azureCloudDashboardDefaultFilters,
  azureCloudDashboardStateKey,
  azureCloudDashboardTabFilters,
  getQueryForWidget,
  getQueryForWidgetTabs,
} from './azureCloudDashboardCommon';

export const selectAzureCloudDashboardState = (state: RootState) =>
  state[azureCloudDashboardStateKey];

export const selectWidgets = (state: RootState) =>
  selectAzureCloudDashboardState(state).widgets;

export const selectWidget = (state: RootState, id: number) =>
  selectWidgets(state)[id];

export const selectCurrentWidgets = (state: RootState) =>
  selectAzureCloudDashboardState(state).currentWidgets;

export const selectWidgetQueries = (state: RootState, id: number) => {
  const widget = selectWidget(state, id);

  const filter = {
    ...azureCloudDashboardDefaultFilters,
    ...(widget.filter ? widget.filter : {}),
  };
  const tabsFilter = {
    ...azureCloudDashboardTabFilters,
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
