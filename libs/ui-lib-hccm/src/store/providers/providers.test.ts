jest.mock('@koku-ui/api/providers');

import { waitFor } from '@testing-library/react';
import type { Providers } from '@koku-ui/api/providers';
import { fetchProviders, ProviderType } from '@koku-ui/api/providers';
import { getProvidersQuery } from '@koku-ui/api/queries/providersQuery';
import { FetchStatus } from '../common';
import { createMockStoreCreator } from '../mockStore';

import * as actions from './providersActions';
import { awsProvidersQuery, stateKey } from './providersCommon';
import { providersReducer } from './providersReducer';
import * as selectors from './providersSelectors';

const createProdvidersStore = createMockStoreCreator({
  [stateKey]: providersReducer,
});

const fetchProvidersMock = fetchProviders as jest.Mock;

const providersMock: Providers = {
  data: [
    {
      uuid: 'af0b1a48-7306-483b-b4af-5e874e553d48',
      name: 'AWSHCCM',
      type: 'AWS',
      authentication: {
        uuid: 'd248bc53-7283-43bb-bce9-ea60de6fec37',
        provider_resource_name: 'arn:aws:iam::589173575009:role/CostManagement',
      },
      billing_source: {
        uuid: '75b3ed55-efdc-4d72-800c-a2f6bed6d877',
        bucket: 'cost-usage-bucket',
      },
      customer: {
        uuid: '7aa30a69-f1a8-465d-92f2-c886cdfd0e17',
        name: 'dev-internal',
        owner: {
          uuid: '1b47eafa-71ab-4d8c-b040-072fba5a5fb7',
          username: 'chambrid',
          email: 'chambrid@redhat.com',
        },
        date_created: '2018-08-24T13:47:15.777541Z',
      },
      created_by: {
        uuid: '1b47eafa-71ab-4d8c-b040-072fba5a5fb7',
        username: 'chambrid',
        email: 'chambrid@redhat.com',
      },
    },
  ],
};

fetchProvidersMock.mockReturnValue(Promise.resolve({ data: providersMock }));

test('default state', async () => {
  const store = createProdvidersStore();
  expect(selectors.selectProvidersState(store.getState())).toMatchSnapshot();
});

test('fetch providers success', async () => {
  const query = getProvidersQuery(awsProvidersQuery);
  const store = createProdvidersStore();
  store.dispatch(actions.fetchProviders(ProviderType.aws, query));
  expect(fetchProvidersMock).toHaveBeenCalled();
  expect(selectors.selectProvidersFetchStatus(store.getState(), ProviderType.aws, query)).toBe(FetchStatus.inProgress);
  await waitFor(() =>
    expect(selectors.selectProvidersFetchStatus(store.getState(), ProviderType.aws, query)).toBe(FetchStatus.complete)
  );
  const finishedState = store.getState();
  expect(selectors.selectProvidersFetchStatus(finishedState, ProviderType.aws, query)).toBe(FetchStatus.complete);
});

test('fetch providers failure', async () => {
  const query = getProvidersQuery(awsProvidersQuery);
  const store = createProdvidersStore();
  const error = Symbol('getProviders error');
  fetchProvidersMock.mockReturnValueOnce(Promise.reject(error));
  store.dispatch(actions.fetchProviders(ProviderType.aws, query));
  expect(fetchProvidersMock).toHaveBeenCalled();
  expect(selectors.selectProvidersFetchStatus(store.getState(), ProviderType.aws, query)).toBe(FetchStatus.inProgress);
  await waitFor(() =>
    expect(selectors.selectProvidersFetchStatus(store.getState(), ProviderType.aws, query)).toBe(FetchStatus.complete)
  );
  const finishedState = store.getState();
  expect(selectors.selectProvidersFetchStatus(finishedState, ProviderType.aws, query)).toBe(FetchStatus.complete);
});
