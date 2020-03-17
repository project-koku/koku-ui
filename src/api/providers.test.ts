import { getProvidersQuery } from 'api/queries/providersQuery';

jest.mock('axios');

import axios from 'axios';
import { awsProvidersQuery } from 'store/providers/providersCommon';
import { fetchProviders } from './providers';

test('api get provider calls axios.get', () => {
  const query = getProvidersQuery(awsProvidersQuery);
  fetchProviders(query);
  expect(axios.get).toBeCalledWith('sources/?type=AWS');
});
