import { runReport } from './reportUtils';
import { ReportPathsType, ReportType } from './report';

jest.mock('./awsReports', () => ({ runReport: jest.fn(() => 'aws') }));
jest.mock('./awsOcpReports', () => ({ runReport: jest.fn(() => 'awsOcp') }));
jest.mock('./azureReports', () => ({ runReport: jest.fn(() => 'azure') }));
jest.mock('./azureOcpReports', () => ({ runReport: jest.fn(() => 'azureOcp') }));
jest.mock('./gcpReports', () => ({ runReport: jest.fn(() => 'gcp') }));
jest.mock('./gcpOcpReports', () => ({ runReport: jest.fn(() => 'gcpOcp') }));
jest.mock('./ocpReports', () => ({ runReport: jest.fn(() => 'ocp') }));
jest.mock('./ocpCloudReports', () => ({ runReport: jest.fn(() => 'ocpCloud') }));

import { runReport as runAwsOcpReport } from './awsOcpReports';
import { runReport as runAwsReport } from './awsReports';
import { runReport as runAzureOcpReport } from './azureOcpReports';
import { runReport as runAzureReport } from './azureReports';
import { runReport as runGcpOcpReport } from './gcpOcpReports';
import { runReport as runGcpReport } from './gcpReports';
import { runReport as runOcpCloudReport } from './ocpCloudReports';
import { runReport as runOcpReport } from './ocpReports';

describe('runReport', () => {
  const query = 'filter[resolution]=daily';

  test.each([
    [ReportPathsType.aws, runAwsReport, 'aws'],
    [ReportPathsType.awsOcp, runAwsOcpReport, 'awsOcp'],
    [ReportPathsType.azure, runAzureReport, 'azure'],
    [ReportPathsType.azureOcp, runAzureOcpReport, 'azureOcp'],
    [ReportPathsType.gcp, runGcpReport, 'gcp'],
    [ReportPathsType.gcpOcp, runGcpOcpReport, 'gcpOcp'],
    [ReportPathsType.ocp, runOcpReport, 'ocp'],
    [ReportPathsType.ocpCloud, runOcpCloudReport, 'ocpCloud'],
  ] as const)('dispatches %s reports', (pathType, fn, result) => {
    expect(runReport(pathType, ReportType.cost, query)).toBe(result);
    expect(fn).toHaveBeenCalledWith(ReportType.cost, query);
  });

  test('returns undefined for unknown path types', () => {
    expect(runReport('unknown' as ReportPathsType, ReportType.cost, query)).toBeUndefined();
  });
});
