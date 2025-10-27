import { axiosInstance } from 'api';
import { getProvidersQuery } from 'api/queries/providersQuery';
import { awsProvidersQuery } from 'store/providers/providersCommon';

import { fetchProviders } from './providers';

test('api get provider calls axiosInstance.get', () => {
  const query = getProvidersQuery(awsProvidersQuery);
  fetchProviders(query);
  expect(axiosInstance.get).toHaveBeenCalledWith('sources/?limit=100&type=AWS');
});
