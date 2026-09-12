import * as userAccess from './index';

test('re-exports user access store helpers', () => {
  expect(userAccess.userAccessActions).toBeDefined();
  expect(userAccess.userAccessReducer).toBeDefined();
  expect(userAccess.userAccessSelectors).toBeDefined();
  expect(userAccess.userAccessQuery).toBeDefined();
  expect(userAccess.awsUserAccessQuery).toBeDefined();
  expect(userAccess.azureUserAccessQuery).toBeDefined();
  expect(userAccess.costModelUserAccessQuery).toBeDefined();
  expect(userAccess.gcpUserAccessQuery).toBeDefined();
  expect(userAccess.ibmUserAccessQuery).toBeDefined();
  expect(userAccess.ocpUserAccessQuery).toBeDefined();
  expect(userAccess.userAccessStateKey).toBeDefined();
});
