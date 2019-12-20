import { ThunkAction } from 'store/common';
import { ocpOnCloudReportsActions } from 'store/ocpOnCloudReports';
import { createStandardAction } from 'typesafe-actions';
import { OcpOnCloudDashboardTab } from './ocpOnCloudDashboardCommon';
import {
  selectWidget,
  selectWidgetQueries,
} from './ocpOnCloudDashboardSelectors';

export const fetchWidgetReports = (id: number): ThunkAction => {
  return (dispatch, getState) => {
    const state = getState();
    const widget = selectWidget(state, id);
    const { previous, current, tabs } = selectWidgetQueries(state, id);
    dispatch(ocpOnCloudReportsActions.fetchReport(widget.reportType, current));
    dispatch(ocpOnCloudReportsActions.fetchReport(widget.reportType, previous));
    if (widget.availableTabs) {
      dispatch(ocpOnCloudReportsActions.fetchReport(widget.reportType, tabs));
    }
  };
};

export const setWidgetTab = createStandardAction(
  'ocpOnCloudDashboard/widget/tab'
)<{
  id: number;
  tab: OcpOnCloudDashboardTab;
}>();

export const changeWidgetTab = (
  id: number,
  tab: OcpOnCloudDashboardTab
): ThunkAction => {
  return dispatch => {
    dispatch(setWidgetTab({ id, tab }));
    dispatch(fetchWidgetReports(id));
  };
};
