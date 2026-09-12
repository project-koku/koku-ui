import type { Providers } from 'api/providers';
import type { UserAccess } from 'api/userAccess';
import { UserAccessType } from 'api/userAccess';

import {
  hasAwsAccess,
  hasAzureAccess,
  hasCostModelAccess,
  hasGcpAccess,
  hasIbmAccess,
  hasOciAccess,
  hasOcpAccess,
  hasRhelAccess,
  hasRosAccess,
  hasSettingsAccess,
  isAwsAvailable,
  isAzureAvailable,
  isGcpAvailable,
  isIbmAvailable,
  isOciAvailable,
  isOcpAvailable,
  isRhelAvailable,
  isRosAvailable,
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
    expect(hasIbmAccess(arrayShapeAccess(UserAccessType.gcp))).toBe(true);
    expect(hasOciAccess(arrayShapeAccess(UserAccessType.oci))).toBe(true);
    expect(hasOcpAccess(arrayShapeAccess(UserAccessType.ocp))).toBe(true);
    expect(hasRhelAccess(arrayShapeAccess(UserAccessType.rhel))).toBe(true);
    expect(hasRosAccess(arrayShapeAccess(UserAccessType.ros))).toBe(true);
    expect(hasSettingsAccess(arrayShapeAccess(UserAccessType.settings))).toBe(true);
    expect(hasAwsAccess(arrayShapeAccess(UserAccessType.aws, false))).toBe(false);
  });

  test('has*Access with boolean-shaped data', () => {
    const userAccess = booleanShapeAccess(true);
    expect(hasAwsAccess(userAccess)).toBe(true);
    expect(hasAzureAccess(userAccess)).toBe(true);
    expect(hasOcpAccess(userAccess)).toBe(true);
    expect(hasRosAccess(userAccess)).toBe(true);
  });

  test('has*Access without userAccess is false', () => {
    expect(hasAwsAccess(undefined as unknown as UserAccess)).toBe(false);
  });

  test('is*Available requires both access and providers', () => {
    const providersNone = makeProviders(0);
    const providersSome = makeProviders(2);
    const providersMissingMeta = { data: [] } as Providers;

    expect(isAwsAvailable(arrayShapeAccess(UserAccessType.aws, true), providersSome)).toBe(true);
    expect(isAwsAvailable(arrayShapeAccess(UserAccessType.aws, false), providersSome)).toBe(false);
    expect(isAwsAvailable(arrayShapeAccess(UserAccessType.aws, true), providersNone)).toBe(false);
    expect(isAwsAvailable(arrayShapeAccess(UserAccessType.aws, true), providersMissingMeta)).toBe(false);

    expect(isAzureAvailable(arrayShapeAccess(UserAccessType.azure, true), providersSome)).toBe(true);
    expect(isGcpAvailable(arrayShapeAccess(UserAccessType.gcp, true), providersSome)).toBe(true);
    expect(isIbmAvailable(arrayShapeAccess(UserAccessType.gcp, true), providersSome)).toBe(true);
    expect(isOciAvailable(arrayShapeAccess(UserAccessType.oci, true), providersSome)).toBe(true);
    expect(isOcpAvailable(arrayShapeAccess(UserAccessType.ocp, true), providersSome)).toBe(true);
    expect(isRhelAvailable(arrayShapeAccess(UserAccessType.rhel, true), providersSome)).toBe(true);
    expect(isRosAvailable(arrayShapeAccess(UserAccessType.ros, true), providersSome)).toBe(true);
  });
});
