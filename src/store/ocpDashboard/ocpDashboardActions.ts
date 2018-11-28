import { createStandardAction } from 'typesafe-actions';
import { ThunkAction } from '../common';
import { ocpReportsActions } from '../ocpReports';
import { OcpDashboardTab } from './ocpDashboardCommon';
import { selectWidget, selectWidgetQueries } from './ocpDashboardSelectors';

export const fetchWidgetReports = (id: number): ThunkAction => {
  return (dispatch, getState) => {
    const state = getState();
    const widget = selectWidget(state, id);
    const { previous, current, tabs } = selectWidgetQueries(state, id);
    dispatch(ocpReportsActions.fetchReport(widget.reportType, current));
    dispatch(ocpReportsActions.fetchReport(widget.reportType, previous));
    dispatch(ocpReportsActions.fetchReport(widget.reportType, tabs));
  };
};

export const setWidgetTab = createStandardAction('ocpDashboard/widget/tab')<{
  id: number;
  tab: OcpDashboardTab;
}>();

export const changeWidgetTab = (
  id: number,
  tab: OcpDashboardTab
): ThunkAction => {
  return dispatch => {
    dispatch(setWidgetTab({ id, tab }));
    dispatch(fetchWidgetReports(id));
  };
};
