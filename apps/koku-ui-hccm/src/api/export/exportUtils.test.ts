import { ReportPathsType, ReportType } from 'api/reports/report';

import { runExport } from './exportUtils';

jest.mock('./awsExport', () => ({ runExport: jest.fn(() => 'aws') }));
jest.mock('./awsOcpExport', () => ({ runExport: jest.fn(() => 'awsOcp') }));
jest.mock('./azureExport', () => ({ runExport: jest.fn(() => 'azure') }));
jest.mock('./azureOcpExport', () => ({ runExport: jest.fn(() => 'azureOcp') }));
jest.mock('./gcpExport', () => ({ runExport: jest.fn(() => 'gcp') }));
jest.mock('./gcpOcpExport', () => ({ runExport: jest.fn(() => 'gcpOcp') }));
jest.mock('./ocpCloudExport', () => ({ runExport: jest.fn(() => 'ocpCloud') }));
jest.mock('./ocpExport', () => ({ runExport: jest.fn(() => 'ocp') }));

import { runExport as runAwsExport } from './awsExport';
import { runExport as runAwsOcpExport } from './awsOcpExport';
import { runExport as runAzureExport } from './azureExport';
import { runExport as runAzureOcpExport } from './azureOcpExport';
import { runExport as runGcpExport } from './gcpExport';
import { runExport as runGcpOcpExport } from './gcpOcpExport';
import { runExport as runOcpCloudExport } from './ocpCloudExport';
import { runExport as runOcpExport } from './ocpExport';

describe('runExport', () => {
  const query = 'group_by[account]=*';

  test.each([
    [ReportPathsType.aws, runAwsExport, 'aws'],
    [ReportPathsType.awsOcp, runAwsOcpExport, 'awsOcp'],
    [ReportPathsType.azure, runAzureExport, 'azure'],
    [ReportPathsType.azureOcp, runAzureOcpExport, 'azureOcp'],
    [ReportPathsType.gcp, runGcpExport, 'gcp'],
    [ReportPathsType.gcpOcp, runGcpOcpExport, 'gcpOcp'],
    [ReportPathsType.ocpCloud, runOcpCloudExport, 'ocpCloud'],
    [ReportPathsType.ocp, runOcpExport, 'ocp'],
  ] as const)('dispatches %s exports', (pathType, fn, result) => {
    expect(runExport(pathType, ReportType.cost, query)).toBe(result);
    expect(fn).toHaveBeenCalledWith(ReportType.cost, query);
  });

  test('returns undefined for unknown path types', () => {
    expect(runExport('unknown' as ReportPathsType, ReportType.cost, query)).toBeUndefined();
  });
});
