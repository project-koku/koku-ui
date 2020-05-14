import { RootState } from 'store/rootReducer';
import { azureDetailsStateKey } from './azureDetailsCommon';

export const selectAzureDetailsState = (state: RootState) =>
  state[azureDetailsStateKey];

export const selectWidgets = (state: RootState) =>
  selectAzureDetailsState(state).widgets;

export const selectWidget = (state: RootState, id: number) =>
  selectWidgets(state)[id];

export const selectCurrentWidgets = (state: RootState) =>
  selectAzureDetailsState(state).currentWidgets;
