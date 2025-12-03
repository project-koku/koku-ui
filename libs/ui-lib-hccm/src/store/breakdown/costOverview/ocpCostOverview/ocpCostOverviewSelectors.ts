import type { RootState } from '../../../rootReducer';
import { ocpCostOverviewStateKey } from './ocpCostOverviewCommon';

export const selectOcpCostOverviewState = (state: RootState) => state[ocpCostOverviewStateKey];

export const selectWidgets = (state: RootState) => selectOcpCostOverviewState(state).widgets;

export const selectWidget = (state: RootState, id: number) => selectWidgets(state)[id];

export const selectCurrentWidgets = (state: RootState) => selectOcpCostOverviewState(state).currentWidgets;
