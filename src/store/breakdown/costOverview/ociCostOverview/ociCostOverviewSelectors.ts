import { RootState } from 'store/rootReducer';

import { ociCostOverviewStateKey } from './ociCostOverviewCommon';

export const selectOciCostOverviewState = (state: RootState) => state[ociCostOverviewStateKey];

export const selectWidgets = (state: RootState) => selectOciCostOverviewState(state).widgets;

export const selectWidget = (state: RootState, id: number) => selectWidgets(state)[id];

export const selectCurrentWidgets = (state: RootState) => selectOciCostOverviewState(state).currentWidgets;
