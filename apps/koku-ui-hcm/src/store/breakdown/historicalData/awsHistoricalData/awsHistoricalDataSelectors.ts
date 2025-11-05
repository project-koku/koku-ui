import type { RootState } from 'store/rootReducer';

import { awsHistoricalDataStateKey } from './awsHistoricalDataCommon';

export const selectAwsHistoricalDataState = (state: RootState) => state[awsHistoricalDataStateKey];

export const selectWidgets = (state: RootState) => selectAwsHistoricalDataState(state).widgets;

export const selectWidget = (state: RootState, id: number) => selectWidgets(state)[id];

export const selectCurrentWidgets = (state: RootState) => selectAwsHistoricalDataState(state).currentWidgets;
