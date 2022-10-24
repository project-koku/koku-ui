import type { RootState } from 'store/rootReducer';

import { ibmCostOverviewStateKey } from './ibmCostOverviewCommon';

export const selectIbmCostOverviewState = (state: RootState) => state[ibmCostOverviewStateKey];

export const selectWidgets = (state: RootState) => selectIbmCostOverviewState(state).widgets;

export const selectWidget = (state: RootState, id: number) => selectWidgets(state)[id];

export const selectCurrentWidgets = (state: RootState) => selectIbmCostOverviewState(state).currentWidgets;
