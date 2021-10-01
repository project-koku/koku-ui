jest.mock('api/currency');

import { waitFor } from '@testing-library/react';
import { Currency, fetchCurrency } from 'api/currency';
import { FetchStatus } from 'store/common';
import { createMockStoreCreator } from 'store/mockStore';

import * as actions from './currencyActions';
import { stateKey } from './currencyCommon';
import { currencyReducer } from './currencyReducer';
import * as selectors from './currencySelectors';

const createProdvidersStore = createMockStoreCreator({
  [stateKey]: currencyReducer,
});

const fetchCurrencyMock = fetchCurrency as jest.Mock;

const currencyMock: Currency = {
  data: [
    {
      code: 'USD',
      description: 'USD ($) - United States Dollar',
      name: 'United States Dollar',
      symbol: '$',
    },
  ],
};

fetchCurrencyMock.mockReturnValue(Promise.resolve({ data: currencyMock }));

jest.spyOn(selectors, 'selectCurrencyFetchStatus');

test('default state', async () => {
  const store = createProdvidersStore();
  expect(selectors.selectCurrencyState(store.getState())).toMatchSnapshot();
});

test('fetch currency success', async () => {
  const store = createProdvidersStore();
  store.dispatch(actions.fetchCurrency());
  expect(fetchCurrencyMock).toBeCalled();
  expect(selectors.selectCurrencyFetchStatus(store.getState())).toBe(FetchStatus.inProgress);
  await waitFor(() => expect(selectors.selectCurrencyFetchStatus).toHaveBeenCalled());
  const finishedState = store.getState();
  expect(selectors.selectCurrencyFetchStatus(finishedState)).toBe(FetchStatus.complete);
});

test('fetch currency failure', async () => {
  const store = createProdvidersStore();
  const error = Symbol('getCurrency error');
  fetchCurrencyMock.mockReturnValueOnce(Promise.reject(error));
  store.dispatch(actions.fetchCurrency());
  expect(fetchCurrencyMock).toBeCalled();
  expect(selectors.selectCurrencyFetchStatus(store.getState())).toBe(FetchStatus.inProgress);
  await waitFor(() => expect(selectors.selectCurrencyFetchStatus).toHaveBeenCalled());
  const finishedState = store.getState();
  expect(selectors.selectCurrencyFetchStatus(finishedState)).toBe(FetchStatus.complete);
});
