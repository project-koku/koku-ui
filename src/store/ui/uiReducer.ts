import { ActionType, getType } from 'typesafe-actions';

import {
  closeExportDrawer,
  closeProvidersModal,
  openExportDrawer,
  openProvidersModal,
  resetState,
  toggleSidebar,
} from './uiActions';

export type UIAction = ActionType<
  | typeof closeExportDrawer
  | typeof closeProvidersModal
  | typeof openExportDrawer
  | typeof openProvidersModal
  | typeof toggleSidebar
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
    case getType(closeProvidersModal):
      return {
        ...state,
        isProvidersModalOpen: false,
      };
    case getType(openExportDrawer):
      return {
        ...state,
        isExportDrawerOpen: true,
      };
    case getType(openProvidersModal):
      return {
        ...state,
        isProvidersModalOpen: true,
      };
    case getType(toggleSidebar):
      return {
        ...state,
        isSidebarOpen: !state.isSidebarOpen,
      };
    default:
      return state;
  }
}
