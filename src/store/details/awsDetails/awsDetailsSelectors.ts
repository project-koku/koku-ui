import { RootState } from 'store/rootReducer';
import { awsDetailsStateKey } from './awsDetailsCommon';

export const selectAwsDetailsState = (state: RootState) =>
  state[awsDetailsStateKey];

export const selectWidgets = (state: RootState) =>
  selectAwsDetailsState(state).widgets;

export const selectWidget = (state: RootState, id: number) =>
  selectWidgets(state)[id];

export const selectCurrentWidgets = (state: RootState) =>
  selectAwsDetailsState(state).currentWidgets;
