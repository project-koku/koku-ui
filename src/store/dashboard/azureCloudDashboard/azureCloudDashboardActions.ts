import { azureReportsActions } from 'store/azureReports';
import { ThunkAction } from 'store/common';
import { createStandardAction } from 'typesafe-actions';
import { AzureCloudDashboardTab } from './azureCloudDashboardCommon';
import {
  selectWidget,
  selectWidgetQueries,
} from './azureCloudDashboardSelectors';

export const fetchWidgetReports = (id: number): ThunkAction => {
  return (dispatch, getState) => {
    const state = getState();
    const widget = selectWidget(state, id);
    const { previous, current, tabs } = selectWidgetQueries(state, id);
    dispatch(azureReportsActions.fetchReport(widget.reportType, current));
    dispatch(azureReportsActions.fetchReport(widget.reportType, previous));
    dispatch(azureReportsActions.fetchReport(widget.reportType, tabs));
  };
};

export const setWidgetTab = createStandardAction(
  'azureCloudDashboard/widget/tab'
)<{
  id: number;
  tab: AzureCloudDashboardTab;
}>();

export const changeWidgetTab = (
  id: number,
  tab: AzureCloudDashboardTab
): ThunkAction => {
  return dispatch => {
    dispatch(setWidgetTab({ id, tab }));
    dispatch(fetchWidgetReports(id));
  };
};
