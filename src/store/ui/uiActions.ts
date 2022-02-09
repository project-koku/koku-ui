import { ThunkAction } from 'store/common';
import { createAction } from 'typesafe-actions';

export const closeExportDrawer = createAction('ui/close_export_drawer')();
export const openExportDrawer = createAction('ui/open_export_drawer')();
export const resetState = createAction('ui/reset_state')();

export function resetReportState(): ThunkAction {
  return dispatch => {
    dispatch(resetState());
  };
}
