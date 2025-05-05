import { runReport as runAwsOcpReport } from './awsOcpReports';
import { runReport as runAwsReport } from './awsReports';
import { runReport as runAzureOcpReport } from './azureOcpReports';
import { runReport as runAzureReport } from './azureReports';
import { runReport as runGcpOcpReport } from './gcpOcpReports';
import { runReport as runGcpReport } from './gcpReports';
import { runReport as runOcpCloudReport } from './ocpCloudReports';
import { runReport as runOcpReport } from './ocpReports';
import type { ReportType } from './report';
import { ReportPathsType } from './report';

export function runReport(reportPathsType: ReportPathsType, reportType: ReportType, query: string) {
  let result;
  switch (reportPathsType) {
    case ReportPathsType.aws:
      result = runAwsReport(reportType, query);
      break;
    case ReportPathsType.awsOcp:
      result = runAwsOcpReport(reportType, query);
      break;
    case ReportPathsType.azure:
      result = runAzureReport(reportType, query);
      break;
    case ReportPathsType.azureOcp:
      result = runAzureOcpReport(reportType, query);
      break;
    case ReportPathsType.gcp:
      result = runGcpReport(reportType, query);
      break;
    case ReportPathsType.gcpOcp:
      result = runGcpOcpReport(reportType, query);
      break;
    case ReportPathsType.ocp:
      result = runOcpReport(reportType, query);
      break;
    case ReportPathsType.ocpCloud:
      result = runOcpCloudReport(reportType, query);
      break;
  }
  return result;
}
