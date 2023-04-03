import type { RootState } from 'store/rootReducer';
import { getCurrency } from 'utils/localStorage';

import {
  getQueryForWidget,
  getQueryForWidgetTabs,
  rhelDashboardDefaultFilters,
  rhelDashboardStateKey,
  rhelDashboardTabFilters,
} from './rhelDashboardCommon';

export const selectRhelDashboardState = (state: RootState) => state[rhelDashboardStateKey];

export const selectWidgets = (state: RootState) => selectRhelDashboardState(state).widgets;

export const selectWidget = (state: RootState, id: number) => selectWidgets(state)[id];

export const selectCurrentWidgets = (state: RootState) => selectRhelDashboardState(state).currentWidgets;

export const selectWidgetQueries = (state: RootState, id: number) => {
  const widget = selectWidget(state, id);

  const defaultFilter = {
    ...rhelDashboardDefaultFilters,
    ...(widget.filter ? widget.filter : ({} as any)),
  };
  const tabsFilter = {
    ...rhelDashboardTabFilters,
    ...(widget.tabsFilter ? widget.tabsFilter : ({} as any)),
  };
  const props = {
    currency: getCurrency(),
  };

  return {
    previous: getQueryForWidget(
      {
        ...defaultFilter,
        time_scope_value: -2,
      },
      props
    ),
    current: getQueryForWidget(defaultFilter, props),
    forecast: getQueryForWidget({}, { limit: 31, ...props }),
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
