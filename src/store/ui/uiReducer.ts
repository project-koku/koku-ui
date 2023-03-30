import type { ActionType } from 'typesafe-actions';
import { getType } from 'typesafe-actions';

import {
  closeExportsDrawer,
  closeOptimizationsDrawer,
  openExportsDrawer,
  openOptimizationsDrawer,
  resetState,
} from './uiActions';

export type UIAction = ActionType<
  | typeof closeExportsDrawer
  | typeof closeOptimizationsDrawer
  | typeof openExportsDrawer
  | typeof openOptimizationsDrawer
  | typeof resetState
>;

export type UIState = Readonly<{
  isExportsDrawerOpen: boolean;
  isOptimizationsDrawerOpen: boolean;
  payload: any;
}>;

export const defaultState: UIState = {
  isExportsDrawerOpen: false,
  isOptimizationsDrawerOpen: false,
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

    case getType(closeOptimizationsDrawer):
      return {
        ...state,
        isOptimizationsDrawerOpen: false,
      };

    case getType(openExportsDrawer):
      return {
        ...state,
        isExportsDrawerOpen: true,
      };

    case getType(openOptimizationsDrawer):
      return {
        ...state,
        isOptimizationsDrawerOpen: true,
        payload: {
          ...(action as any).payload,
        },
      };

    default:
      return state;
  }
}
