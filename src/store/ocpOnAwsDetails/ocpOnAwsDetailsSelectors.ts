import { RootState } from 'store/rootReducer';
import {
  getQueryForWidget,
  ocpOnAwsDetailsDefaultFilters,
  ocpOnAwsDetailsStateKey,
  ocpOnAwsDetailsTabFilters,
} from './ocpOnAwsDetailsCommon';

export const selectOcpOnAwsDetailsState = (state: RootState) =>
  state[ocpOnAwsDetailsStateKey];

export const selectWidgets = (state: RootState) =>
  selectOcpOnAwsDetailsState(state).widgets;

export const selectWidget = (state: RootState, id: number) =>
  selectWidgets(state)[id];

export const selectCurrentWidgets = (state: RootState) =>
  selectOcpOnAwsDetailsState(state).currentWidgets;

export const selectWidgetQueries = (state: RootState, id: number) => {
  const widget = selectWidget(state, id);

  const filter = {
    ...ocpOnAwsDetailsDefaultFilters,
    ...(widget.filter ? widget.filter : {}),
  };
  const tabsFilter = {
    ...ocpOnAwsDetailsTabFilters,
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
