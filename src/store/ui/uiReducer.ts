import { ActionType, getType } from 'typesafe-actions';

import { closeExportDrawer, openExportDrawer, resetState } from './uiActions';

export type UIAction = ActionType<
  | typeof closeExportDrawer
  | typeof openExportDrawer
  | typeof resetState
>;

export type UIState = Readonly<{
  isExportDrawerOpen: boolean;
  isProvidersModalOpen: boolean;
  isSidebarOpen: boolean;
}>;

export const defaultState: UIState = {
  isExportDrawerOpen: false,
  isProvidersModalOpen: false,
  isSidebarOpen: false,
};

export const stateKey = 'ui';

export function uiReducer(state = defaultState, action: UIAction): UIState {
  switch (action.type) {
    case getType(resetState):
      state = defaultState;
      return state;

    case getType(closeExportDrawer):
      return {
        ...state,
        isExportDrawerOpen: false,
      };

    case getType(openExportDrawer):
      return {
        ...state,
        isExportDrawerOpen: true,
      };

    default:
      return state;
  }
}
