import { RootState } from '../rootReducer';
import {
  awsDashboardDefaultFilters,
  awsDashboardStateKey,
  getQueryForWidget,
} from './awsDashboardCommon';

export const selectAwsDashboardState = (state: RootState) =>
  state[awsDashboardStateKey];

export const selectWidgets = (state: RootState) =>
  selectAwsDashboardState(state).widgets;

export const selectWidget = (state: RootState, id: number) =>
  selectWidgets(state)[id];

export const selectCurrentWidgets = (state: RootState) =>
  selectAwsDashboardState(state).currentWidgets;

export const selectWidgetQueries = (state: RootState, id: number) => {
  const widget = selectWidget(state, id);

  return {
    previous: getQueryForWidget(widget, {
      ...awsDashboardDefaultFilters,
      time_scope_value: -2,
    }),
    current: getQueryForWidget(widget, awsDashboardDefaultFilters),
    tabs: getQueryForWidget(widget, {
      ...awsDashboardDefaultFilters,
      resolution: 'monthly',
    }),
  };
};
