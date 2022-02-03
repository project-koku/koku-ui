import { ThunkAction } from 'store/common';
import { createAction } from 'typesafe-actions';

export const closeExportDrawer = createAction('ui/close_export_drawer')();
export const closeProvidersModal = createAction('ui/close_providers_modal')();
export const openExportDrawer = createAction('ui/open_export_drawer')();
export const openProvidersModal = createAction('ui/open_providers_modal')();
export const toggleSidebar = createAction('ui/toggle_sidebar')();
export const resetState = createAction('ui/reset_state')();

export function resetReportState(): ThunkAction {
  return dispatch => {
    dispatch(resetState());
  };
}
