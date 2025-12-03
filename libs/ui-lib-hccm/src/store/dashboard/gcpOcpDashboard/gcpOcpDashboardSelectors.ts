import { getCurrency } from '../../../utils/sessionStorage';
import type { RootState } from '../../rootReducer';
import {
  gcpOcpDashboardDefaultFilters,
  gcpOcpDashboardStateKey,
  gcpOcpDashboardTabFilters,
  getQueryForWidget,
  getQueryForWidgetTabs,
} from './gcpOcpDashboardCommon';

export const selectGcpOcpDashboardState = (state: RootState) => state[gcpOcpDashboardStateKey];

export const selectWidgets = (state: RootState) => selectGcpOcpDashboardState(state).widgets;

export const selectWidget = (state: RootState, id: number) => selectWidgets(state)[id];

export const selectCurrentWidgets = (state: RootState) => selectGcpOcpDashboardState(state).currentWidgets;

export const selectWidgetQueries = (state: RootState, id: number) => {
  const widget = selectWidget(state, id);

  const filter = {
    ...gcpOcpDashboardDefaultFilters,
    ...(widget.filter ? widget.filter : {}),
  };
  const tabsFilter = {
    ...gcpOcpDashboardTabFilters,
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
