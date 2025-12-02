import axiosInstance from '../api';

import { OrgPathsType, OrgType } from './org';
import { runOrg } from './orgUtils';

test('api run reports calls axios get', () => {
  const query = 'filter[resolution]=daily';
  runOrg(OrgPathsType.aws, OrgType.org, query);
  expect(axiosInstance.get).toHaveBeenCalledWith(`organizations/aws/?${query}`);
});
