import { RootState } from '../rootReducer';
import {
  dashboardDefaultFilters,
  dashboardStateKey,
  getQueryForWidget,
} from './dashboardCommon';

export const selectDashboardState = (state: RootState) =>
  state[dashboardStateKey];

export const selectWidgets = (state: RootState) =>
  selectDashboardState(state).widgets;

export const selectWidget = (state: RootState, id: number) =>
  selectWidgets(state)[id];

export const selectCurrentWidgets = (state: RootState) =>
  selectDashboardState(state).currenWidgets;

export const selectWidgetQueries = (state: RootState, id: number) => {
  const widget = selectWidget(state, id);

  return {
    previous: getQueryForWidget(widget, {
      ...dashboardDefaultFilters,
      time_scope_value: -2,
    }),
    current: getQueryForWidget(widget, dashboardDefaultFilters),
    tabs: getQueryForWidget(widget, {
      ...dashboardDefaultFilters,
      resolution: 'monthly',
    }),
  };
};
