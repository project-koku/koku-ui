import { RootState } from 'store/rootReducer';

import { ociHistoricalDataStateKey } from './ociHistoricalDataCommon';

export const selectOciHistoricalDataState = (state: RootState) => state[ociHistoricalDataStateKey];

export const selectWidgets = (state: RootState) => selectOciHistoricalDataState(state).widgets;

export const selectWidget = (state: RootState, id: number) => selectWidgets(state)[id];

export const selectCurrentWidgets = (state: RootState) => selectOciHistoricalDataState(state).currentWidgets;
