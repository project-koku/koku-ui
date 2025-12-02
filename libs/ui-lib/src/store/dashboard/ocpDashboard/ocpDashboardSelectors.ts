import { getCurrency } from '../../../utils/sessionStorage';
import type { RootState } from '../../rootReducer';
import {
  getQueryForWidget,
  getQueryForWidgetTabs,
  ocpDashboardDefaultFilters,
  ocpDashboardStateKey,
  OcpDashboardTab,
  ocpDashboardTabFilters,
} from './ocpDashboardCommon';

export const selectOcpDashboardState = (state: RootState) => state[ocpDashboardStateKey];

export const selectWidgets = (state: RootState) => selectOcpDashboardState(state).widgets;

export const selectWidget = (state: RootState, id: number) => selectWidgets(state)[id];

export const selectCurrentWidgets = (state: RootState) => selectOcpDashboardState(state).currentWidgets;

export const selectWidgetQueries = (state: RootState, id: number) => {
  const widget = selectWidget(state, id);

  const defaultFilter = {
    ...ocpDashboardDefaultFilters,
    ...(widget.filter ? widget.filter : {}),
  };
  const tabsFilter = {
    ...ocpDashboardTabFilters,
    ...(widget.tabsFilter ? widget.tabsFilter : {}),
  };
  const props = {
    currency: getCurrency(),
  };
  const tabsProps = {
    ...props,
    ...(widget.trend &&
      widget.trend.costDistribution &&
      widget.currentTab === OcpDashboardTab.projects && {
        order_by: {
          distributed_cost: 'desc',
        },
      }),
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
    optimizations: getQueryForWidget({}),
    tabs: getQueryForWidgetTabs(
      widget,
      {
        ...(tabsFilter as any),
        resolution: 'monthly',
      },
      tabsProps
    ),
  };
};
