import { createAction } from 'typesafe-actions';

export const closeExportsDrawer = createAction('ui/close_exports_drawer')();
export const closeOptimizationsDrawer = createAction('ui/close_optimizations_drawer')();
export const openExportsDrawer = createAction('ui/open_exports_drawer')();
export const openOptimizationsDrawer = createAction('ui/open_optimizations_drawer', (payload: any) => ({
  ...payload,
}))();
export const resetState = createAction('ui/reset_state')();
