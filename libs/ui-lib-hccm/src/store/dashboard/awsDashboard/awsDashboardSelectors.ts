import { getCostType, getCurrency } from '../../../utils/sessionStorage';
import type { RootState } from '../../rootReducer';
import {
  awsDashboardDefaultFilters,
  awsDashboardStateKey,
  awsDashboardTabFilters,
  getQueryForWidget,
  getQueryForWidgetTabs,
} from './awsDashboardCommon';

export const selectAwsDashboardState = (state: RootState) => state[awsDashboardStateKey];

export const selectWidgets = (state: RootState) => selectAwsDashboardState(state).widgets;

export const selectWidget = (state: RootState, id: number) => selectWidgets(state)[id];

export const selectCurrentWidgets = (state: RootState) => selectAwsDashboardState(state).currentWidgets;

export const selectWidgetQueries = (state: RootState, id: number) => {
  const widget = selectWidget(state, id);

  const filter = {
    ...awsDashboardDefaultFilters,
    ...(widget.filter ? widget.filter : {}),
  };
  const tabsFilter = {
    ...awsDashboardTabFilters,
    ...(widget.tabsFilter ? widget.tabsFilter : {}),
  };
  const props = {
    cost_type: getCostType(),
    currency: getCurrency(),
  };

  return {
    previous: getQueryForWidget(
      widget,
      {
        ...(filter as any),
        time_scope_value: -2,
      },
      props
    ),
    current: getQueryForWidget(widget, filter, props),
    forecast: getQueryForWidget(widget, {}, props),
    tabs: getQueryForWidgetTabs(
      widget,
      {
        ...(tabsFilter as any),
        resolution: 'monthly',
      },
      props
    ),
  };
};
