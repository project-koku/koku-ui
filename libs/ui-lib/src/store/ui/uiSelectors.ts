import type { RootState } from '../rootReducer';
import { stateKey } from './uiReducer';

export const selectUIState = (state: RootState) => state[stateKey];

export const selectIsExportsDrawerOpen = (state: RootState) => selectUIState(state).isExportsDrawerOpen;
export const selectIsOptimizationsDrawerOpen = (state: RootState) => selectUIState(state).isOptimizationsDrawerOpen;
export const selectOptimizationsDrawerPayload = (state: RootState) => selectUIState(state).payload;
export const selectIsProvidersModalOpen = (state: RootState) => selectUIState(state).isProvidersModalOpen;
