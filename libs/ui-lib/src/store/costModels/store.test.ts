jest.mock('@koku-ui/api/costModels');

import { waitFor } from '@testing-library/react';
import type { CostModel, CostModelProvider, CostModels } from '@koku-ui/api/costModels';
import { deleteCostModel, fetchCostModels, updateCostModel } from '@koku-ui/api/costModels';
import type { Rate } from '@koku-ui/api/rates';
import { FetchStatus } from '../common';
import { createMockStoreCreator } from '../mockStore';

import * as actions from './actions';
import { reducer as costModelsReducer, stateKey } from './reducer';
import * as selectors from './selectors';

const costmodel1: CostModel = {
  created_timestamp: new Date(2019, 7, 1, 0, 0, 0, 0),
  currency: 'USD',
  description: 'testing',
  name: 'cost-model-1',
  rates: [] as Rate[],
  sources: [] as CostModelProvider[],
  source_type: 'OpenShift Container Platform',
  updated_timestamp: new Date(2019, 7, 1, 0, 0, 0, 0),
  uuid: '123abcd345def',
};

const updated_costmodel1: CostModel = {
  ...costmodel1,
  updated_timestamp: new Date(2019, 7, 1, 0, 0, 0, 0),
  name: 'cost-model-1-updated',
};

const costmodels: CostModels = {
  meta: {
    count: 1,
  },
  data: [costmodel1],
  links: {
    first: null,
    last: null,
    next: null,
    previous: null,
  },
};

const mockfetcher = fetchCostModels as jest.Mock;
const mockupdater = updateCostModel as jest.Mock;
const mockdeleter = deleteCostModel as jest.Mock;

const createCostModelsStore = createMockStoreCreator({
  [stateKey]: costModelsReducer,
});

// Avoid spying on ESM exports; assert via selectors and state

test('default state', async () => {
  const store = createCostModelsStore();
  expect(store.getState()).toMatchSnapshot();
});

test('update cost model filter', async () => {
  const store = createCostModelsStore();
  expect(selectors.currentFilterType(store.getState())).toBe('name');
  expect(selectors.currentFilterValue(store.getState())).toBe('');
  store.dispatch(
    actions.updateFilterToolbar({
      currentFilterType: 'type',
      currentFilterValue: '',
    })
  );
  expect(selectors.currentFilterType(store.getState())).toBe('type');
  expect(selectors.currentFilterValue(store.getState())).toBe('');
  store.dispatch(
    actions.updateFilterToolbar({
      currentFilterType: 'type',
      currentFilterValue: 'OCP',
    })
  );
  expect(selectors.currentFilterType(store.getState())).toBe('type');
  expect(selectors.currentFilterValue(store.getState())).toBe('OCP');
});

test('select a cost model and reset', async () => {
  const store = createCostModelsStore();
  expect(selectors.selected(store.getState())).toBe(null);
  store.dispatch(actions.selectCostModel(costmodel1));
  expect(selectors.selected(store.getState())).toEqual(costmodel1);
  store.dispatch(actions.resetCostModel());
  expect(selectors.selected(store.getState())).toBe(null);
});

test('fetching cost models succeeded', async () => {
  mockfetcher.mockReturnValueOnce(Promise.resolve({ data: costmodels }));
  const store = createCostModelsStore();
  expect(selectors.costModels(store.getState())).toEqual([]);
  expect(selectors.error(store.getState())).toEqual(null);
  store.dispatch(actions.fetchCostModels());
  expect(selectors.status(store.getState())).toBe(FetchStatus.inProgress);
  await waitFor(() => expect(selectors.status(store.getState())).toBe(FetchStatus.complete));
  expect(selectors.costModels(store.getState())).toEqual([costmodel1]);
  expect(selectors.error(store.getState())).toEqual(null);
  expect(selectors.status(store.getState())).toBe(FetchStatus.complete);
});

test('fetching cost models failed', async () => {
  const error = {
    response: {
      data: { errors: [{ source: 'name', detail: 'is already taken' }] },
    },
  };
  mockfetcher.mockReturnValueOnce(Promise.reject(error));
  const store = createCostModelsStore();
  expect(selectors.costModels(store.getState())).toEqual([]);
  expect(selectors.error(store.getState())).toEqual(null);
  store.dispatch(actions.fetchCostModels());
  expect(selectors.status(store.getState())).toBe(FetchStatus.inProgress);
  await waitFor(() => expect(selectors.status(store.getState())).toBe(FetchStatus.complete));
  expect(selectors.costModels(store.getState())).toEqual([]);
  expect(selectors.error(store.getState())).toEqual(error);
  expect(selectors.status(store.getState())).toBe(FetchStatus.complete);
});

test('display and hide dialogs', async () => {
  const store = createCostModelsStore();
  ['addRate', 'addSource', 'deleteRate', 'deleteSource', 'updateRate'].forEach(dialog => {
    const initState = store.getState()[stateKey].isDialogOpen;
    expect(Object.keys(initState).every(name => initState[name] === false)).toBe(true);
    store.dispatch(actions.setCostModelDialog({ name: dialog, isOpen: true }));
    const onOpenState = store.getState()[stateKey].isDialogOpen;
    expect(
      Object.keys(onOpenState)
        .filter(name => name !== dialog)
        .every(name => onOpenState[name] === false)
    ).toBe(true);
    expect(onOpenState[dialog]).toBe(true);
    store.dispatch(actions.setCostModelDialog({ name: dialog, isOpen: false }));
  });
  const endState = store.getState()[stateKey].isDialogOpen;
  expect(Object.keys(endState).every(name => endState[name] === false)).toBe(true);
});

