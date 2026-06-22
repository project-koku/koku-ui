import type { AxiosError } from 'axios';
import { parseApiError } from 'routes/settings/utils';
import { FetchStatus } from 'store/common';
import { selectPagination } from 'store/djangoUtils/pagination';
import { selectQuery } from 'store/djangoUtils/query';
import type { RootState } from 'store/rootReducer';

import { stateKey } from './costModelReducer';

export const costModelsState = (state: RootState) => state[stateKey];
export const costModels = (state: RootState) => costModelsState(state).costModels;
export const costModelsData = (state: RootState) => {
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

export const getError = (error: AxiosError) => {
  if (error === null) {
    return '';
  }
  return parseApiError(error);
};

export const stateName = (state: RootState) => {
  const costStatus = selectCostModelsFetchStatus(state);
  const costError = selectCostModelsFetchError(state);
  const costData = costModelsData(state);
  const costQuery = query(state);

  if (costStatus !== FetchStatus.complete) {
    return 'loading';
  }
  if (costError) {
    return 'failure';
  }
  if (costData.length > 0) {
    return 'success';
  }
  const hasNoFilters = (Object.keys(costQuery) as (keyof typeof costQuery)[]).every(key => {
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

export const deleteProcessing = (state: RootState) => costModelsState(state).delete.status === FetchStatus.inProgress;
export const dialogData = (state: RootState) => costModelsState(state).dialogData;
export const pagination = selectPagination((state: RootState) => costModelsState(state).costModels);
export const updateProcessing = (state: RootState) => costModelsState(state).update.status === FetchStatus.inProgress;

export const selected = (state: RootState) => {
  return costModelsState(state).update.current;
};

// Selectors for individual reducer states

export const selectCostModelsAddError = (state: RootState) => costModelsState(state).add?.error;
export const selectCostModelsAddNotification = (state: RootState) => costModelsState(state).add?.notification;
export const selectCostModelsAddStatus = (state: RootState) => costModelsState(state).add?.status;

export const selectCostModelsDeleteError = (state: RootState) => costModelsState(state).delete?.error;
export const selectCostModelsDeleteNotification = (state: RootState) => costModelsState(state).delete?.notification;
export const selectCostModelsDeleteStatus = (state: RootState) => costModelsState(state).delete?.status;

export const selectCostModelsFetchError = (state: RootState) => costModelsState(state).fetch?.error;
export const selectCostModelsFetchStatus = (state: RootState) => costModelsState(state).fetch?.status;

export const selectCostModelsRedirectError = (state: RootState) => costModelsState(state).redirect?.error;
export const selectCostModelsRedirectNotification = (state: RootState) => costModelsState(state).redirect?.notification;
export const selectCostModelsRedirectStatus = (state: RootState) => costModelsState(state).redirect?.status;

export const selectCostModelsUpdateError = (state: RootState) => costModelsState(state).update?.error;
export const selectCostModelsUpdateNotification = (state: RootState) => costModelsState(state).update?.notification;
export const selectCostModelsUpdateStatus = (state: RootState) => costModelsState(state).update?.status;
