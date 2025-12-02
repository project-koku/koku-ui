import type { RootState } from '../../../rootReducer';
import { azureCostOverviewStateKey } from './azureCostOverviewCommon';

export const selectAzureCostOverviewState = (state: RootState) => state[azureCostOverviewStateKey];

export const selectWidgets = (state: RootState) => selectAzureCostOverviewState(state).widgets;

export const selectWidget = (state: RootState, id: number) => selectWidgets(state)[id];

export const selectCurrentWidgets = (state: RootState) => selectAzureCostOverviewState(state).currentWidgets;
