import { ThunkAction } from 'store/common';
import { ocpCloudReportsActions } from 'store/ocpCloudReports';
import { createStandardAction } from 'typesafe-actions';
import { OcpCloudDashboardTab } from './ocpCloudDashboardCommon';
import {
  selectWidget,
  selectWidgetQueries,
} from './ocpCloudDashboardSelectors';

export const fetchWidgetReports = (id: number): ThunkAction => {
  return (dispatch, getState) => {
    const state = getState();
    const widget = selectWidget(state, id);
    const { previous, current, tabs } = selectWidgetQueries(state, id);
    dispatch(ocpCloudReportsActions.fetchReport(widget.reportType, current));
    dispatch(ocpCloudReportsActions.fetchReport(widget.reportType, previous));
    if (widget.availableTabs) {
      dispatch(ocpCloudReportsActions.fetchReport(widget.reportType, tabs));
    }
  };
};

export const setWidgetTab = createStandardAction(
  'ocpCloudDashboard/widget/tab'
)<{
  id: number;
  tab: OcpCloudDashboardTab;
}>();

export const changeWidgetTab = (
  id: number,
  tab: OcpCloudDashboardTab
): ThunkAction => {
  return dispatch => {
    dispatch(setWidgetTab({ id, tab }));
    dispatch(fetchWidgetReports(id));
  };
};
