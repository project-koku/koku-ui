import { OrgPathsType } from 'api/orgs/org';
import type { Providers } from 'api/providers';
import type { UserAccess } from 'api/userAccess';
import { UserAccessType } from 'api/userAccess';
import { ReportPathsType, ReportType } from 'api/reports/report';
import { ResourcePathsType } from 'api/resources/resource';
import { TagPathsType } from 'api/tags/tag';

import {
  getGroupByDefault,
  getGroupByOptions,
  getIsDataAvailable,
  getOrgReportPathsType,
  getPerspectiveDefault,
  getReportPathsType,
  getReportType,
  getResourcePathsType,
  getTagReportPathsType,
  groupByAwsOptions,
  groupByAzureOptions,
  groupByGcpOcpOptions,
  groupByGcpOptions,
  groupByOcpOptions,
  PerspectiveType,
} from './explorerUtils';

let mockIsOnPremEnabled = false;

jest.mock('components/featureToggle', () => ({
  get isOnPremEnabled() {
    return mockIsOnPremEnabled;
  },
}));

const makeProviders = (count: number, extra: Partial<Providers['data'][number]> = {}): Providers => ({
  data: count
    ? [
        {
          uuid: 'cloud-1',
          source_type: 'AWS',
          has_data: true,
          current_month_data: true,
          previous_month_data: false,
          ...extra,
        } as any,
      ]
    : [],
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

  test.each([
    PerspectiveType.aws,
    PerspectiveType.awsOcp,
    PerspectiveType.azure,
    PerspectiveType.azureOcp,
    PerspectiveType.gcp,
    PerspectiveType.gcpOcp,
    PerspectiveType.ocpCloud,
  ])('honors %s query param when on-prem is disabled', perspective => {
    expect(
      getPerspectiveDefault({
        awsProviders,
        azureProviders,
        gcpProviders,
        ocpProviders,
        queryFromRoute: { perspective },
        userAccess,
      })
    ).toBe(perspective);
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

  test('returns undefined on-prem when OpenShift is unavailable', () => {
    mockIsOnPremEnabled = true;
    expect(
      getPerspectiveDefault({
        awsProviders,
        azureProviders,
        gcpProviders,
        ocpProviders: makeProviders(0),
        queryFromRoute: {},
        userAccess: makeUserAccess(UserAccessType.aws),
      })
    ).toBeUndefined();
  });

  test('falls back to ocpCloud when a cloud provider is filtered by OpenShift', () => {
    const ocpWithInfra = {
      ...makeProviders(1),
      data: [{ uuid: 'ocp-1', infrastructure: { uuid: 'cloud-1' }, has_data: true } as any],
    };

    expect(
      getPerspectiveDefault({
        awsProviders,
        azureProviders: makeProviders(0),
        gcpProviders: makeProviders(0),
        ocpProviders: ocpWithInfra,
        queryFromRoute: {},
        userAccess: makeUserAccess(UserAccessType.aws),
      })
    ).toBe(PerspectiveType.ocpCloud);
  });

  test.each([
    [UserAccessType.aws, PerspectiveType.aws],
    [UserAccessType.azure, PerspectiveType.azure],
    [UserAccessType.gcp, PerspectiveType.gcp],
  ])('falls back to %s when only that cloud is available', (accessType, expected) => {
    expect(
      getPerspectiveDefault({
        awsProviders: accessType === UserAccessType.aws ? makeProviders(1) : makeProviders(0),
        azureProviders: accessType === UserAccessType.azure ? makeProviders(1) : makeProviders(0),
        gcpProviders: accessType === UserAccessType.gcp ? makeProviders(1) : makeProviders(0),
        ocpProviders: makeProviders(0),
        queryFromRoute: {},
        userAccess: makeUserAccess(accessType),
      })
    ).toBe(expected);
  });

  test('returns undefined when no providers or access exist', () => {
    expect(
      getPerspectiveDefault({
        awsProviders: makeProviders(0),
        azureProviders: makeProviders(0),
        gcpProviders: makeProviders(0),
        ocpProviders: makeProviders(0),
        queryFromRoute: {},
        userAccess: makeUserAccess(),
      })
    ).toBeUndefined();
  });
});

describe('explorer path helpers', () => {
  test.each([
    [PerspectiveType.aws, 'account'],
    [PerspectiveType.awsOcp, 'account'],
    [PerspectiveType.gcp, 'account'],
    [PerspectiveType.gcpOcp, 'account'],
    [PerspectiveType.azure, 'subscription_guid'],
    [PerspectiveType.azureOcp, 'subscription_guid'],
    [PerspectiveType.ocp, 'project'],
    [PerspectiveType.ocpCloud, 'project'],
    ['unknown', undefined],
  ])('getGroupByDefault(%s)', (perspective, expected) => {
    expect(getGroupByDefault(perspective)).toBe(expected);
  });

  test('getGroupByOptions returns perspective-specific options', () => {
    expect(getGroupByOptions(PerspectiveType.aws)).toBe(groupByAwsOptions);
    expect(getGroupByOptions(PerspectiveType.awsOcp)).toEqual([...groupByAwsOptions, ...groupByOcpOptions]);
    expect(getGroupByOptions(PerspectiveType.azure)).toBe(groupByAzureOptions);
    expect(getGroupByOptions(PerspectiveType.azureOcp)).toEqual([...groupByAzureOptions, ...groupByOcpOptions]);
    expect(getGroupByOptions(PerspectiveType.gcp)).toBe(groupByGcpOptions);
    expect(getGroupByOptions(PerspectiveType.gcpOcp)).toEqual([...groupByGcpOcpOptions, ...groupByOcpOptions]);
    expect(getGroupByOptions(PerspectiveType.ocp)).toBe(groupByOcpOptions);
    expect(getGroupByOptions(PerspectiveType.ocpCloud)).toBe(groupByOcpOptions);
    expect(getGroupByOptions('unknown')).toBeUndefined();
  });

  test.each([
    [PerspectiveType.aws, ReportPathsType.aws],
    [PerspectiveType.awsOcp, ReportPathsType.awsOcp],
    [PerspectiveType.azure, ReportPathsType.azure],
    [PerspectiveType.azureOcp, ReportPathsType.azureOcp],
    [PerspectiveType.gcp, ReportPathsType.gcp],
    [PerspectiveType.gcpOcp, ReportPathsType.gcpOcp],
    [PerspectiveType.ocp, ReportPathsType.ocp],
    [PerspectiveType.ocpCloud, ReportPathsType.ocpCloud],
    ['unknown', undefined],
  ])('getReportPathsType(%s)', (perspective, expected) => {
    expect(getReportPathsType(perspective)).toBe(expected);
  });

  test.each([
    [PerspectiveType.aws, ResourcePathsType.aws],
    [PerspectiveType.awsOcp, ResourcePathsType.awsOcp],
    [PerspectiveType.azure, ResourcePathsType.azure],
    [PerspectiveType.azureOcp, ResourcePathsType.azureOcp],
    [PerspectiveType.gcp, ResourcePathsType.gcp],
    [PerspectiveType.gcpOcp, ResourcePathsType.gcpOcp],
    [PerspectiveType.ocp, ResourcePathsType.ocp],
    [PerspectiveType.ocpCloud, ResourcePathsType.ocpCloud],
    ['unknown', undefined],
  ])('getResourcePathsType(%s)', (perspective, expected) => {
    expect(getResourcePathsType(perspective)).toBe(expected);
  });

  test.each([
    [PerspectiveType.aws, TagPathsType.aws],
    [PerspectiveType.awsOcp, TagPathsType.awsOcp],
    [PerspectiveType.azure, TagPathsType.azure],
    [PerspectiveType.azureOcp, TagPathsType.azureOcp],
    [PerspectiveType.gcp, TagPathsType.gcp],
    [PerspectiveType.gcpOcp, TagPathsType.gcpOcp],
    [PerspectiveType.ocp, TagPathsType.ocp],
    [PerspectiveType.ocpCloud, TagPathsType.ocpCloud],
    ['unknown', undefined],
  ])('getTagReportPathsType(%s)', (perspective, expected) => {
    expect(getTagReportPathsType(perspective)).toBe(expected);
  });

  test('getOrgReportPathsType is aws-only', () => {
    expect(getOrgReportPathsType(PerspectiveType.aws)).toBe(OrgPathsType.aws);
    expect(getOrgReportPathsType(PerspectiveType.ocp)).toBeUndefined();
  });

  test('getReportType always returns cost', () => {
    expect(getReportType(PerspectiveType.aws)).toBe(ReportType.cost);
    expect(getReportType('anything')).toBe(ReportType.cost);
  });
});

describe('getIsDataAvailable', () => {
  const awsProviders = makeProviders(1);
  const azureProviders = makeProviders(1, { current_month_data: false, previous_month_data: true });
  const gcpProviders = makeProviders(1);
  const ocpProviders = makeProviders(1);

  test.each([
    [PerspectiveType.aws, true, true, false],
    [PerspectiveType.awsOcp, true, true, false],
    [PerspectiveType.azure, true, false, true],
    [PerspectiveType.azureOcp, true, false, true],
    [PerspectiveType.gcp, true, true, false],
    [PerspectiveType.gcpOcp, true, true, false],
    [PerspectiveType.ocp, true, true, false],
    [PerspectiveType.ocpCloud, true, true, false],
  ])('%s uses the matching provider data flags', (perspective, isDataAvailable, isCurrentMonthData, isPreviousMonthData) => {
    expect(
      getIsDataAvailable({
        awsProviders,
        azureProviders,
        gcpProviders,
        ocpProviders,
        perspective,
      })
    ).toEqual({ isCurrentMonthData, isDataAvailable, isPreviousMonthData });
  });

  test('leaves flags undefined for unknown perspectives', () => {
    expect(
      getIsDataAvailable({
        awsProviders,
        azureProviders,
        gcpProviders,
        ocpProviders,
        perspective: 'unknown',
      })
    ).toEqual({
      isCurrentMonthData: undefined,
      isDataAvailable: undefined,
      isPreviousMonthData: undefined,
    });
  });
});
