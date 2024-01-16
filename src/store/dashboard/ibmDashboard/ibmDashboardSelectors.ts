import type { RootState } from 'store/rootReducer';
import { getCurrency } from 'utils/sessionStorage';

import {
  getQueryForWidget,
  getQueryForWidgetTabs,
  ibmDashboardDefaultFilters,
  ibmDashboardStateKey,
  ibmDashboardTabFilters,
} from './ibmDashboardCommon';

export const selectIbmDashboardState = (state: RootState) => state[ibmDashboardStateKey];

export const selectWidgets = (state: RootState) => selectIbmDashboardState(state).widgets;

export const selectWidget = (state: RootState, id: number) => selectWidgets(state)[id];

export const selectCurrentWidgets = (state: RootState) => selectIbmDashboardState(state).currentWidgets;

export const selectWidgetQueries = (state: RootState, id: number) => {
  const widget = selectWidget(state, id);

  const filter = {
    ...ibmDashboardDefaultFilters,
    ...(widget.filter ? widget.filter : {}),
  };
  const tabsFilter = {
    ...ibmDashboardTabFilters,
    ...(widget.tabsFilter ? widget.tabsFilter : {}),
  };
  const props = {
    currency: getCurrency(),
  };

  return {
    previous: getQueryForWidget(
      {
        ...(filter as any),
        time_scope_value: -2,
      },
      props
    ),
    current: getQueryForWidget(filter, props),
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
