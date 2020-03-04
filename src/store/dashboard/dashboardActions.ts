import { awsReportsActions } from 'store/awsReports';
import { ThunkAction } from 'store/common';
import { createStandardAction } from 'typesafe-actions';
import { DashboardTab } from './dashboardCommon';
import { selectWidget, selectWidgetQueries } from './dashboardSelectors';

export const fetchWidgetReports = (id: number): ThunkAction => {
  return (dispatch, getState) => {
    const state = getState();
    const widget = selectWidget(state, id);
    const { previous, current, tabs } = selectWidgetQueries(state, id);
    dispatch(awsReportsActions.fetchReport(widget.reportType, current));
    dispatch(awsReportsActions.fetchReport(widget.reportType, previous));
    dispatch(awsReportsActions.fetchReport(widget.reportType, tabs));
  };
};

export const setWidgetTab = createStandardAction('dashboard/widget/tab')<{
  id: number;
  tab: DashboardTab;
}>();

export const changeWidgetTab = (id: number, tab: DashboardTab): ThunkAction => {
  return dispatch => {
    dispatch(setWidgetTab({ id, tab }));
    dispatch(fetchWidgetReports(id));
  };
};
