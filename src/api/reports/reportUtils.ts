import { runReport as runAwsCloudReport } from './awsCloudReports';
import { runReport as runAwsReport } from './awsReports';
import { runReport as runAzureCloudReport } from './azureCloudReports';
import { runReport as runAzureReport } from './azureReports';
import { runReport as runGcpReport } from './gcpReports';
import { runReport as runOcpCloudReport } from './ocpCloudReports';
import { runReport as runOcpReport } from './ocpReports';
import { runReport as runOcpUsageReport } from './ocpUsageReports';
import { ReportPathsType, ReportType } from './report';

export function runReport(reportPathsType: ReportPathsType, reportType: ReportType, query: string) {
  let report;
  switch (reportPathsType) {
    case ReportPathsType.aws:
      report = runAwsReport(reportType, query);
      break;
    case ReportPathsType.awsCloud:
      report = runAwsCloudReport(reportType, query);
      break;
    case ReportPathsType.azure:
      report = runAzureReport(reportType, query);
      break;
    case ReportPathsType.azureCloud:
      report = runAzureCloudReport(reportType, query);
      break;
    case ReportPathsType.gcp:
      report = runGcpReport(reportType, query);
      break;
    case ReportPathsType.ocp:
      report = runOcpReport(reportType, query);
      break;
    case ReportPathsType.ocpCloud:
      report = runOcpCloudReport(reportType, query);
      break;
    case ReportPathsType.ocpUsage:
      report = runOcpUsageReport(reportType, query);
      break;
  }
  return report;
}
