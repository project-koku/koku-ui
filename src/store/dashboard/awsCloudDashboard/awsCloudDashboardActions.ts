import { ThunkAction } from 'store/common';
import { awsReportsActions } from 'store/reports/awsReports';
import { createStandardAction } from 'typesafe-actions';
import { AwsCloudDashboardTab } from './awsCloudDashboardCommon';
import {
  selectWidget,
  selectWidgetQueries,
} from './awsCloudDashboardSelectors';

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

export const setWidgetTab = createStandardAction(
  'awsCloudDashboard/widget/tab'
)<{
  id: number;
  tab: AwsCloudDashboardTab;
}>();

export const changeWidgetTab = (
  id: number,
  tab: AwsCloudDashboardTab
): ThunkAction => {
  return dispatch => {
    dispatch(setWidgetTab({ id, tab }));
    dispatch(fetchWidgetReports(id));
  };
};
