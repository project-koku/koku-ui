import { RootState } from 'store/rootReducer';
import {
  awsCloudDashboardDefaultFilters,
  awsCloudDashboardStateKey,
  awsCloudDashboardTabFilters,
  getQueryForWidget,
  getQueryForWidgetTabs,
} from './awsCloudDashboardCommon';

export const selectAwsCloudDashboardState = (state: RootState) =>
  state[awsCloudDashboardStateKey];

export const selectWidgets = (state: RootState) =>
  selectAwsCloudDashboardState(state).widgets;

export const selectWidget = (state: RootState, id: number) =>
  selectWidgets(state)[id];

export const selectCurrentWidgets = (state: RootState) =>
  selectAwsCloudDashboardState(state).currentWidgets;

export const selectWidgetQueries = (state: RootState, id: number) => {
  const widget = selectWidget(state, id);

  const filter = {
    ...awsCloudDashboardDefaultFilters,
    ...(widget.filter ? widget.filter : {}),
  };
  const tabsFilter = {
    ...awsCloudDashboardTabFilters,
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
