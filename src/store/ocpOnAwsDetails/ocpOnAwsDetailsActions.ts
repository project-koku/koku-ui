import { ThunkAction } from 'store/common';
import { ocpOnAwsReportsActions } from 'store/ocpOnAwsReports';
import { createStandardAction } from 'typesafe-actions';
import { OcpOnAwsDetailsTab } from './ocpOnAwsDetailsCommon';
import { selectWidget, selectWidgetQueries } from './ocpOnAwsDetailsSelectors';

export const fetchWidgetReports = (id: number): ThunkAction => {
  return (dispatch, getState) => {
    const state = getState();
    const widget = selectWidget(state, id);
    const { previous, current, tabs } = selectWidgetQueries(state, id);
    dispatch(ocpOnAwsReportsActions.fetchReport(widget.reportType, current));
    dispatch(ocpOnAwsReportsActions.fetchReport(widget.reportType, previous));
    dispatch(ocpOnAwsReportsActions.fetchReport(widget.reportType, tabs));
  };
};

export const setWidgetTab = createStandardAction('ocpOnAwsDetails/widget/tab')<{
  id: number;
  tab: OcpOnAwsDetailsTab;
}>();

export const changeWidgetTab = (
  id: number,
  tab: OcpOnAwsDetailsTab
): ThunkAction => {
  return dispatch => {
    dispatch(setWidgetTab({ id, tab }));
    dispatch(fetchWidgetReports(id));
  };
};
