import { ActionType, getType } from 'typesafe-actions';
import {
  closeExportModal,
  closeProvidersModal,
  openExportModal,
  openProvidersModal,
  toggleSidebar,
} from './uiActions';

export type UIAction = ActionType<
  | typeof closeExportModal
  | typeof closeProvidersModal
  | typeof openExportModal
  | typeof openProvidersModal
  | typeof toggleSidebar
>;

export type UIState = Readonly<{
  isExportModalOpen: boolean;
  isProvidersModalOpen: boolean;
  isSidebarOpen: boolean;
}>;

export const defaultState: UIState = {
  isExportModalOpen: false,
  isProvidersModalOpen: false,
  isSidebarOpen: false,
};

export const stateKey = 'ui';

export function uiReducer(state = defaultState, action: UIAction): UIState {
  switch (action.type) {
    case getType(closeExportModal):
      return {
        ...state,
        isExportModalOpen: false,
      };
    case getType(closeProvidersModal):
      return {
        ...state,
        isProvidersModalOpen: false,
      };
    case getType(openExportModal):
      return {
        ...state,
        isExportModalOpen: true,
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
