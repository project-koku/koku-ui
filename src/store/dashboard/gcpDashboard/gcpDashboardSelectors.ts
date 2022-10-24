import { featureFlagsSelectors } from 'store/featureFlags';
import type { RootState } from 'store/rootReducer';
import { getCurrency } from 'utils/currency';

import {
  gcpDashboardDefaultFilters,
  gcpDashboardStateKey,
  gcpDashboardTabFilters,
  getQueryForWidget,
  getQueryForWidgetTabs,
} from './gcpDashboardCommon';

export const selectGcpDashboardState = (state: RootState) => state[gcpDashboardStateKey];

export const selectWidgets = (state: RootState) => selectGcpDashboardState(state).widgets;

export const selectWidget = (state: RootState, id: number) => selectWidgets(state)[id];

export const selectCurrentWidgets = (state: RootState) => selectGcpDashboardState(state).currentWidgets;

export const selectWidgetQueries = (state: RootState, id: number) => {
  const widget = selectWidget(state, id);

  const filter = {
    ...gcpDashboardDefaultFilters,
    ...(widget.filter ? widget.filter : {}),
  };
  const tabsFilter = {
    ...gcpDashboardTabFilters,
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
