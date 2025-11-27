import { createAction } from 'typesafe-actions';

import type { ThunkAction } from '../../common';
import { forecastActions } from '../../forecasts';
import { reportActions } from '../../reports';
import type { AwsDashboardTab } from './awsDashboardCommon';
import { selectWidget, selectWidgetQueries } from './awsDashboardSelectors';

export const fetchWidgetForecasts = (id: number): ThunkAction => {
  return (dispatch, getState) => {
    const state = getState();
    const widget = selectWidget(state, id);

    if (widget.forecastPathsType && widget.forecastType) {
      const { forecast } = selectWidgetQueries(state, id);
      dispatch(forecastActions.fetchForecast(widget.forecastPathsType, widget.forecastType, forecast));
    }
  };
};

export const fetchWidgetReports = (id: number): ThunkAction => {
  return (dispatch, getState) => {
    const state = getState();
    const widget = selectWidget(state, id);
    const { previous, current, tabs } = selectWidgetQueries(state, id);
    dispatch(reportActions.fetchReport(widget.reportPathsType, widget.reportType, current));
    dispatch(reportActions.fetchReport(widget.reportPathsType, widget.reportType, previous));
    if (widget.availableTabs) {
      dispatch(reportActions.fetchReport(widget.reportPathsType, widget.reportType, tabs));
    }
  };
};

export const setWidgetTab = createAction('awsDashboard/widget/tab')<{
  id: number;
  tab: AwsDashboardTab;
}>();

export const changeWidgetTab = (id: number, tab: AwsDashboardTab): ThunkAction => {
  return dispatch => {
    dispatch(setWidgetTab({ id, tab }));
    dispatch(fetchWidgetReports(id));
  };
};
