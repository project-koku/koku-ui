import { ThunkAction } from 'store/common';
import { reportActions } from 'store/reports';
import { createStandardAction } from 'typesafe-actions';
import { AwsDashboardTab } from './awsDashboardCommon';
import { selectWidget, selectWidgetQueries } from './awsDashboardSelectors';

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
