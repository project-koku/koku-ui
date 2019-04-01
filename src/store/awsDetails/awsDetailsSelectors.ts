import { RootState } from 'store/rootReducer';
import {
  awsDetailsDefaultFilters,
  awsDetailsStateKey,
  awsDetailsTabFilters,
  getQueryForWidget,
} from './awsDetailsCommon';

export const selectAwsDetailsState = (state: RootState) =>
  state[awsDetailsStateKey];

export const selectWidgets = (state: RootState) =>
  selectAwsDetailsState(state).widgets;

export const selectWidget = (state: RootState, id: number) =>
  selectWidgets(state)[id];

export const selectCurrentWidgets = (state: RootState) =>
  selectAwsDetailsState(state).currentWidgets;

export const selectWidgetQueries = (state: RootState, id: number) => {
  const widget = selectWidget(state, id);

  const filter = {
    ...awsDetailsDefaultFilters,
    ...(widget.filter ? widget.filter : {}),
  };
  const tabsFilter = {
    ...awsDetailsTabFilters,
    ...(widget.tabsFilter ? widget.tabsFilter : {}),
  };

  return {
    previous: getQueryForWidget(widget, {
      ...filter,
      time_scope_value: -2,
    }),
    current: getQueryForWidget(widget, filter),
    tabs: getQueryForWidget(widget, {
      ...tabsFilter,
      resolution: 'monthly',
    }),
  };
};
