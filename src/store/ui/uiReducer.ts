import { ActionType, getType } from 'typesafe-actions';
import {
  closeProvidersModal,
  openProvidersModal,
  toggleSidebar,
} from './uiActions';

export type UIAction = ActionType<
  typeof closeProvidersModal | typeof openProvidersModal | typeof toggleSidebar
>;

export type UIState = Readonly<{
  isProvidersModalOpen: boolean;
  isSidebarOpen: boolean;
}>;

export const defaultState: UIState = {
  isProvidersModalOpen: false,
  isSidebarOpen: false,
};

export const stateKey = 'ui';

export function uiReducer(state = defaultState, action: UIAction): UIState {
  switch (action.type) {
    case getType(closeProvidersModal):
      return {
        ...state,
        isProvidersModalOpen: false,
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
