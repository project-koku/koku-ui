import { RootState } from '../rootReducer';
import { stateKey } from './uiReducer';

export const selectUIState = (state: RootState) => state[stateKey];

export const selectIsProvidersModalOpen = (state: RootState) =>
  selectUIState(state).isProvidersModalOpen;

export const selectIsSidebarOpen = (state: RootState) =>
  selectUIState(state).isSidebarOpen;
