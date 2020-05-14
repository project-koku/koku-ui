import { RootState } from 'store/rootReducer';
import { ocpDetailsStateKey } from './ocpDetailsCommon';

export const selectOcpDetailsState = (state: RootState) =>
  state[ocpDetailsStateKey];

export const selectWidgets = (state: RootState) =>
  selectOcpDetailsState(state).widgets;

export const selectWidget = (state: RootState, id: number) =>
  selectWidgets(state)[id];

export const selectCurrentWidgets = (state: RootState) =>
  selectOcpDetailsState(state).currentWidgets;
