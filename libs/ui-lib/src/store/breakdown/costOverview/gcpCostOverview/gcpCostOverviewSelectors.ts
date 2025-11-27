import type { RootState } from '../../../rootReducer';
import { gcpCostOverviewStateKey } from './gcpCostOverviewCommon';

export const selectGcpCostOverviewState = (state: RootState) => state[gcpCostOverviewStateKey];

export const selectWidgets = (state: RootState) => selectGcpCostOverviewState(state).widgets;

export const selectWidget = (state: RootState, id: number) => selectWidgets(state)[id];

export const selectCurrentWidgets = (state: RootState) => selectGcpCostOverviewState(state).currentWidgets;
