import axiosInstance from './api';
import { getProvidersQuery, ProvidersQuery } from './queries/providersQuery';
import { fetchProviders } from './providers';

const awsProvidersQuery: ProvidersQuery = {
  limit: 100,
  type: 'AWS',
};

test('api get provider calls axiosInstance.get', () => {
  const query = getProvidersQuery(awsProvidersQuery);
  fetchProviders(query);
  expect(axiosInstance.get).toHaveBeenCalledWith('sources/?limit=100&type=AWS');
});
