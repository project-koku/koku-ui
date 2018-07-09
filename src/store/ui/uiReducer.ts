import { ActionType, getType } from 'typesafe-actions';
import { toggleSidebar } from './uiActions';

export type UIAction = ActionType<typeof toggleSidebar>;

export type UIState = Readonly<{
  isSidebarOpen: boolean;
}>;

export const defaultState: UIState = {
  isSidebarOpen: false,
};

export const stateKey = 'ui';

export function uiReducer(state = defaultState, action: UIAction): UIState {
  switch (action.type) {
    case getType(toggleSidebar):
      return {
        ...state,
        isSidebarOpen: !state.isSidebarOpen,
      };
    default:
      return state;
  }
}
