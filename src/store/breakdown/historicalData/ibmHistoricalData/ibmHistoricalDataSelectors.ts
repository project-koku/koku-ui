import type { RootState } from 'store/rootReducer';

import { ibmHistoricalDataStateKey } from './ibmHistoricalDataCommon';

export const selectIbmHistoricalDataState = (state: RootState) => state[ibmHistoricalDataStateKey];

export const selectWidgets = (state: RootState) => selectIbmHistoricalDataState(state).widgets;

export const selectWidget = (state: RootState, id: number) => selectWidgets(state)[id];

export const selectCurrentWidgets = (state: RootState) => selectIbmHistoricalDataState(state).currentWidgets;
