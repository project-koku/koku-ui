import { ActionType, getType } from 'typesafe-actions';
import { closeModal, error, openModal, processing } from './actions';

export const stateKey = 'deleteDialog';

export type DeleteDialogState = Readonly<{
  isOpen: boolean;
  isProcessing: boolean;
  isError: boolean;
  name: string;
  type: string;
  onDelete: () => void;
}>;

export const defaultState: DeleteDialogState = {
  isOpen: false,
  isProcessing: false,
  isError: false,
  name: '',
  type: '',
  onDelete: null,
};

export type DeleteDialogAction = ActionType<
  typeof openModal | typeof closeModal | typeof processing | typeof error
>;

export const reducer = (
  state: DeleteDialogState = defaultState,
  action: DeleteDialogAction
): DeleteDialogState => {
  switch (action.type) {
    case getType(openModal):
      return {
        ...state,
        ...action.payload,
        isOpen: true,
      };
    case getType(processing):
      return {
        ...state,
        isProcessing: true,
      };
    case getType(closeModal):
      return defaultState;
    case getType(error):
      return {
        ...state,
        isError: true,
      };
    default:
      return state;
  }
};
