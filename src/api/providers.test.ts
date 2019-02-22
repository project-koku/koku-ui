import { getProvidersQuery } from './providersQuery';

jest.mock('axios');

import axios from 'axios';
import { awsProvidersQuery } from 'store/providers/providersCommon';
import { addProvider, fetchProviders, ProviderRequest } from './providers';

test('api add provider calls axios.post', () => {
  const request: ProviderRequest = {
    name: 'provider_name',
    type: 'provider_type',
    authentication: {
      provider_resource_name: 'resource_name',
    },
    billing_source: {
      bucket: 'bucket',
    },
  };
  addProvider(request);
  expect(axios.post).toBeCalledWith('providers/', request);
});

test('api get provider calls axios.get', () => {
  const query = getProvidersQuery(awsProvidersQuery);
  fetchProviders(query);
  expect(axios.get).toBeCalledWith('providers/?type=AWS');
});
