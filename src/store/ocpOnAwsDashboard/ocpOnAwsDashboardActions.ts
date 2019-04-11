import { ThunkAction } from 'store/common';
import { ocpOnAwsReportsActions } from 'store/ocpOnAwsReports';
import { createStandardAction } from 'typesafe-actions';
import { OcpOnAwsDashboardTab } from './ocpOnAwsDashboardCommon';
import {
  selectWidget,
  selectWidgetQueries,
} from './ocpOnAwsDashboardSelectors';

export const fetchWidgetReports = (id: number): ThunkAction => {
  return (dispatch, getState) => {
    const state = getState();
    const widget = selectWidget(state, id);
    const { previous, current, tabs } = selectWidgetQueries(state, id);
    dispatch(ocpOnAwsReportsActions.fetchReport(widget.reportType, current));
    dispatch(ocpOnAwsReportsActions.fetchReport(widget.reportType, previous));
    if (widget.availableTabs) {
      dispatch(ocpOnAwsReportsActions.fetchReport(widget.reportType, tabs));
    }
  };
};

export const setWidgetTab = createStandardAction(
  'ocpOnAwsDashboard/widget/tab'
)<{
  id: number;
  tab: OcpOnAwsDashboardTab;
}>();

export const changeWidgetTab = (
  id: number,
  tab: OcpOnAwsDashboardTab
): ThunkAction => {
  return dispatch => {
    dispatch(setWidgetTab({ id, tab }));
    dispatch(fetchWidgetReports(id));
  };
};
