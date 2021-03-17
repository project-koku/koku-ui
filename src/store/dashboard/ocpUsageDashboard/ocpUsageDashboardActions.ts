import { ThunkAction } from 'store/common';
import { reportActions } from 'store/reports';
import { createAction } from 'typesafe-actions';

import { OcpUsageDashboardTab } from './ocpUsageDashboardCommon';
import { selectWidget, selectWidgetQueries } from './ocpUsageDashboardSelectors';

export const fetchWidgetReports = (id: number): ThunkAction => {
  return (dispatch, getState) => {
    const state = getState();
    const widget = selectWidget(state, id);
    const { previous, current, tabs } = selectWidgetQueries(state, id);
    dispatch(reportActions.fetchReport(widget.reportPathsType, widget.reportType, current));
    dispatch(reportActions.fetchReport(widget.reportPathsType, widget.reportType, previous));
    if (widget.availableTabs) {
      dispatch(reportActions.fetchReport(widget.reportPathsType, widget.reportType, tabs));
    }
  };
};

export const setWidgetTab = createAction('ocpUsageDashboard/widget/tab')<{
  id: number;
  tab: OcpUsageDashboardTab;
}>();

export const changeWidgetTab = (id: number, tab: OcpUsageDashboardTab): ThunkAction => {
  return dispatch => {
    dispatch(setWidgetTab({ id, tab }));
    dispatch(fetchWidgetReports(id));
  };
};
