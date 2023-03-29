import { createAction } from 'typesafe-actions';

export const closeExportsDrawer = createAction('ui/close_exports_drawer')();
export const closeRecommendationsDrawer = createAction('ui/close_recommendations_drawer')();
export const openExportsDrawer = createAction('ui/open_exports_drawer')();
export const openRecommendationsDrawer = createAction('ui/open_recommendations_drawer', (payload: any) => ({
  ...payload,
}))();
export const resetState = createAction('ui/reset_state')();
