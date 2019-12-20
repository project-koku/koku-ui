import { RootState } from 'store/rootReducer';
import {
  getQueryForWidget,
  getQueryForWidgetTabs,
  ocpOnCloudDashboardDefaultFilters,
  ocpOnCloudDashboardStateKey,
  ocpOnCloudDashboardTabFilters,
} from './ocpOnCloudDashboardCommon';

export const selectOcpOnCloudDashboardState = (state: RootState) =>
  state[ocpOnCloudDashboardStateKey];

export const selectWidgets = (state: RootState) =>
  selectOcpOnCloudDashboardState(state).widgets;

export const selectWidget = (state: RootState, id: number) =>
  selectWidgets(state)[id];

export const selectCurrentWidgets = (state: RootState) =>
  selectOcpOnCloudDashboardState(state).currentWidgets;

export const selectWidgetQueries = (state: RootState, id: number) => {
  const widget = selectWidget(state, id);

  const defaultFilter = {
    ...ocpOnCloudDashboardDefaultFilters,
    ...(widget.filter ? widget.filter : {}),
  };
  const tabsFilter = {
    ...ocpOnCloudDashboardTabFilters,
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
