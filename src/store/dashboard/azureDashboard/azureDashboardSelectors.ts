import { featureFlagsSelectors } from 'store/featureFlags';
import type { RootState } from 'store/rootReducer';
import { getCurrency } from 'utils/localStorage';

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
    ...(featureFlagsSelectors.selectIsCurrencyFeatureEnabled(state) && { currency: getCurrency() }),
  };

  return {
    previous: getQueryForWidget(
      {
        ...filter,
        time_scope_value: -2,
      },
      props
    ),
    current: getQueryForWidget(filter, props),
    forecast: getQueryForWidget({}, { limit: 31, ...props }),
    tabs: getQueryForWidgetTabs(
      widget,
      {
        ...tabsFilter,
        resolution: 'monthly',
      },
      props
    ),
  };
};
