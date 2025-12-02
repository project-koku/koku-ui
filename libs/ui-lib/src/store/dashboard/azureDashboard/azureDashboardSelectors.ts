import { getCurrency } from '../../../utils/sessionStorage';
import type { RootState } from '../../rootReducer';
import {
  azureDashboardDefaultFilters,
  azureDashboardStateKey,
  azureDashboardTabFilters,
  getQueryForWidget,
  getQueryForWidgetTabs,
} from './azureDashboardCommon';

export const selectAzureDashboardState = (state: RootState) => state[azureDashboardStateKey];

export const selectWidgets = (state: RootState) => selectAzureDashboardState(state).widgets;

export const selectWidget = (state: RootState, id: number) => selectWidgets(state)[id];

export const selectCurrentWidgets = (state: RootState) => selectAzureDashboardState(state).currentWidgets;

export const selectWidgetQueries = (state: RootState, id: number) => {
  const widget = selectWidget(state, id);

  const filter = {
    ...azureDashboardDefaultFilters,
    ...(widget.filter ? widget.filter : {}),
  };
  const tabsFilter = {
    ...azureDashboardTabFilters,
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
