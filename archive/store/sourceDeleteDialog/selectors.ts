import { RootState } from 'store/rootReducer';
import { stateKey } from './reducer';

export const deleteDialogState = (state: RootState) => state[stateKey];

export const isProcessing = state => deleteDialogState(state).isProcessing;

export const isOpen = state => deleteDialogState(state).isOpen;

export const isError = state => deleteDialogState(state).isError;

export const name = state => deleteDialogState(state).name;

export const type = state => deleteDialogState(state).type;

export const onDelete = state => deleteDialogState(state).onDelete;
