import type { ActionType } from 'typesafe-actions';
import { getType } from 'typesafe-actions';

import {
  closeExportsDrawer,
  closeRecommendationsDrawer,
  openExportsDrawer,
  openRecommendationsDrawer,
  resetState,
} from './uiActions';

export type UIAction = ActionType<
  | typeof closeExportsDrawer
  | typeof closeRecommendationsDrawer
  | typeof openExportsDrawer
  | typeof openRecommendationsDrawer
  | typeof resetState
>;

export type UIState = Readonly<{
  isExportsDrawerOpen: boolean;
  isRecommendationsDrawerOpen: boolean;
  payload: any;
}>;

export const defaultState: UIState = {
  isExportsDrawerOpen: false,
  isRecommendationsDrawerOpen: false,
  payload: undefined,
};

export const stateKey = 'ui';

export function uiReducer(state = defaultState, action: UIAction): UIState {
  switch (action.type) {
    case getType(resetState):
      state = defaultState;
      return state;

    case getType(closeExportsDrawer):
      return {
        ...state,
        isExportsDrawerOpen: false,
      };

    case getType(closeRecommendationsDrawer):
      return {
        ...state,
        isRecommendationsDrawerOpen: false,
      };

    case getType(openExportsDrawer):
      return {
        ...state,
        isExportsDrawerOpen: true,
      };

    case getType(openRecommendationsDrawer):
      return {
        ...state,
        isRecommendationsDrawerOpen: true,
        payload: {
          ...(action as any).payload,
        },
      };

    default:
      return state;
  }
}
