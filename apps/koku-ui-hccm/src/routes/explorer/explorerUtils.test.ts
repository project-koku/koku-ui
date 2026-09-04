import type { Providers } from 'api/providers';
import type { UserAccess } from 'api/userAccess';
import { UserAccessType } from 'api/userAccess';

import { getPerspectiveDefault, PerspectiveType } from './explorerUtils';

let mockIsOnPremEnabled = false;

jest.mock('components/featureToggle', () => ({
  get isOnPremEnabled() {
    return mockIsOnPremEnabled;
  },
}));

const makeProviders = (count: number): Providers => ({
  data: [],
  meta: { count } as any,
  links: { first: '', last: '', next: '', previous: '' },
});

const makeUserAccess = (...types: UserAccessType[]): UserAccess => ({
  meta: { count: types.length } as any,
  data: types.map(type => ({ type, access: true })),
});

describe('getPerspectiveDefault', () => {
  const awsProviders = makeProviders(1);
  const azureProviders = makeProviders(1);
  const gcpProviders = makeProviders(1);
  const ocpProviders = makeProviders(1);
  const userAccess = makeUserAccess(UserAccessType.aws, UserAccessType.azure, UserAccessType.gcp, UserAccessType.ocp);

  beforeEach(() => {
    mockIsOnPremEnabled = false;
  });

  test('honors cloud perspective query param when on-prem is disabled', () => {
    expect(
      getPerspectiveDefault({
        awsProviders,
        azureProviders,
        gcpProviders,
        ocpProviders,
        queryFromRoute: { perspective: PerspectiveType.aws },
        userAccess,
      })
    ).toBe(PerspectiveType.aws);
  });

  test('defaults to OpenShift and ignores cloud query params when on-prem is enabled', () => {
    mockIsOnPremEnabled = true;
    expect(
      getPerspectiveDefault({
        awsProviders,
        azureProviders,
        gcpProviders,
        ocpProviders,
        queryFromRoute: { perspective: PerspectiveType.aws },
        userAccess,
      })
    ).toBe(PerspectiveType.ocp);
  });
});
