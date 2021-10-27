import { ReportType } from 'api/reports/report';
import { RootState } from 'store/rootReducer';
import { getCostType } from 'utils/localStorage';

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

  const isCostType =
    widget.reportType === ReportType.cost ||
    widget.reportType === ReportType.database ||
    widget.reportType === ReportType.network;

  // Todo: Show new features in beta environment only
  const cost_type = insights.chrome.isBeta() && isCostType ? { cost_type: getCostType() } : undefined;

  const filter = {
    ...awsDashboardDefaultFilters,
    ...(widget.filter ? widget.filter : {}),
  };
  const tabsFilter = {
    ...awsDashboardTabFilters,
    ...(widget.tabsFilter ? widget.tabsFilter : {}),
  };

  return {
    previous: getQueryForWidget(
      {
        ...filter,
        time_scope_value: -2,
      },
      cost_type
    ),
    current: getQueryForWidget(filter, cost_type),
    forecast: getQueryForWidget({}, { limit: 31 }),
    tabs: getQueryForWidgetTabs(
      widget,
      {
        ...tabsFilter,
        resolution: 'monthly',
      },
      cost_type
    ),
  };
};
