jest.mock('./awsOcpReports', () => ({ runReport: jest.fn(() => 'awsOcp') }));
jest.mock('./awsReports', () => ({ runReport: jest.fn(() => 'aws') }));
jest.mock('./azureOcpReports', () => ({ runReport: jest.fn(() => 'azureOcp') }));
jest.mock('./azureReports', () => ({ runReport: jest.fn(() => 'azure') }));
jest.mock('./gcpOcpReports', () => ({ runReport: jest.fn(() => 'gcpOcp') }));
jest.mock('./gcpReports', () => ({ runReport: jest.fn(() => 'gcp') }));
jest.mock('./ocpCloudReports', () => ({ runReport: jest.fn(() => 'ocpCloud') }));
jest.mock('./ocpReports', () => ({ runReport: jest.fn(() => 'ocp') }));

import { ReportPathsType, ReportType } from './report';
import { runReport } from './reportUtils';

const q = '?limit=1';

describe('runReport dispatches to provider module', () => {
  it.each([
    [ReportPathsType.aws, 'aws'],
    [ReportPathsType.awsOcp, 'awsOcp'],
    [ReportPathsType.azure, 'azure'],
    [ReportPathsType.azureOcp, 'azureOcp'],
    [ReportPathsType.gcp, 'gcp'],
    [ReportPathsType.gcpOcp, 'gcpOcp'],
    [ReportPathsType.ocp, 'ocp'],
    [ReportPathsType.ocpCloud, 'ocpCloud'],
  ] as const)('uses %s runner', (pathsType, expected) => {
    expect(runReport(pathsType, ReportType.cost, q)).toBe(expected);
  });
});
