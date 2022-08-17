import { createAction } from 'typesafe-actions';

export const closeExportsDrawer = createAction('ui/close_exports_drawer')();
export const openExportsDrawer = createAction('ui/open_exports_drawer')();
export const resetState = createAction('ui/reset_state')();
