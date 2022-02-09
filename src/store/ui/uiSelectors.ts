import { RootState } from 'store/rootReducer';

import { stateKey } from './uiReducer';

export const selectUIState = (state: RootState) => state[stateKey];

export const selectIsExportDrawerOpen = (state: RootState) => selectUIState(state).isExportDrawerOpen;

export const selectIsProvidersModalOpen = (state: RootState) => selectUIState(state).isProvidersModalOpen;

export const selectIsSidebarOpen = (state: RootState) => selectUIState(state).isSidebarOpen;
