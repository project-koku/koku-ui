import { parseApiError } from '../../routes/settings/costModels/costModelWizard/parseError';
import { FetchStatus } from '../common';
import { selectPagination } from '../djangoUtils/pagination';
import { selectQuery } from '../djangoUtils/query';
import type { RootState } from '../rootReducer';
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
      case 'distribution': {
        const { deleteDistribution, updateDistribution } = dialogs;
        return { deleteDistribution, updateDistribution };
      }
      case 'costmodel': {
        const { deleteCostModel, updateCostModel, createWizard } = dialogs;
        return { deleteCostModel, updateCostModel, createWizard };
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

export const redirectError = (state: RootState) => costModelsState(state).redirect?.error;
export const redirectNotification = (state: RootState) => costModelsState(state).redirect?.notification;
export const redirectStatus = (state: RootState) => costModelsState(state).redirect?.status;

export const stateName = (state: RootState) => {
  const costStatus = status(state);
  const costError = error(state);
  const costData = costModels(state);
  const costQuery = query(state);

  if (costStatus !== FetchStatus.complete) {
    return 'loading';
  }
  if (costError !== null) {
    return 'failure';
  }
  if (costData.length > 0) {
    return 'success';
  }
  const hasNoFilters = Object.keys(costQuery).every(key => {
    switch (key) {
      case 'currency':
      case 'description':
      case 'name':
      case 'source_type':
        return costQuery[key] === null;
      default:
        return true;
    }
  });
  if (hasNoFilters) {
    return 'empty';
  }
  return 'no-match';
};

export const currentFilterValue = (state: RootState) => costModelsState(state).currentFilterValue;

export const currentFilterType = (state: RootState) => costModelsState(state).currentFilterType;

export const query = selectQuery(
  (state: RootState) => costModelsState(state).costModels,
  ['ordering', 'name', 'source_type', 'currency', 'description', 'offset', 'limit']
);

export const pagination = selectPagination((state: RootState) => costModelsState(state).costModels);

export const dialogData = (state: RootState) => costModelsState(state).dialogData;

export const updateProcessing = (state: RootState) => costModelsState(state).update.status === FetchStatus.inProgress;

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

export const deleteProcessing = (state: RootState) => costModelsState(state).delete.status === FetchStatus.inProgress;

export const deleteError = (state: RootState) => {
  const err = costModelsState(state).delete.error;
  if (err === null) {
    return '';
  }
  return parseApiError(err);
};
