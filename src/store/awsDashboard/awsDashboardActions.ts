import { createStandardAction } from 'typesafe-actions';
import { awsReportsActions } from '../awsReports';
import { ThunkAction } from '../common';
import { AwsDashboardTab } from './awsDashboardCommon';
import { selectWidget, selectWidgetQueries } from './awsDashboardSelectors';

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

export const setWidgetTab = createStandardAction('awsDashboard/widget/tab')<{
  id: number;
  tab: AwsDashboardTab;
}>();

export const changeWidgetTab = (
  id: number,
  tab: AwsDashboardTab
): ThunkAction => {
  return dispatch => {
    dispatch(setWidgetTab({ id, tab }));
    dispatch(fetchWidgetReports(id));
  };
};
