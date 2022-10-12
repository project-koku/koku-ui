import { getUserAccessQuery } from 'api/queries/userAccessQuery';
import axios from 'axios';
import { awsUserAccessQuery } from 'store/userAccess/userAccessCommon';

import { fetchUserAccess } from './userAccess';

test('api get provider calls axios.get', () => {
  const query = getUserAccessQuery(awsUserAccessQuery);
  fetchUserAccess(query);
  expect(axios.get).toBeCalledWith('user-access/?type=AWS');
});
