import axiosInstance from './api';
import { getUserAccessQuery, UserAccessQuery } from './queries/userAccessQuery';

import { fetchUserAccess } from './userAccess';

const awsUserAccessQuery: UserAccessQuery = {
  type: 'AWS',
};

test('api get provider calls axiosInstance.get', () => {
  const query = getUserAccessQuery(awsUserAccessQuery);
  fetchUserAccess(query);
  expect(axiosInstance.get).toHaveBeenCalledWith('user-access/?type=AWS');
});
