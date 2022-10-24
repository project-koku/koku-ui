import type { ActionType } from 'typesafe-actions';
import { getType } from 'typesafe-actions';

import { closeExportsDrawer, openExportsDrawer, resetState } from './uiActions';

export type UIAction = ActionType<typeof closeExportsDrawer | typeof openExportsDrawer | typeof resetState>;

export type UIState = Readonly<{
  isExportsDrawerOpen: boolean;
}>;

export const defaultState: UIState = {
  isExportsDrawerOpen: false,
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

    case getType(openExportsDrawer):
      return {
        ...state,
        isExportsDrawerOpen: true,
      };

    default:
      return state;
  }
}
