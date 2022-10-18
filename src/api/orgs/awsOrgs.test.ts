import axios from 'axios';

import { runOrg } from './awsOrgs';
import { OrgType } from './org';

test('api run reports calls axios get', () => {
  const query = 'filter[resolution]=daily';
  runOrg(OrgType.org, query);
  expect(axios.get).toBeCalledWith(`organizations/aws/?${query}`);
});
