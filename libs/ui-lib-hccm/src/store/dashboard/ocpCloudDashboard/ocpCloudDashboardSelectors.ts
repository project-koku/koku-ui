import { getCurrency } from '../../../utils/sessionStorage';
import type { RootState } from '../../rootReducer';
import {
  getQueryForWidget,
  getQueryForWidgetTabs,
  ocpCloudDashboardDefaultFilters,
  ocpCloudDashboardStateKey,
  ocpCloudDashboardTabFilters,
} from './ocpCloudDashboardCommon';

export const selectOcpCloudDashboardState = (state: RootState) => state[ocpCloudDashboardStateKey];

export const selectWidgets = (state: RootState) => selectOcpCloudDashboardState(state).widgets;

export const selectWidget = (state: RootState, id: number) => selectWidgets(state)[id];

export const selectCurrentWidgets = (state: RootState) => selectOcpCloudDashboardState(state).currentWidgets;

export const selectWidgetQueries = (state: RootState, id: number) => {
  const widget = selectWidget(state, id);

  const defaultFilter = {
    ...ocpCloudDashboardDefaultFilters,
    ...(widget.filter ? widget.filter : {}),
  };
  const tabsFilter = {
    ...ocpCloudDashboardTabFilters,
    ...(widget.tabsFilter ? widget.tabsFilter : {}),
  };
  const props = {
    currency: getCurrency(),
  };

  return {
    previous: getQueryForWidget(
      {
        ...defaultFilter,
        time_scope_value: -2,
      } as any,
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
