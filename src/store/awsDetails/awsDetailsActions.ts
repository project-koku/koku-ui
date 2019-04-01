import { awsReportsActions } from 'store/awsReports';
import { ThunkAction } from 'store/common';
import { createStandardAction } from 'typesafe-actions';
import { AwsDetailsTab } from './awsDetailsCommon';
import { selectWidget, selectWidgetQueries } from './awsDetailsSelectors';

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

export const setWidgetTab = createStandardAction('awsDetails/widget/tab')<{
  id: number;
  tab: AwsDetailsTab;
}>();

export const changeWidgetTab = (
  id: number,
  tab: AwsDetailsTab
): ThunkAction => {
  return dispatch => {
    dispatch(setWidgetTab({ id, tab }));
    dispatch(fetchWidgetReports(id));
  };
};
