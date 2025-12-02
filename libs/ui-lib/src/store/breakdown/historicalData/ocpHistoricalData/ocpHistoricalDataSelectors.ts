import type { RootState } from '../../../rootReducer';
import { ocpHistoricalDataStateKey } from './ocpHistoricalDataCommon';

export const selectOcpHistoricalDataState = (state: RootState) => state[ocpHistoricalDataStateKey];

export const selectWidgets = (state: RootState) => selectOcpHistoricalDataState(state).widgets;

export const selectWidget = (state: RootState, id: number) => selectWidgets(state)[id];

export const selectCurrentWidgets = (state: RootState) => selectOcpHistoricalDataState(state).currentWidgets;
