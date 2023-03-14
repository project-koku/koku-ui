import type { RootState } from 'store/rootReducer';

import { stateKey } from './uiReducer';

export const selectUIState = (state: RootState) => state[stateKey];

export const selectIsExportsDrawerOpen = (state: RootState) => selectUIState(state).isExportsDrawerOpen;
export const selectIsRecommendationsDrawerOpen = (state: RootState) => selectUIState(state).isRecommendationsDrawerOpen;
export const selectRecommendationsDrawerPayload = (state: RootState) => selectUIState(state).payload;
