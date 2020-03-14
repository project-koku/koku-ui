import { ThunkAction } from 'store/common';
import { ocpCloudReportsActions } from 'store/reports/ocpCloudReports';
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
    dispatch(ocpCloudReportsActions.fetchReport(widget.reportType, current));
    dispatch(ocpCloudReportsActions.fetchReport(widget.reportType, previous));
    dispatch(ocpCloudReportsActions.fetchReport(widget.reportType, tabs));
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
