import type { RootState } from 'store/rootReducer';

import { gcpHistoricalDataStateKey } from './gcpHistoricalDataCommon';

export const selectGcpHistoricalDataState = (state: RootState) => state[gcpHistoricalDataStateKey];

export const selectWidgets = (state: RootState) => selectGcpHistoricalDataState(state).widgets;

export const selectWidget = (state: RootState, id: number) => selectWidgets(state)[id];

export const selectCurrentWidgets = (state: RootState) => selectGcpHistoricalDataState(state).currentWidgets;
