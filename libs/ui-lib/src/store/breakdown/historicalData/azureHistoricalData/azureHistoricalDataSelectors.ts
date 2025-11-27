import type { RootState } from '../../../rootReducer';
import { azureHistoricalDataStateKey } from './azureHistoricalDataCommon';

export const selectAzureHistoricalDataState = (state: RootState) => state[azureHistoricalDataStateKey];

export const selectWidgets = (state: RootState) => selectAzureHistoricalDataState(state).widgets;

export const selectWidget = (state: RootState, id: number) => selectWidgets(state)[id];

export const selectCurrentWidgets = (state: RootState) => selectAzureHistoricalDataState(state).currentWidgets;
