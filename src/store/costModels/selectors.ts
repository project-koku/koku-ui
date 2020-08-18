import { parseApiError } from 'pages/costModels/createCostModelWizard/parseError';
import { FetchStatus } from 'store/common';
import { selectPagination } from 'store/djangoUtils/pagination';
import { selectQuery } from 'store/djangoUtils/query';
import { RootState } from 'store/rootReducer';
import { stateKey } from './reducer';

export const costModelsState = (state: RootState) => state[stateKey];

export const costModels = (state: RootState) => {
  const cms = costModelsState(state).costModels;
  if (cms) {
    return cms.data;
  }
  return [];
};

export const isDialogOpen = (state: RootState) => {
  const dialogs = costModelsState(state).isDialogOpen;
  return (type: string) => {
    switch (type) {
      case 'markup': {
        const { deleteMarkup, updateMarkup } = dialogs;
        return { deleteMarkup, updateMarkup };
      }
      case 'costmodel': {
        const { deleteCostModel, updateCostModel } = dialogs;
        return { deleteCostModel, updateCostModel };
      }
      case 'sources': {
        const { deleteSource, addSource } = dialogs;
        return { deleteSource, addSource };
      }
      case 'rate': {
        const { addRate, updateRate, deleteRate } = dialogs;
        return { addRate, updateRate, deleteRate };
      }
      default:
        return costModelsState(state).isDialogOpen;
    }
  };
};

export const status = (state: RootState) => costModelsState(state).status;

export const error = (state: RootState) => costModelsState(state).error;

export const currentFilterValue = (state: RootState) =>
  costModelsState(state).currentFilterValue;

export const currentFilterType = (state: RootState) =>
  costModelsState(state).currentFilterType;

export const query = selectQuery(
  (state: RootState) => costModelsState(state).costModels,
  ['ordering', 'name', 'source_type', 'description', 'offset', 'limit']
);

export const pagination = selectPagination(
  (state: RootState) => costModelsState(state).costModels
);

export const updateProcessing = (state: RootState) =>
  costModelsState(state).update.status === FetchStatus.inProgress;

export const updateError = (state: RootState) => {
  const updateErr = costModelsState(state).update.error;
  if (updateErr === null) {
    return '';
  }
  return parseApiError(updateErr);
};

export const selected = (state: RootState) => {
  return costModelsState(state).update.current;
};

export const deleteProcessing = (state: RootState) =>
  costModelsState(state).delete.status === FetchStatus.inProgress;

export const deleteError = (state: RootState) => {
  const err = costModelsState(state).delete.error;
  if (err === null) {
    return '';
  }
  return parseApiError(err);
};
