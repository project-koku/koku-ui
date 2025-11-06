import { axiosInstance } from 'api';
import { getUserAccessQuery } from 'api/queries/userAccessQuery';
import { awsUserAccessQuery } from 'store/userAccess/userAccessCommon';

import { fetchUserAccess } from './userAccess';

test('api get provider calls axiosInstance.get', () => {
  const query = getUserAccessQuery(awsUserAccessQuery);
  fetchUserAccess(query);
  expect(axiosInstance.get).toHaveBeenCalledWith('user-access/?type=AWS');
});
