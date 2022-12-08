import type { RootState } from 'store/rootReducer';

import { rhelHistoricalDataStateKey } from './rhelHistoricalDataCommon';

export const selectRhelHistoricalDataState = (state: RootState) => state[rhelHistoricalDataStateKey];

export const selectWidgets = (state: RootState) => selectRhelHistoricalDataState(state).widgets;

export const selectWidget = (state: RootState, id: number) => selectWidgets(state)[id];

export const selectCurrentWidgets = (state: RootState) => selectRhelHistoricalDataState(state).currentWidgets;
