import type { RootState } from 'store/rootReducer';

import { rhelCostOverviewStateKey } from './rhelCostOverviewCommon';

export const selectRhelCostOverviewState = (state: RootState) => state[rhelCostOverviewStateKey];

export const selectWidgets = (state: RootState) => selectRhelCostOverviewState(state).widgets;

export const selectWidget = (state: RootState, id: number) => selectWidgets(state)[id];

export const selectCurrentWidgets = (state: RootState) => selectRhelCostOverviewState(state).currentWidgets;
