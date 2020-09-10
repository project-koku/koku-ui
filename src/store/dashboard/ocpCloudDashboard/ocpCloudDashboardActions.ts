import { ThunkAction } from 'store/common';
import { reportActions } from 'store/reports';
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
    dispatch(
      reportActions.fetchReport(
        widget.reportPathsType,
        widget.reportType,
        current
      )
    );
    dispatch(
      reportActions.fetchReport(
        widget.reportPathsType,
        widget.reportType,
        previous
      )
    );
    if (widget.availableTabs) {
      dispatch(
        reportActions.fetchReport(
          widget.reportPathsType,
          widget.reportType,
          tabs
        )
      );
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
