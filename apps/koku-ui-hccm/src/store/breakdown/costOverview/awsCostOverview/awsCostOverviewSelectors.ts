import type { RootState } from 'store/rootReducer';

import { awsCostOverviewStateKey } from './awsCostOverviewCommon';

export const selectAwsCostOverviewState = (state: RootState) => state[awsCostOverviewStateKey];

export const selectWidgets = (state: RootState) => selectAwsCostOverviewState(state).widgets;

export const selectWidget = (state: RootState, id: number) => selectWidgets(state)[id];

export const selectCurrentWidgets = (state: RootState) => selectAwsCostOverviewState(state).currentWidgets;
