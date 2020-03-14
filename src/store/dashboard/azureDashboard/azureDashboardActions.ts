import { ThunkAction } from 'store/common';
import { azureReportsActions } from 'store/reports/azureReports';
import { createStandardAction } from 'typesafe-actions';
import { AzureDashboardTab } from './azureDashboardCommon';
import { selectWidget, selectWidgetQueries } from './azureDashboardSelectors';

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

export const setWidgetTab = createStandardAction('azureDashboard/widget/tab')<{
  id: number;
  tab: AzureDashboardTab;
}>();

export const changeWidgetTab = (
  id: number,
  tab: AzureDashboardTab
): ThunkAction => {
  return dispatch => {
    dispatch(setWidgetTab({ id, tab }));
    dispatch(fetchWidgetReports(id));
  };
};
