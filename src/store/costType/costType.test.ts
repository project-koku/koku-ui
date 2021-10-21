jest.mock('api/costType');

import { waitFor } from '@testing-library/react';
import { CostType, fetchCostType } from 'api/costType';
import { FetchStatus } from 'store/common';
import { createMockStoreCreator } from 'store/mockStore';

import * as actions from './costTypeActions';
import { stateKey } from './costTypeCommon';
import { costTypeReducer } from './costTypeReducer';
import * as selectors from './costTypeSelectors';

const createProdvidersStore = createMockStoreCreator({
  [stateKey]: costTypeReducer,
});

const fetchCostTypeMock = fetchCostType as jest.Mock;

const costTypeMock: CostType = {
  data: [
    {
      code: 'unblended_cost',
      description: 'Unblended',
      name: 'Usage cost on the day you are charged',
    },
  ],
};

fetchCostTypeMock.mockReturnValue(Promise.resolve({ data: costTypeMock }));

jest.spyOn(selectors, 'selectCostTypeFetchStatus');

test('default state', async () => {
  const store = createProdvidersStore();
  expect(selectors.selectCostTypeState(store.getState())).toMatchSnapshot();
});

test('fetch costType success', async () => {
  const store = createProdvidersStore();
  store.dispatch(actions.fetchCostType());
  expect(fetchCostTypeMock).toBeCalled();
  expect(selectors.selectCostTypeFetchStatus(store.getState())).toBe(FetchStatus.inProgress);
  await waitFor(() => expect(selectors.selectCostTypeFetchStatus).toHaveBeenCalled());
  const finishedState = store.getState();
  expect(selectors.selectCostTypeFetchStatus(finishedState)).toBe(FetchStatus.complete);
});

test('fetch costType failure', async () => {
  const store = createProdvidersStore();
  const error = Symbol('getCostType error');
  fetchCostTypeMock.mockReturnValueOnce(Promise.reject(error));
  store.dispatch(actions.fetchCostType());
  expect(fetchCostTypeMock).toBeCalled();
  expect(selectors.selectCostTypeFetchStatus(store.getState())).toBe(FetchStatus.inProgress);
  await waitFor(() => expect(selectors.selectCostTypeFetchStatus).toHaveBeenCalled());
  const finishedState = store.getState();
  expect(selectors.selectCostTypeFetchStatus(finishedState)).toBe(FetchStatus.complete);
});
