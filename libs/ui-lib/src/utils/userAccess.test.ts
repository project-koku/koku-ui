import type { Providers } from '@koku-ui/api/providers';
import type { UserAccess } from '@koku-ui/api/userAccess';
import { UserAccessType } from '@koku-ui/api/userAccess';

import {
  hasAwsAccess,
  hasAzureAccess,
  hasCostModelAccess,
  hasGcpAccess,
  hasOcpAccess,
  hasSettingsAccess,
  isAwsAvailable,
  isAzureAvailable,
  isGcpAvailable,
  isOcpAvailable,
} from './userAccess';

const makeProviders = (count: number): Providers => ({
  data: [],
  meta: { count } as any,
  links: { first: '', last: '', next: '', previous: '' },
});

describe('utils/userAccess', () => {
  const arrayShapeAccess = (type: UserAccessType, access = true): UserAccess => ({
    meta: { count: 1 } as any,
    data: [{ type, access }],
  });

  const booleanShapeAccess = (access = true): UserAccess => ({
    meta: { count: 1 } as any,
    data: access,
  });

  test('has*Access with array-shaped data', () => {
    expect(hasAwsAccess(arrayShapeAccess(UserAccessType.aws))).toBe(true);
    expect(hasAzureAccess(arrayShapeAccess(UserAccessType.azure))).toBe(true);
    expect(hasCostModelAccess(arrayShapeAccess(UserAccessType.cost_model))).toBe(true);
    expect(hasGcpAccess(arrayShapeAccess(UserAccessType.gcp))).toBe(true);
    expect(hasOcpAccess(arrayShapeAccess(UserAccessType.ocp))).toBe(true);
    expect(hasSettingsAccess(arrayShapeAccess(UserAccessType.settings))).toBe(true);
  });

  test('has*Access with boolean-shaped data', () => {
    const userAccess = booleanShapeAccess(true);
    expect(hasAwsAccess(userAccess)).toBe(true);
    expect(hasAzureAccess(userAccess)).toBe(true);
    expect(hasCostModelAccess(userAccess)).toBe(true);
    expect(hasGcpAccess(userAccess)).toBe(true);
    expect(hasOcpAccess(userAccess)).toBe(true);
    expect(hasSettingsAccess(userAccess)).toBe(true);
  });

  test('is*Available requires both access and providers', () => {
    const providersNone = makeProviders(0);
    const providersSome = makeProviders(2);

    expect(isAwsAvailable(arrayShapeAccess(UserAccessType.aws, true), providersSome)).toBe(true);
    expect(isAwsAvailable(arrayShapeAccess(UserAccessType.aws, false), providersSome)).toBe(false);
    expect(isAwsAvailable(arrayShapeAccess(UserAccessType.aws, true), providersNone)).toBe(false);

    expect(isAzureAvailable(arrayShapeAccess(UserAccessType.azure, true), providersSome)).toBe(true);
    expect(isGcpAvailable(arrayShapeAccess(UserAccessType.gcp, true), providersSome)).toBe(true);
    expect(isOcpAvailable(arrayShapeAccess(UserAccessType.ocp, true), providersSome)).toBe(true);
  });
}); 