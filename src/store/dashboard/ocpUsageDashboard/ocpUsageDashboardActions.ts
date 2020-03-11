import { ThunkAction } from 'store/common';
import { ocpReportsActions } from 'store/reports/ocpReports';
import { createStandardAction } from 'typesafe-actions';
import { OcpUsageDashboardTab } from './ocpUsageDashboardCommon';
import {
  selectWidget,
  selectWidgetQueries,
} from './ocpUsageDashboardSelectors';

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
  'ocpUsageDashboard/widget/tab'
)<{
  id: number;
  tab: OcpUsageDashboardTab;
}>();

export const changeWidgetTab = (
  id: number,
  tab: OcpUsageDashboardTab
): ThunkAction => {
  return dispatch => {
    dispatch(setWidgetTab({ id, tab }));
    dispatch(fetchWidgetReports(id));
  };
};
