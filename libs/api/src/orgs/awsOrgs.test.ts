import axiosInstance from '../api';

import { runOrg } from './awsOrgs';
import { OrgType } from './org';

test('api run reports calls axios get', () => {
  const query = 'filter[resolution]=daily';
  runOrg(OrgType.org, query);
  expect(axiosInstance.get).toHaveBeenCalledWith(`organizations/aws/?${query}`);
});
