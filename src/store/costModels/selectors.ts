import { parseApiError } from 'pages/createCostModelWizard/parseError';
import { FetchStatus } from 'store/common';
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
      case 'markup':
        const { deleteMarkup, updateMarkup } = dialogs;
        return { deleteMarkup, updateMarkup };
      case 'costmodel':
        const { deleteCostModel, updateCostModel } = dialogs;
        return { deleteCostModel, updateCostModel };
      case 'sources':
        const { deleteSource, addSource } = dialogs;
        return { deleteSource, addSource };
      case 'rate':
        const { addRate, updateRate, deleteRate } = dialogs;
        return { addRate, updateRate, deleteRate };
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

export const query = (state: RootState) => {
  const payload = costModelsState(state).costModels;
  if (payload === null) {
    return {
      ordering: null,
      name: null,
      source_type: null,
      description: null,
      offset: null,
      limit: null,
    };
  }
  const urlParams = new URLSearchParams(payload.links.first.split('?')[1]);
  return {
    ordering: urlParams.get('ordering'),
    name: urlParams.get('name'),
    source_type: urlParams.get('source_type'),
    description: urlParams.get('description'),
    offset: urlParams.get('offset'),
    limit: urlParams.get('limit'),
  };
};

export const pagination = (state: RootState) => {
  const payload = costModelsState(state).costModels;
  if (payload === null) {
    return {
      page: 1,
      perPage: 1,
      count: 0,
    };
  }

  let urlParams = null;
  if (payload.links.next !== null) {
    urlParams = new URLSearchParams(payload.links.next.split('?')[1]);
    const limit = Number(urlParams.get('limit'));
    const offset = Number(urlParams.get('offset')) - limit;
    return {
      page: offset / limit + 1,
      perPage: limit,
      count: payload.meta.count,
    };
  }

  if (payload.links.previous !== null) {
    urlParams = new URLSearchParams(payload.links.previous.split('?')[1]);
    const limit = Number(urlParams.get('limit'));
    const offset = Number(urlParams.get('offset')) + limit;
    return {
      page: offset / limit + 1,
      perPage: limit,
      count: payload.meta.count,
    };
  }

  urlParams = new URLSearchParams(payload.links.first.split('?')[1]);
  return {
    page: 1,
    perPage: Number(urlParams.get('limit')),
    count: payload.meta.count,
  };
};

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
