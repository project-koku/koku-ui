import { RootState } from '../rootReducer';
import { stateKey } from './uiReducer';

export const selectUIState = (state: RootState) => state[stateKey];

export const selectIsSidebarOpen = (state: RootState) =>
  selectUIState(state).isSidebarOpen;
