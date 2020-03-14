import { ThunkAction } from 'store/common';
import { ocpReportsActions } from 'store/reports/ocpReports';
import { createStandardAction } from 'typesafe-actions';
import { OcpSupplementaryDashboardTab } from './ocpSupplementaryDashboardCommon';
import {
  selectWidget,
  selectWidgetQueries,
} from './ocpSupplementaryDashboardSelectors';

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

export const setWidgetTab = createStandardAction(
  'ocpSupplementaryDashboard/widget/tab'
)<{
  id: number;
  tab: OcpSupplementaryDashboardTab;
}>();

export const changeWidgetTab = (
  id: number,
  tab: OcpSupplementaryDashboardTab
): ThunkAction => {
  return dispatch => {
    dispatch(setWidgetTab({ id, tab }));
    dispatch(fetchWidgetReports(id));
  };
};
