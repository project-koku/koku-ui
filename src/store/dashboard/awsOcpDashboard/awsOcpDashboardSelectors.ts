import { featureFlagsSelectors } from 'store/featureFlags';
import type { RootState } from 'store/rootReducer';
import { getCostType } from 'utils/costType';
import { getCurrency } from 'utils/localStorage';

import {
  awsOcpDashboardDefaultFilters,
  awsOcpDashboardStateKey,
  awsOcpDashboardTabFilters,
  getQueryForWidget,
  getQueryForWidgetTabs,
} from './awsOcpDashboardCommon';

export const selectAwsOcpDashboardState = (state: RootState) => state[awsOcpDashboardStateKey];

export const selectWidgets = (state: RootState) => selectAwsOcpDashboardState(state).widgets;

export const selectWidget = (state: RootState, id: number) => selectWidgets(state)[id];

export const selectCurrentWidgets = (state: RootState) => selectAwsOcpDashboardState(state).currentWidgets;

export const selectWidgetQueries = (state: RootState, id: number) => {
  const widget = selectWidget(state, id);

  const filter = {
    ...awsOcpDashboardDefaultFilters,
    ...(widget.filter ? widget.filter : {}),
  };
  const tabsFilter = {
    ...awsOcpDashboardTabFilters,
    ...(widget.tabsFilter ? widget.tabsFilter : {}),
  };
  const props = {
    ...(featureFlagsSelectors.selectIsCurrencyFeatureEnabled(state) && { currency: getCurrency() }),
    ...(featureFlagsSelectors.selectIsCostTypeFeatureEnabled(state) &&
      widget.savingsPlan && { cost_type: getCostType() }),
  };

  return {
    previous: getQueryForWidget(
      widget,
      {
        ...filter,
        time_scope_value: -2,
      },
      props
    ),
    current: getQueryForWidget(widget, filter, props),
    forecast: getQueryForWidget(widget, {}, { limit: 31, ...props }),
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