test('updating a cost model succeeded', async () => {
  mockupdater.mockReturnValue(Promise.resolve({ data: updated_costmodel1 }));
  mockfetcher.mockReturnValueOnce(Promise.resolve({ data: costmodels }));
  const store = createCostModelsStore();
  store.dispatch(actions.selectCostModel(costmodel1));
  expect(selectors.selected(store.getState())).toEqual(costmodel1);
  expect(selectors.updateError(store.getState())).toBe('');
  store.dispatch(actions.updateCostModel());
  expect(selectors.updateProcessing(store.getState())).toBe(true);
  await waitFor(() => expect(selectors.updateProcessing(store.getState())).toBe(false));
  expect(selectors.selected(store.getState())).toEqual(updated_costmodel1);
  expect(selectors.updateError(store.getState())).toEqual('');
  expect(selectors.updateProcessing(store.getState())).toBe(false);
});

test('updating a cost model failed', async () => {
  mockupdater.mockReturnValue(new Promise((s, r) => r(new Error('oops'))));
  const store = createCostModelsStore();
  store.dispatch(actions.selectCostModel(costmodel1));
  expect(selectors.selected(store.getState())).toEqual(costmodel1);
  expect(selectors.updateError(store.getState())).toBe('');
  expect(selectors.updateProcessing(store.getState())).toBe(false);
  store.dispatch(actions.updateCostModel());
  expect(selectors.updateProcessing(store.getState())).toBe(true);
  await waitFor(() => expect(selectors.updateProcessing(store.getState())).toBe(false));
  expect(selectors.selected(store.getState())).toEqual(costmodel1);
  expect(selectors.updateError(store.getState())).toEqual('oops');
  expect(selectors.updateProcessing(store.getState())).toBe(false);
});

test('deleting a cost model succeeded', async () => {
  mockfetcher.mockReturnValueOnce(Promise.resolve({ data: costmodels }));
  mockdeleter.mockReturnValueOnce(Promise.resolve({}));
  const store = createCostModelsStore();
  store.dispatch(actions.setCostModelDialog({ isOpen: true, name: 'deleteCostModel' }));
  expect(selectors.deleteError(store.getState())).toBe('');
  store.dispatch(actions.deleteCostModel('11123', 'deleteCostModel'));
  expect(selectors.deleteProcessing(store.getState())).toBe(true);
  expect(selectors.isDialogOpen(store.getState())('costmodel').deleteCostModel).toBe(true);
  await waitFor(() => expect(selectors.deleteProcessing(store.getState())).toBe(false));
  expect(selectors.deleteError(store.getState())).toEqual('');
  expect(selectors.deleteProcessing(store.getState())).toBe(false);
  expect(selectors.isDialogOpen(store.getState())('costmodel').deleteCostModel).toBe(false);
});

test('deleting a cost model failed', async () => {
  const store = createCostModelsStore();
  mockdeleter.mockReturnValue(new Promise((s, r) => r(new Error('oops'))));
  store.dispatch(actions.setCostModelDialog({ isOpen: true, name: 'deleteCostModel' }));
  expect(selectors.isDialogOpen(store.getState())('costmodel').deleteCostModel).toBe(true);
  expect(selectors.deleteError(store.getState())).toBe('');
  expect(selectors.deleteProcessing(store.getState())).toBe(false);
  store.dispatch(actions.deleteCostModel('111', 'deleteCostModel'));
  expect(selectors.deleteProcessing(store.getState())).toBe(true);
  await waitFor(() => expect(selectors.deleteProcessing(store.getState())).toBe(false));
  expect(selectors.deleteError(store.getState())).toEqual('oops');
  expect(selectors.deleteProcessing(store.getState())).toBe(false);
  expect(selectors.isDialogOpen(store.getState())('costmodel').deleteCostModel).toBe(true);
});

describe('query selector', () => {
  test('missing links in payload', () => {
    const store = createCostModelsStore();
    store.dispatch(
      actions.fetchCostModelsSuccess({
        data: null,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {},
      })
    );
    expect(selectors.query(store.getState())).toEqual({
      currency: null,
      description: null,
      limit: null,
      name: null,
      source_type: null,
      offset: null,
      ordering: null,
    });
  });
  test('no filters', () => {
    const store = createCostModelsStore();
    store.dispatch(
      actions.fetchCostModelsSuccess({
        data: {
          links: {
            first: 'http://costmanagement.com',
          },
        },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {},
      })
    );
    expect(selectors.query(store.getState())).toEqual({
      currency: null,
      description: null,
      limit: null,
      name: null,
      source_type: null,
      offset: null,
      ordering: null,
    });
  });
  test('get filters', () => {
    const store = createCostModelsStore();
    store.dispatch(
      actions.fetchCostModelsSuccess({
        data: {
          links: {
            first: 'http://costmanagement.com?ordering=-name&name=costmodel1&source_type=OCP&offset=10&limit=10',
          },
        },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {},
      })
    );
    expect(selectors.query(store.getState())).toEqual({
      currency: null,
      description: null,
      limit: '10',
      name: 'costmodel1',
      offset: '10',
      ordering: '-name',
      source_type: 'OCP',
    });
  });
});
